type Props = {
  open: boolean
  onClose: () => void
  route: string
  setRoute: (r: string) => void
}

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦', route: '/' },
  { id: 'projects', label: 'Projetos', icon: '▤', route: '/ferramentas' },
  { id: 'agents', label: 'Agentes', icon: '◉', route: '/harness' },
  { id: 'runtime', label: 'Runtime', icon: '⚙', route: '/monitor' },
  { id: 'settings', label: 'Configurações', icon: '⚒', route: '/codeserver' },
]

export default function Drawer({ open, onClose, route, setRoute }: Props) {
  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`}>
        <div className="d-brand">
          <div className="logo-k">K</div>
          <div>
            <b>KERBERUS</b>
            <span style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginTop: -2 }}>Runtime</span>
          </div>
        </div>
        {items.map((it) => (
          <div
            key={it.id}
            className={`nav-item ${route === it.route ? 'active' : ''}`}
            onClick={() => {
              setRoute(it.route)
              onClose()
            }}
          >
            <span>{it.icon}</span>
            <span>{it.label}</span>
          </div>
        ))}
      </aside>
    </>
  )
}
