type Props = {
  onOpen: (r: string) => void
}

const tools = [
  { icon: '❮❯', title: 'VS Code Server', desc: 'IDE completa no proot Ubuntu do S21 para editar projetos Kerberus.', route: '/codeserver' },
  { icon: '⬡', title: 'DeepSeek Harness', desc: 'Agente autônomo de desenvolvimento baseado em plugins Cordis.', route: '/harness' },
  { icon: '⚡', title: 'Kerberus API', desc: 'Endpoints de orquestração e status do runtime.', route: '/api' },
  { icon: '🐳', title: 'Docker (Aspire)', desc: 'Stack de containers no servidor principal via Tailscale.', route: '/tailscale' },
  { icon: '🔧', title: 'Code-server Config', desc: 'Ajuste senha, portas e extensões do editor remoto.', route: '/codeserver' },
  { icon: '📡', title: 'Tailscale Mesh', desc: 'Malha VPN entre S21, Motorola e Aspire.', route: '/tailscale' },
]

export default function ToolsGrid({ onOpen }: Props) {
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Ferramentas</h2>
      </div>
      <div className="tools-grid">
        {tools.map((t) => (
          <div className="tool-card" key={t.title} onClick={() => onOpen(t.route)}>
            <div className="tool-ic">{t.icon}</div>
            <div>
              <h4>{t.title}</h4>
              <p>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
