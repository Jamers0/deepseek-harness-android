type Props = {
  children: React.ReactNode
}

export default function SectionTitle({ children }: Props) {
  return <div className="section-title">{children}</div>
}
