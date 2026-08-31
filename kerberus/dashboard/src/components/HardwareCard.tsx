import { useHardware, type HardwareData } from '../hooks/useHardware'

function Bar({ pct }: { pct: number | null }) {
  if (pct == null) return <span className="hw-na">n/d</span>
  const clamped = Math.max(0, Math.min(100, pct))
  const color = clamped > 85 ? 'var(--danger)' : clamped > 65 ? 'var(--ds-blue)' : 'var(--success)'
  return (
    <div className="hw-bar">
      <div className="hw-bar-fill" style={{ width: `${clamped}%`, background: color }} />
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="hw-stat">
      <div className="hw-label">{label}</div>
      <div className="hw-value">{value}</div>
      {sub && <div className="hw-sub">{sub}</div>}
    </div>
  )
}

export default function HardwareCard() {
  const { data, available, loading } = useHardware()
  const h: HardwareData = data

  if (!available && !loading) {
    return (
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Hardware</h2>
          <span className="hw-offline">API offline</span>
        </div>
        <div className="hw-card hw-muted">
          <p>S21 · SM-G991U1 · Android 15</p>
          <p style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
            A Kerberus API (:3000) não está respondendo. Suba o backend para ver faturamento de hardware ao vivo.
          </p>
        </div>
      </section>
    )
  }

  const temp = h.temperature?.base != null ? `${h.temperature.base.toFixed(1)}°C` : '—'
  const mem = h.memory
  const disk = h.disk
  const bat = h.battery

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Hardware</h2>
        <span className="hw-live">{loading ? 'atualizando…' : 'ao vivo'}</span>
      </div>

      <div className="hw-card">
        <div className="hw-grid">
          <Stat
            label="Temperatura (CPU)"
            value={temp}
            sub={h.temperature?.zones?.slice(0, 3).map((z) => `${z.type}: ${z.temp}°`).join(' · ') || undefined}
          />
          <Stat
            label="RAM"
            value={mem ? `${mem.usedGb.toFixed(2)} / ${mem.totalGb.toFixed(2)} GB` : '—'}
            sub={mem ? `${mem.pct.toFixed(1)}% em uso` : undefined}
          />
          <Stat
            label="Disco /data"
            value={disk ? `${disk.availGb.toFixed(0)} GB livres` : '—'}
            sub={disk ? `${disk.usedGb.toFixed(0)} / ${disk.totalGb.toFixed(0)} GB` : undefined}
          />
          <Stat
            label="Bateria"
            value={bat?.capacity != null ? `${bat.capacity}%` : '—'}
            sub={bat?.temp != null ? `${bat.temp.toFixed(1)}°C` : bat?.source === 'unavailable' ? 'sem acesso' : bat?.status || undefined}
          />
        </div>

        <div className="hw-bars">
          <div className="hw-row">
            <span>RAM</span>
            <Bar pct={mem ? mem.pct : null} />
          </div>
          <div className="hw-row">
            <span>Disco</span>
            <Bar pct={disk ? disk.pct : null} />
          </div>
          {bat?.capacity != null && (
            <div className="hw-row">
              <span>Bateria</span>
              <Bar pct={bat.capacity} />
            </div>
          )}
        </div>

        <div className="hw-meta">
          {h.hostname && <span>{h.hostname}</span>}
          {h.arch && <span>{h.arch}</span>}
          {h.cpus != null && <span>{h.cpus} cores</span>}
          {h.loadavg && <span>load {h.loadavg.map((n) => n.toFixed(2)).join(' / ')}</span>}
          {h.timestamp && <span>atualizado {new Date(h.timestamp).toLocaleTimeString('pt-BR')}</span>}
        </div>
      </div>
    </section>
  )
}