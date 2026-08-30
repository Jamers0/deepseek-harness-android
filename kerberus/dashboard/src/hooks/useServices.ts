import { useEffect, useState } from 'react'
import { services, type Service } from '../lib/services'

/**
 * Hook de status de serviços.
 * V1: usa dados estáticos de lib/services.ts.
 * V2: fará fetch em kerberus/api (3000) via WebSocket para status ao vivo.
 */
export function useServices(): Service[] {
  const [data] = useState<Service[]>(services)

  useEffect(() => {
    // Placeholder para futura integração com a API.
  }, [])

  return data
}
