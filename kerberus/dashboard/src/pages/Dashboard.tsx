import { useServices } from '../hooks/useServices'
import StatusCard from '../components/StatusCard'
import SectionTitle from '../components/SectionTitle'
import TopBar from '../layout/TopBar'

export default function Dashboard() {
  const services = useServices()
  return (
    <div className="page">
      <TopBar />
      <SectionTitle>Serviços</SectionTitle>
      <div className="cards-grid">
        {services.map((s) => (
          <StatusCard
            key={s.id}
            title={s.title}
            port={s.port}
            desc={s.desc}
            status={s.status}
            icon={s.icon}
          />
        ))}
      </div>
    </div>
  )
}
