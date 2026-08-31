type Props = {
  onOpen: (r: string) => void
}

const links = [
  { icon: '▤', label: 'Assinaturas', route: '/ferramentas' },
  { icon: '🗂', label: 'Grupos de Recursos', route: '/navegar' },
  { icon: '🌐', label: 'Todos os recursos', route: '/navegar' },
  { icon: '📦', label: 'Implantações', route: '/navegar' },
  { icon: '📊', label: 'Monitoramento', route: '/monitor' },
  { icon: '🔐', label: 'Identidade e Acesso', route: '/navegar' },
  { icon: '⚙', label: 'Configurações de conta', route: '/codeserver' },
  { icon: '🧩', label: 'Marketplace', route: '/ferramentas' },
]

export default function NavigateLinks({ onOpen }: Props) {
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Navegar</h2>
      </div>
      <div className="nav-grid">
        {links.map((l) => (
          <div className="nav-link" key={l.label} onClick={() => onOpen(l.route)}>
            <span className="n-ic">{l.icon}</span>
            {l.label}
          </div>
        ))}
      </div>
    </section>
  )
}
