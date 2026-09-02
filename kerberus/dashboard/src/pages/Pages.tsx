import { HOST } from '../lib/services'
import { useServices } from '../hooks/useServices'

function StatusPill({ status }: { status: 'online' | 'offline' | 'unknown' }) {
  const label = status === 'online' ? 'Operacional' : status === 'offline' ? 'Offline' : 'Verificando'
  return <span className={`stat-pill ${status}`}><span className="dot" />{label}</span>
}

/* ============ HARNESS ============ */
export function HarnessPage({ go }: { go: (r: string) => void }) {
  const { data } = useServices()
  const s = data.find((x) => x.id === 'harness')
  return (
    <section>
      <a className="back-link" href="#/" onClick={(e) => { e.preventDefault(); go('/') }}>← Voltar ao painel</a>
      <h1 className="page-title">DeepSeek Harness</h1>
      <p className="page-sub">Agente de desenvolvimento autônomo · Termux (S21)</p>

      <div className="info-card">
        <h3>Status do serviço</h3>
        <div style={{ margin: '10px 0' }}>{s && <StatusPill status={s.status} />}</div>
        <div className="kv">
          <div className="k">Porta</div><div className="v">{s?.port ?? '3080'}</div>
          <div className="k">Host</div><div className="v">{HOST}</div>
          <div className="k">Runtime</div><div className="v">Termux · Node 24</div>
          <div className="k">Framework</div><div className="v">Cordis (plugin-based)</div>
        </div>
        <a className="ext-link" href="/harness" target="_blank" rel="noreferrer">Abrir Harness ↗</a>
      </div>

      <h2 className="section-title" style={{ marginTop: 28, marginBottom: 14 }}>Recursos</h2>
      <div className="feature-grid">
        <div className="feature-card"><h4><span className="fc-ic">⬡</span> Sessões</h4><p>Crie e gerencie sessões de agente com memória e projeção durável.</p></div>
        <div className="feature-card"><h4><span className="fc-ic">🧩</span> Plugins</h4><p>Tudo é plugin Cordis: ferramentas, consumidores e provedores.</p></div>
        <div className="feature-card"><h4><span className="fc-ic">⚙</span> Perfis</h4><p>Composição de agente por sessão via arquivos cordis.yml.</p></div>
        <div className="feature-card"><h4><span className="fc-ic">🔐</span> Credenciais</h4><p>Provedor de credenciais por env / .env com isolamento.</p></div>
      </div>
    </section>
  )
}

/* ============ API ============ */
export function ApiPage({ go }: { go: (r: string) => void }) {
  const { data } = useServices()
  const s = data.find((x) => x.id === 'api')
  return (
    <section>
      <a className="back-link" href="#/" onClick={(e) => { e.preventDefault(); go('/') }}>← Voltar ao painel</a>
      <h1 className="page-title">Kerberus API</h1>
      <p className="page-sub">API de orquestração de serviços · exposta na porta 3000</p>

      <div className="info-card">
        <h3>Status do serviço</h3>
        <div style={{ margin: '10px 0' }}>{s && <StatusPill status={s.status} />}</div>
        <div className="kv">
          <div className="k">Porta</div><div className="v">{s?.port ?? '3000'}</div>
          <div className="k">Host</div><div className="v">{HOST}</div>
          <div className="k">Swagger</div><div className="v">/docs</div>
          <div className="k">Auth</div><div className="v">Bearer (configurável)</div>
        </div>
        <a className="ext-link" href="/api/v1/status" target="_blank" rel="noreferrer">Abrir API ↗</a>
        <a className="ext-link" href="/api/docs" target="_blank" rel="noreferrer">Documentação da API ↗</a>
      </div>

      <h2 className="section-title" style={{ marginTop: 28, marginBottom: 14 }}>Endpoints</h2>
      <div className="feature-grid">
        <div className="feature-card"><h4><span className="fc-ic">📡</span> GET /health</h4><p>Status e uptime dos serviços do runtime.</p></div>
        <div className="feature-card"><h4><span className="fc-ic">📊</span> GET /metrics</h4><p>Métricas de orquestração e uso de recursos.</p></div>
        <div className="feature-card"><h4><span className="fc-ic">🔧</span> POST /tasks</h4><p>Dispara tarefas no Harness de forma assíncrona.</p></div>
        <div className="feature-card"><h4><span className="fc-ic">🌐</span> GET /services</h4><p>Lista serviços registrados e seus status.</p></div>
      </div>
    </section>
  )
}

