/**
 * Kerberus API — backend de orquestração do runtime.
 *
 * Roda na porta 3000, escutando em 0.0.0.0 (acesso via Tailscale).
 * Exposição pública na internet: SEMPRE via túnel Cloudflare Access, nunca direto.
 *
 * Endpoints:
 *   GET /health           → status + uptime do próprio processo
 *   GET /metrics          → métricas de hardware/recursos do host (CPU temp, RAM, disco, uptime)
 *   GET /services         → status ao vivo dos serviços Kerberus (portas conhecidas)
 *   GET /hardware         → detalhe de hardware (temp, RAM, disco, bateria best-effort)
 *   POST /tasks           → dispara tarefa assíncrona no kernel (placeholder do Harness)
 *   GET /docs             → mini-doc JSON (autodescrição dos endpoints)
 *
 * Sem dependências externas — usa só http, fs, os e child_process nativos do Node.
 */

import http from 'node:http'
import crypto from 'node:crypto'
import net from 'node:net'
import os from 'node:os'
import fs from 'node:fs'
import { execSync, exec } from 'node:child_process'

const PORT = Number(process.env.KERBERUS_API_PORT || 3000)
const HOST = process.env.KERBERUS_API_HOST || '0.0.0.0'
const API_TOKEN = process.env.KERBERUS_API_TOKEN || ''
const START = Date.now()

function hasBearer(req) {
  if (!API_TOKEN) return false
  const value = req.headers.authorization || ''
  const supplied = value.startsWith('Bearer ') ? value.slice(7) : ''
  if (!supplied || supplied.length !== API_TOKEN.length) return false
  return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(API_TOKEN))
}

function requireAdmin(req, res) {
  if (!API_TOKEN) {
    send(res, 503, { error: 'Admin API não configurada', code: 'AUTH_NOT_CONFIGURED' })
    return false
  }
  if (!hasBearer(req)) {
    send(res, 401, { error: 'Bearer token obrigatório', code: 'UNAUTHORIZED' })
    return false
  }
  return true
}

const FILE_MESH_DEVICES = [
  { id: 'aspire', name: 'Aspire', role: 'linux-host', status: 'not-tested' },
  { id: 's21', name: 'S21', role: 'android-host', status: 'online' },
  { id: 'motorola', name: 'Motorola', role: 'android-peer', status: 'not-tested' },
]

function fileMeshStatus() {
  return {
    status: 'partial',
    reason: 'Protocolo e shares ainda dependem da auditoria dos três dispositivos; nenhum acesso é inventado.',
    devices: FILE_MESH_DEVICES,
    shares: [],
    checkedAt: new Date().toISOString(),
  }
}

/* ------------------------------------------------------------------ */
/* Helpers de leitura de hardware (best-effort, sem root)             */
/* ------------------------------------------------------------------ */

function readFile(path, fallback = null) {
  try {
    return fs.readFileSync(path, 'utf8').trim()
  } catch {
    return fallback
  }
}

/** Soma das zonas térmicas válidas (temperatura em mili-graus C → graus C). */
function readCpuTemp() {
  const zones = []
  let base = null
  for (let i = 0; i < 40; i++) {
    const type = readFile(`/sys/class/thermal/thermal_zone${i}/type`)
    const temp = readFile(`/sys/class/thermal/thermal_zone${i}/temp`)
    if (type && temp) {
      const v = Number(temp)
      // < 5°C (5000) ou > 150°C = sensor desligado/defeituoso (-40000 etc.)
      if (!Number.isFinite(v) || v < 5000 || v > 150000) continue
      zones.push({ type: type.replace(/-step$/, ''), temp: v / 1000 })
      if (type.includes('cpu') || type.includes('soc') || type.includes('skin') || type.includes('cluster')) base = v / 1000
    }
  }
  if (base == null && zones.length) {
    // fallback: média das zonas de CPU se existirem, senão a zona mais quente
    const cpu = zones.filter((z) => z.type.includes('cpu') || z.type.includes('skin') || z.type.includes('soc'))
    base = cpu.length
      ? cpu.reduce((a, b) => a + b.temp, 0) / cpu.length
      : Math.max(...zones.map((z) => z.temp))
  }
  return { base: base != null ? Math.round(base * 10) / 10 : null, zones: zones.slice(0, 12) }
}

