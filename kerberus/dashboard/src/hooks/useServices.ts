import { useCallback, useEffect, useState } from 'react'
import { services, HOST, type Service, type ServiceStatus } from '../lib/services'

/**
 * Hook de status de serviços — V1 com ping ao vivo.
 *
 * Como a dashboard e os serviços rodam no MESMO host (S21, via Tailscale),
 * fazemos um fetch cross-origin (no-cors) em http://<host>:<porta>.
 * - Se a promise resolve (servidor respondeu, mesmo opaque), a porta está ABERTA → online.
 * - Se rejeita (connection refused / timeout), a porta está fechada → offline.
 *
 * O dashboard (:3001) sempre responde; os outros são checados de verdade.
 */
async function pingPort(port: string): Promise<ServiceStatus> {
  const url = `http://${HOST}:${port}/`
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 2500)
  try {
    await fetch(url, { mode: 'no-cors', signal: controller.signal, cache: 'no-store' })
    return 'online'
  } catch {
    return 'offline'
  } finally {
    clearTimeout(t)
  }
}

export function useServices(): { data: Service[]; refresh: () => void; loading: boolean } {
  const [data, setData] = useState<Service[]>(services)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const results = await Promise.all(
      services.map(async (s) => ({ ...s, status: await pingPort(s.port) }))
    )
    setData(results)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 15000)
    return () => clearInterval(id)
  }, [refresh])

  return { data, refresh, loading }
}
