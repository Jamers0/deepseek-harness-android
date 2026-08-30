type Props = {
  label?: string
  status: 'online' | 'offline' | 'unknown'
  children?: React.ReactNode
}

export default function ServiceBadge({ label, status, children }: Props) {
  return (
    <span className={`badge ${status}`}>
      <span className="dot" />
      {children ?? label}
    </span>
  )
}