function readBattery() {
  // Sem root, /sys/.../power_supply/battery é negado. Ordem de fontes:
  //   1) termux-battery-status (Termux:API — instalado no S21, retorna JSON real)
  //   2) sysfs capacity/status (quando acessível)
  //   3) dumpsys battery (quando o Termux tem privilégio shell)
  //   4) "unavailable"
  try {
    const out = execSync('termux-battery-status', { timeout: 3000 }).toString()
    const j = JSON.parse(out)
    if (j && j.percentage != null) {
      return {
        capacity: Number(j.percentage) ?? null,
        status: j.status ? String(j.status).toLowerCase() : null,
        temp: Number(j.temperature) || null,
        voltage: Number(j.voltage) || null,
        current: Number(j.current) || null,
        plugged: j.plugged || null,
        health: j.health || null,
        source: 'termux-api',
      }
    }
  } catch {
    /* cai para sysfs */
  }

  const cap = readFile('/sys/class/power_supply/battery/capacity')
  const status = readFile('/sys/class/power_supply/battery/status')
  if (cap) {
    return { capacity: Number(cap), status: status || 'unknown', temp: null, source: 'sysfs' }
  }

  // fallback: dumpsys battery
  try {
    const out = execSync('dumpsys battery', { timeout: 2000 }).toString()
    const m = (re) => {
      const r = out.match(re)
      return r ? r[1] : null
    }
    const level = m(/level:\s*(\d+)/)
    if (level != null) {
      return {
        capacity: Number(level),
        status: m(/status:\s*(\d+)/) ? 'on' : 'unknown',
        temp: m(/temperature:\s*(\d+)/) ? Number(m(/temperature:\s*(\d+)/)) / 10 : null,
        source: 'dumpsys',
      }
    }
  } catch {
    /* ignorar */
  }
  return { capacity: null, status: null, temp: null, source: 'unavailable' }
}

function readDisk() {
  try {
    const out = execSync("df -k /data 2>/dev/null || df -k /").toString()
    const lines = out.trim().split('\n')
    const parts = (lines[1] || '').trim().split(/\s+/)
    // Filesystem 1K-blocks Used Available Use% Mounted
    if (parts.length >= 5) {
      const usedKb = Number(parts[2])
      const availKb = Number(parts[3])
      const totalKb = usedKb + availKb
      const usedPct = parts[4] ? Number(parts[4].replace('%', '')) : null
      return {
        totalGb: +(totalKb / 1024 / 1024).toFixed(1),
        usedGb: +(usedKb / 1024 / 1024).toFixed(1),
        availGb: +(availKb / 1024 / 1024).toFixed(1),
        pct: usedPct,
      }
    }
  } catch {
    /* ignorar */
  }
  return null
}

function readMem() {
  const total = os.totalmem()
  const free = os.freemem()
  const used = total - free
  const meminfo = readFile('/proc/meminfo') || ''
  const availMatch = meminfo.match(/MemAvailable:\s*(\d+)\s*kB/)
  const avail = availMatch ? Number(availMatch[1]) * 1024 : null
  return {
    totalGb: +(total / 1024 / 1024 / 1024).toFixed(2),
    usedGb: +(used / 1024 / 1024 / 1024).toFixed(2),
    freeGb: +(free / 1024 / 1024 / 1024).toFixed(2),
    availableGb: avail != null ? +(avail / 1024 / 1024 / 1024).toFixed(2) : null,
    pct: Math.round((used / total) * 1000) / 10,
  }
}

/** Número de CPUs — os.cpus() pode vir vazio no Termux; fallback via /proc/cpuinfo. */
function readCpuCount() {
  const cpus = os.cpus().length
  if (cpus > 0) return cpus
  const cpuinfo = readFile('/proc/cpuinfo') || ''
  const matches = cpuinfo.match(/^processor\s*:/gm) || []
  return matches.length || 1
}

/* ------------------------------------------------------------------ */
/* Status de serviços (ping de porta no mesmo host, TCP connect)      */
/* ------------------------------------------------------------------ */

