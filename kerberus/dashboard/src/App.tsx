import { useState } from 'react'
import TopNav from './components/TopNav'
import Drawer from './layout/Drawer'
import Hero from './components/Hero'
import QuickAccess from './components/QuickAccess'
import ResourcesTable from './components/ResourcesTable'
import NavigateLinks from './components/NavigateLinks'
import ToolsGrid from './components/ToolsGrid'
import SupportFooter from './components/SupportFooter'
import { useServices } from './hooks/useServices'
import { useRoute } from './lib/router'
import { useTheme } from './lib/theme'
import {
  HarnessPage, ApiPage, MonitorPage, TailscalePage, CodeServerPage, NavigatePage, ToolsPage,
} from './pages/Pages'

export default function App() {
  const [drawer, setDrawer] = useState(false)
  const [route, navigate] = useRoute()
  const { theme, toggle } = useTheme()
  const { data } = useServices()

  const go = (r: string) => navigate(r)

  let body: React.ReactNode
  if (route === '/') {
    body = (
      <>
        <Hero onOpen={(r) => go(r)} />
        <QuickAccess services={data} onOpen={(r) => go(r)} />
        <ResourcesTable onOpen={(r) => go(r)} />
        <NavigateLinks onOpen={(r) => go(r)} />
        <ToolsGrid onOpen={(r) => go(r)} />
        <SupportFooter onOpen={(r) => go(r)} />
      </>
    )
  } else if (route === '/harness') body = <HarnessPage go={go} />
  else if (route === '/api') body = <ApiPage go={go} />
  else if (route === '/monitor') body = <MonitorPage go={go} />
  else if (route === '/tailscale') body = <TailscalePage go={go} />
  else if (route === '/codeserver') body = <CodeServerPage go={go} />
  else if (route === '/navegar') body = <NavigatePage go={go} />
  else if (route === '/ferramentas') body = <ToolsPage go={go} />
  else body = <HarnessPage go={go} />

  return (
    <div className="app-shell">
      <TopNav onMenu={() => setDrawer(true)} theme={theme} onToggleTheme={toggle} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} route={route} setRoute={go} />
      <main className="page">{body}</main>
    </div>
  )
}
