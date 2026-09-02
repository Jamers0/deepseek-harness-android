import { useCallback, useEffect, useState } from 'react'
import { services, type Service, type ServiceStatus } from '../lib/services'

async function loadServices(): Promise<Service[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch('/api/v1/services', { signal: controller.signal, cache: 'no-store' })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const json = await res.json() as { services?: Array<{ id: string; status: ServiceStatus; port: number }> }
    const live = new Map((json.services || []).map((s) => [s.id, s]))
    return services.map((service) => {
      const result = live.get(service.id)
      return result ? { ...service, port: String(result.port), status: result.status } : service
    })
  } finally {
    clearTimeout(timeout)
  }
}

export function useServices(): { data: Service[]; refresh: () => void; loading: boolean } {
  const [data, setData] = useState<Service[]>(services)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try { setData(await loadServices()) } catch { setData(services.map((s) => ({ ...s, status: 'offline' }))) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 15000)
    return () => clearInterval(id)
  }, [refresh])

  return { data, refresh, loading }
}
