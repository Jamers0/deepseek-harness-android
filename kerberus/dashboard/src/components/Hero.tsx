import DeepSeekLogo from './DeepSeekLogo'

type HeroCard = {
  title: string
  desc: string
  cta: string
  ctaHref?: string
  more?: string
  moreRoute?: string
  art: 'default' | 'inner' | 'warn'
  icon: React.ReactNode
}

const cards: HeroCard[] = [
  {
    title: 'DeepSeek Harness',
    desc: 'Agente de desenvolvimento autônomo rodando no Termux do S21. Plugins Cordis, sessões e execução de tarefas.',
    cta: 'Abrir Harness',

    more: 'Saiba mais',
    moreRoute: '/harness',
    art: 'default',
    icon: <DeepSeekLogo size={46} />,
  },
  {
    title: 'VS Code Server',
    desc: 'Editor completo no proot Ubuntu do S21. Edite o dashboard e os projetos Kerberus de qualquer lugar.',
    cta: 'Acessar IDE',

    more: 'Documentação',
    moreRoute: '/codeserver',
    art: 'inner',
    icon: '❮❯',
  },
  {
    title: 'Kerberus API',
    desc: 'API de orquestração de serviços e status do runtime. Conecte o painel a automações externas.',
    cta: 'Ver endpoints',

    more: 'Swagger',
    moreRoute: '/api',
    art: 'warn',
    icon: '⚡',
  },
]

export default function Hero({ onOpen }: { onOpen: (r: string) => void }) {
  return (
    <section>
      <h1 className="page-title">Bem-vindo(a) ao Kerberus Runtime</h1>
      <p className="page-sub">Painel de operações do seu homelab Android · S21 + Ubuntu runtime + Tailscale</p>

      <div className="hero-grid">
        {cards.map((c) => (
          <div className="hero-card" key={c.title}>
            <div className={`hero-art ${c.art}`}>
              <span style={{ fontSize: 46 }}>{c.icon}</span>
            </div>
            <div className="hero-body">
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="hero-actions">
                {c.ctaHref ? (
                  <a className="btn-primary" href={c.ctaHref} target="_blank" rel="noreferrer">{c.cta}</a>
                ) : (
                  <button className="btn-primary" onClick={() => c.moreRoute && onOpen(c.moreRoute)}>{c.cta}</button>
                )}
                {c.more && c.moreRoute && (
                  <a
                    className="btn-link"
                    href={`#${c.moreRoute}`}
                    onClick={(e) => { e.preventDefault(); onOpen(c.moreRoute!) }}
                  >
                    {c.more}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
