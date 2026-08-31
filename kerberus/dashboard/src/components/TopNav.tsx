type Props = {
  onMenu: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onTerminal: () => void
}

export default function TopNav({ onMenu, theme, onToggleTheme, onTerminal }: Props) {
  return (
    <nav className="topnav">
      <button className="tn-btn" onClick={onMenu} title="Menu" aria-label="Menu">☰</button>

      <a className="tn-brand" href="#/">
        <div className="logo-k">K</div>
        <div>
          <b>KERBERUS</b>
          <span>Runtime</span>
        </div>
      </a>

      <div className="tn-search">
        <span>🔍</span>
        <input placeholder="Pesquisar recursos..." />
      </div>

      <div className="tn-icons">
        <button
          className="tn-btn tn-theme"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <button className="tn-btn" title="Terminal" onClick={onTerminal} aria-label="Abrir terminal">❯_</button>
        <button className="tn-btn" title="Configurações">⚙</button>
        <button className="tn-btn" title="Notificações">🔔</button>
        <button className="tn-btn" title="Ajuda">?</button>
      </div>

      <div className="tn-avatar" title="J. Pica">JP</div>
    </nav>
  )
}
