import { useCallback, useEffect, useState } from 'react'
import { HOST } from '../lib/services'

export type HardwareData = {
  device?: string
  os?: string
  runtime?: string
  hostname?: string
  arch?: string
  cpus?: number
  loadavg?: number[]
  memory?: { totalGb: number; usedGb: number; freeGb: number; availableGb: number | null; pct: number }
  disk?: { totalGb: number; usedGb: number; availGb: number; pct: number | null } | null
  temperature?: { base: number | null; zones: { type: string; temp: number }[] }
  battery?: { capacity: number | null; status: string | null; temp: number | null; source: string }
  timestamp?: string
}

const EMPTY: HardwareData = {}

/**
 * Consome a Kerberus API (/hardware) na porta 3000 do mesmo host.
 * Se a API estiver fora, devolve EMPTY e `available=false`.
 */
export function useHardware() {
  const [data, setData] = useState<HardwareData>(EMPTY)
  const [available, setAvailable] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 3000)
    try {
      const res = await fetch(`http://${HOST}:3000/hardware`, {
        signal: controller.signal,
        cache: 'no-store',
      })
      if (res.ok) {
        const json = (await res.json()) as HardwareData
        setData(json)
        setAvailable(true)
      } else {
        setAvailable(false)
      }
    } catch {
      setAvailable(false)
    } finally {
      clearTimeout(t)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 10000)
    return () => clearInterval(id)
  }, [refresh])

  return { data, available, loading, refresh }
}