type Props = {
  page: string
  setPage: (p: string) => void
}

const items: { id: string; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▣' },
  { id: 'projects', label: 'Projetos', icon: '▤' },
  { id: 'agents', label: 'Agentes', icon: '◉' },
  { id: 'runtime', label: 'Runtime', icon: '⚙' },
  { id: 'settings', label: 'Configurações', icon: '⚒' },
]

export default function Sidebar({ page, setPage }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">KERBERUS</div>
      {items.map((it) => (
        <div
          key={it.id}
          className={`nav-item ${page === it.id ? 'active' : ''}`}
          onClick={() => setPage(it.id)}
        >
          <span>{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </aside>
  )
}