const SERVICES = [
  { id: 'harness', title: 'DeepSeek Harness', port: 3080, desc: 'Motor de agentes de desenvolvimento', host: 'motorola' },
  { id: 'api', title: 'Kerberus API', port: 3000, desc: 'API de orquestração de serviços', host: 's21' },
  { id: 'dashboard', title: 'Dashboard', port: 3001, desc: 'Interface React (este painel)', host: 's21' },
  { id: 'vscode', title: 'VS Code Server', port: 8080, desc: 'Editor remoto no proot Ubuntu', host: 's21' },
  { id: 'ssh', title: 'SSH (sshd Termux)', port: 8022, desc: 'Acesso remoto seguro', host: 's21' },
  { id: 'tailscale', title: 'Tailscale Mesh', port: 22, desc: 'VPN mesh (par: Aspire 100.109.53.39)', host: 'mesh', peer: '100.109.53.39', peerPort: 22 },
]

function checkPort(port, timeoutMs = 2000, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const started = Date.now()
    const net = http
    const req = net.get(
      { host, port, path: '/', timeout: timeoutMs },
      (res) => {
        res.resume()
        resolve({
          port,
          status: 'online',
          http: res.statusCode,
          latencyMs: Date.now() - started,
          lastOk: Date.now(),
        })
      },
    )
    req.on('timeout', () => {
      req.destroy()
      resolve({ port, status: 'offline', http: null, latencyMs: null, lastOk: null })
    })
    req.on('error', () => resolve({ port, status: 'offline', http: null, latencyMs: null, lastOk: null }))
  })
}

// Ping TCP puro (para serviços que não falam HTTP, ex. sshd / mesh peer).
function checkTcp(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const started = Date.now()
    const sock = net.connect({ host, port, timeout: timeoutMs })
    sock.on('connect', () => {
      const lat = Date.now() - started
      sock.destroy()
      resolve({ status: 'online', latencyMs: lat, lastOk: Date.now() })
    })
    sock.on('timeout', () => { sock.destroy(); resolve({ status: 'offline', latencyMs: null, lastOk: null }) })
    sock.on('error', () => resolve({ status: 'offline', latencyMs: null, lastOk: null }))
  })
}

// Memória de "último visto online" por porta (persiste entre polls).
const lastSeen = new Map()

async function readServices() {
  const results = await Promise.all(
    SERVICES.map(async (s) => {
      let r
      if (s.id === 'tailscale') {
        // Mesh: verifica alcance do peer Aspire (sem porta HTTP local no Android).
        const tcp = await checkTcp(s.peer, s.peerPort)
        r = { port: s.peerPort, status: tcp.status, http: null, latencyMs: tcp.latencyMs, lastOk: tcp.lastOk }
      } else if (s.id === 'ssh') {
        // sshd: TCP puro (não responde a GET HTTP).
        const tcp = await checkTcp('127.0.0.1', s.port)
        r = { port: s.port, status: tcp.status, http: null, latencyMs: tcp.latencyMs, lastOk: tcp.lastOk }
      } else {
        r = await checkPort(s.port)
      }

      if (r.status === 'online') {
        lastSeen.set(s.id, Date.now())
        r.heartbeat = new Date().toISOString()
      } else {
        const prev = lastSeen.get(s.id)
        r.lastOk = prev || null
        r.heartbeat = prev ? new Date(prev).toISOString() : null
      }
      return { ...s, ...r }
    }),
  )
  return results
}

/* ------------------------------------------------------------------ */
/* Tarefas (placeholder — o Harness real receberá jobs via este canal) */
/* ------------------------------------------------------------------ */

let taskSeq = 0
const tasks = new Map() // id → { id, kind, status, createdAt }

/* ------------------------------------------------------------------ */
/* Servidor HTTP                                                       */
/* ------------------------------------------------------------------ */

function send(res, code, body) {
  const payload = JSON.stringify(body, null, 2)
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Cache-Control': 'no-store',
  })
  res.end(payload)
}

function uptimeSec() {
  return Math.floor((Date.now() - START) / 1000)
}

