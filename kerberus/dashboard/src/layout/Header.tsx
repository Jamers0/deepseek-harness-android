type Props = {
  title: string
  subtitle: string
}

export default function Header({ title, subtitle }: Props) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <span className="subtitle">{subtitle}</span>
    </header>
  )
}