/* ============ MONITORAMENTO ============ */
export function MonitorPage({ go }: { go: (r: string) => void }) {
  const { data } = useServices()
  return (
    <section>
      <a className="back-link" href="#/" onClick={(e) => { e.preventDefault(); go('/') }}>← Voltar ao painel</a>
      <h1 className="page-title">Monitoramento</h1>
      <p className="page-sub">Saúde dos serviços em tempo real</p>

      <div className="info-card">
        <h3>Serviços monitorados</h3>
        <div className="feature-grid" style={{ marginTop: 12 }}>
          {data.map((s) => (
            <div className="feature-card" key={s.id}>
              <h4><span className="fc-ic">{s.icon}</span> {s.title}</h4>
              <p>{s.desc}</p>
              <div style={{ marginTop: 10 }}><StatusPill status={s.status} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-card" style={{ marginTop: 16 }}>
        <h3>Host</h3>
        <div className="kv">
          <div className="k">Dispositivo</div><div className="v">S21 (SM-G991U1)</div>
          <div className="k">OS</div><div className="v">Android 15</div>
          <div className="k">Runtime</div><div className="v">Termux + proot Ubuntu</div>
          <div className="k">Malha</div><div className="v">Tailscale · {HOST}</div>
        </div>
      </div>
    </section>
  )
}

/* ============ TAILSCALE ============ */
export function TailscalePage({ go }: { go: (r: string) => void }) {
  const peers = [
    { name: 'aspire', ip: '100.109.53.39', role: 'linux', note: 'Servidor principal / Docker' },
    { name: 's21-de-jamerson', ip: '100.109.109.51', role: 'android', note: 'Host atual (este painel)' },
    { name: 'motorola', ip: '100.69.197.122', role: 'android', note: 'Celular secundário' },
  ]
  return (
    <section>
      <a className="back-link" href="#/" onClick={(e) => { e.preventDefault(); go('/') }}>← Voltar ao painel</a>
      <h1 className="page-title">Tailscale Mesh</h1>
      <p className="page-sub">Malha VPN entre seus dispositivos</p>

      <div className="info-card">
        <h3>Peers</h3>
        <div className="table" style={{ marginTop: 12 }}>
          <div className="table-head"><div>Nome</div><div>IP</div><div>Função</div></div>
          {peers.map((p) => (
            <div className="table-row" key={p.ip}>
              <div><b>{p.name}</b><br /><span style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{p.note}</span></div>
              <div className="v">{p.ip}</div>
              <div>{p.role}</div>
            </div>
          ))}
        </div>
      </div>
      <a className="ext-link" href="https://login.tailscale.com/admin/machines" target="_blank" rel="noreferrer">Console Tailscale ↗</a>
    </section>
  )
}

/* ============ CODE-SERVER CONFIG ============ */
export function CodeServerPage({ go }: { go: (r: string) => void }) {
  const { data } = useServices()
  const s = data.find((x) => x.id === 'vscode')
  return (
    <section>
      <a className="back-link" href="#/" onClick={(e) => { e.preventDefault(); go('/') }}>← Voltar ao painel</a>
      <h1 className="page-title">Code-server Config</h1>
      <p className="page-sub">Editor VS Code remoto no proot Ubuntu</p>

      <div className="info-card">
        <h3>Acesso</h3>
        <div style={{ margin: '10px 0' }}>{s && <StatusPill status={s.status} />}</div>
        <div className="kv">
          <div className="k">URL</div><div className="v">/vscode</div>
          <div className="k">Auth</div><div className="v">password</div>
          <div className="k">Senha</div><div className="v">configurada no runtime</div>
          <div className="k">Runtime</div><div className="v">proot Ubuntu (glibc)</div>
        </div>
        <a className="ext-link" href="/vscode" target="_blank" rel="noreferrer">Abrir VS Code ↗</a>
      </div>

      <h2 className="section-title" style={{ marginTop: 28, marginBottom: 14 }}>Dicas</h2>
      <div className="feature-grid">
        <div className="feature-card"><h4><span className="fc-ic">📁</span> Workspace</h4><p>Abra ~/Projetos/deepseek-harness-android/kerberus/dashboard para editar este painel.</p></div>
        <div className="feature-card"><h4><span className="fc-ic">🔌</span> Extensões</h4><p>Instale extensões via Marketplace (mesmo catálogo do VS Code).</p></div>
        <div className="feature-card"><h4><span className="fc-ic">💾</span> Persistência</h4><p>O proot Ubuntu sobrevive a reinícios do Termux via ~/.termux/boot.</p></div>
      </div>
    </section>
  )
}

/* ============ NAVEGAR ============ */
const navItems = [
  { label: 'Assinaturas', icon: '▤', route: '/monitor' },
  { label: 'Grupos de Recursos', icon: '🗂', route: '/' },
  { label: 'Todos os recursos', icon: '🌐', route: '/' },
  { label: 'Implantações', icon: '📦', route: '/' },
  { label: 'Monitoramento', icon: '📊', route: '/monitor' },
  { label: 'Identidade e Acesso', icon: '🔐', route: '/' },
  { label: 'Configurações de conta', icon: '⚙', route: '/' },
  { label: 'Marketplace', icon: '🧩', route: '/' },
]
export function NavigatePage({ go }: { go: (r: string) => void }) {
  return (
    <section>
      <a className="back-link" href="#/" onClick={(e) => { e.preventDefault(); go('/') }}>← Voltar ao painel</a>
      <h1 className="page-title">Navegar</h1>
      <p className="page-sub">Atalhos para as áreas do Kerberus</p>
      <div className="nav-grid">
        {navItems.map((l) => (
          <div className="nav-link" key={l.label} onClick={() => go(l.route)}>
            <span className="n-ic">{l.icon}</span>{l.label}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ============ FERRAMENTAS ============ */
const tools = [
  { icon: '❮❯', title: 'VS Code Server', desc: 'IDE completa no proot Ubuntu do S21.', route: '/codeserver' },
  { icon: '⬡', title: 'DeepSeek Harness', desc: 'Agente autônomo baseado em plugins Cordis.', route: '/harness' },
  { icon: '⚡', title: 'Kerberus API', desc: 'Endpoints de orquestração na porta 3000.', route: '/api' },
  { icon: '🐳', title: 'Docker (Aspire)', desc: 'Stack de containers no servidor principal.', route: '/tailscale' },
  { icon: '🔧', title: 'Code-server Config', desc: 'Ajuste senha, portas e extensões do editor.', route: '/codeserver' },
  { icon: '📡', title: 'Tailscale Mesh', desc: 'Malha VPN entre S21, Motorola e Aspire.', route: '/tailscale' },
]
export function ToolsPage({ go }: { go: (r: string) => void }) {
  return (
    <section>
      <a className="back-link" href="#/" onClick={(e) => { e.preventDefault(); go('/') }}>← Voltar ao painel</a>
      <h1 className="page-title">Ferramentas</h1>
      <p className="page-sub">Aplicativos e utilitários do runtime</p>
      <div className="tools-grid">
        {tools.map((t) => (
          <div className="tool-card" key={t.title} onClick={() => go(t.route)}>
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