function collectMetrics() {
  return {
    timestamp: new Date().toISOString(),
    uptimeSec: uptimeSec(),
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: readCpuCount(),
    loadavg: os.loadavg(),
    memory: readMem(),
    disk: readDisk(),
    temperature: readCpuTemp(),
    battery: readBattery(),
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const requestedPath = url.pathname.replace(/\/+$/, '') || '/'
  const path = {
    '/api': '/',
    '/api/v1/status': '/health',
    '/api/v1/runtime': '/metrics',
    '/api/v1/services': '/services',
    '/api/v1/hardware': '/hardware',
    '/api/v1/health': '/health',
    '/api/v1/files': '/files',
    '/api/v1/files/devices': '/files/devices',
    '/api/v1/files/shares': '/files/shares',
    '/api/v1/files/status': '/files/status',
    '/api/docs': '/docs',
  }[requestedPath] || requestedPath

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    })
    return res.end()
  }

  try {
    switch (path) {
      case '/':
      case '/health': {
        return send(res, 200, {
          service: 'kerberus-api',
          status: 'online',
          uptimeSec: uptimeSec(),
          startedAt: new Date(START).toISOString(),
          version: '1.0.0',
        })
      }
      case '/metrics': {
        return send(res, 200, collectMetrics())
      }
      case '/services': {
        const services = await readServices()
        return send(res, 200, { services, timestamp: new Date().toISOString() })
      }
      case '/hardware': {
        const m = collectMetrics()
        return send(res, 200, {
          device: 'S21 (SM-G991U1)',
          os: 'Android 15',
          runtime: 'Termux + proot Ubuntu',
          hostname: m.hostname,
          arch: m.arch,
          cpus: m.cpus,
          loadavg: m.loadavg,
          memory: m.memory,
          disk: m.disk,
          temperature: m.temperature,
          battery: m.battery,
          timestamp: m.timestamp,
        })
      }
      case '/docs': {
        return send(res, 200, {
          service: 'kerberus-api',
          endpoints: [
            { method: 'GET', path: '/health', desc: 'Status e uptime do próprio processo' },
            { method: 'GET', path: '/metrics', desc: 'Métricas de hardware e recursos do host' },
            { method: 'GET', path: '/services', desc: 'Status ao vivo dos serviços Kerberus' },
            { method: 'GET', path: '/hardware', desc: 'Detalhe de hardware (temp, RAM, disco, bateria)' },
            { method: 'GET', path: '/api/v1/status', desc: 'Estado do Runtime' },
            { method: 'GET', path: '/api/v1/runtime', desc: 'Métricas do Runtime' },
            { method: 'GET', path: '/api/v1/services', desc: 'Serviços monitorados' },
            { method: 'GET', path: '/api/v1/hardware', desc: 'Hardware do host' },
            { method: 'GET', path: '/api/v1/files', desc: 'Estado do File Mesh (somente leitura)' },
            { method: 'GET', path: '/api/v1/files/devices', desc: 'Dispositivos do File Mesh' },
            { method: 'GET', path: '/api/v1/files/shares', desc: 'Shares conhecidos' },
            { method: 'GET', path: '/api/v1/files/status', desc: 'Estado das ligações File Mesh' },
          ],
        })
      }
      case '/files':
      case '/files/devices':
      case '/files/shares':
      case '/files/status': {
        const mesh = fileMeshStatus()
        if (path === '/files/devices') return send(res, 200, { devices: mesh.devices, checkedAt: mesh.checkedAt })
        if (path === '/files/shares') return send(res, 200, { shares: mesh.shares, checkedAt: mesh.checkedAt })
        return send(res, 200, mesh)
      }
      case '/tasks': {
        if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' })
        if (!requireAdmin(req, res)) return
        let body = ''
        for await (const chunk of req) body += chunk
        let parsed = {}
        try {
          parsed = body ? JSON.parse(body) : {}
        } catch {
          return send(res, 400, { error: 'JSON inválido' })
        }
        const id = `task-${++taskSeq}`
        const task = {
          id,
          kind: parsed.kind || parsed.type || 'unknown',
          status: 'queued',
          createdAt: new Date().toISOString(),
        }
        tasks.set(id, task)
        return send(res, 202, { task })
      }
      default: {
        return send(res, 404, { error: 'Not found', path })
      }
    }
  } catch (err) {
    return send(res, 500, { error: 'Internal error', message: String(err && err.message) })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`[kerberus-api] escutando em http://${HOST}:${PORT}`)
})

process.on('SIGTERM', () => server.close(() => process.exit(0)))
process.on('SIGINT', () => server.close(() => process.exit(0)))