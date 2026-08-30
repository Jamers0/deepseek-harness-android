import Sidebar from './Sidebar'
import Header from './Header'

type Props = {
  page: string
  setPage: (p: string) => void
  children: React.ReactNode
}

const titles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'KERBERUS Runtime Dashboard', subtitle: 'DeepSeek Harness + Ubuntu Runtime + Android Host' },
  projects: { title: 'Projetos', subtitle: 'Repositórios e workspaces Kerberus' },
  agents: { title: 'Agentes', subtitle: 'Agentes do Harness' },
  runtime: { title: 'Runtime', subtitle: 'Estado do runtime Ubuntu + Termux' },
  settings: { title: 'Configurações', subtitle: 'Preferências do dashboard' },
}

export default function Layout({ page, setPage, children }: Props) {
  const head = titles[page] ?? titles.dashboard
  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <div className="main">
        <Header title={head.title} subtitle={head.subtitle} />
        <div className="content">{children}</div>
      </div>
    </div>
  )
}
