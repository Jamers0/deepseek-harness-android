import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Agents from './pages/Agents'
import Runtime from './pages/Runtime'
import Settings from './pages/Settings'
import { useState } from 'react'

export default function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <Layout page={page} setPage={setPage}>
      {page === 'dashboard' && <Dashboard />}
      {page === 'projects' && <Projects />}
      {page === 'agents' && <Agents />}
      {page === 'runtime' && <Runtime />}
      {page === 'settings' && <Settings />}
    </Layout>
  )
}
