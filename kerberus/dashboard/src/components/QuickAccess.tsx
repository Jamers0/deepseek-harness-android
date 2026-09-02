import { type Service } from '../lib/services'
import DeepSeekLogo from './DeepSeekLogo'

type Props = {
  services: Service[]
  onOpen: (r: string) => void
}

const COLORS: Record<string, string> = {
  harness: '#8b5cf6',
  api: '#f59e0b',
  dashboard: '#3b82f6',
  vscode: '#16c784',
}

export default function QuickAccess({ services, onOpen }: Props) {
  const items = [
    { id: 'create', label: 'Criar um recurso', icon: '+', color: '#3b82f6', create: true, route: '/navegar' },
    ...services.map((s) => ({
      id: s.id,
      label: s.title,
      icon: s.id === 'harness' ? <DeepSeekLogo size={24} /> : s.icon,
      color: COLORS[s.id] ?? '#3b82f6',
      route: s.id === 'dashboard' ? '/' : s.id === 'harness' ? '/harness' : s.id === 'api' ? '/api' : '/codeserver',
    })),
    { id: 'more', label: 'Mais serviços', icon: '›', color: '#6b7891', more: true, route: '/ferramentas' },
  ]

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Serviços do Kerberus</h2>
      </div>
      <div className="qa-row">
        {items.map((it: any) => {
          const isLink = false
          return (
            <a
              key={it.id}
              className={`qa-item ${it.create ? 'qa-create' : ''} ${it.more ? 'qa-more' : ''}`}
              href={isLink ? it.href : '#'}
              target={isLink ? '_blank' : undefined}
              rel={isLink ? 'noreferrer' : undefined}
              title={it.label}
              onClick={(e) => {
                if (!isLink) {
                  e.preventDefault()
                  onOpen(it.route)
                }
              }}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="qa-icon"
                style={{
                  background: it.create ? 'transparent' : it.color,
                  border: it.create ? '1px dashed var(--border)' : 'none',
                  color: it.create ? 'var(--text-dim)' : '#fff',
                }}
              >
                {it.icon}
              </div>
              <span>{it.label}</span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
