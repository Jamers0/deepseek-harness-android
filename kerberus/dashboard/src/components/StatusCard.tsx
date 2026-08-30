import ServiceBadge from './ServiceBadge'

type Props = {
  title: string
  port?: string
  desc?: string
  status: 'online' | 'offline' | 'unknown'
  icon?: string
}

export default function StatusCard({ title, port, desc, status, icon }: Props) {
  return (
    <div className="status-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 22 }}>{icon ?? '▣'}</span>
        <ServiceBadge status={status} />
      </div>
      <div className="title">{title}</div>
      {port && <div className="port">Porta {port}</div>}
      {desc && <div className="desc">{desc}</div>}
    </div>
  )
}
