import SectionTitle from '../components/SectionTitle'

export default function Runtime() {
  return (
    <div className="page">
      <SectionTitle>Runtime</SectionTitle>
      <p>
        Host: Android (Termux) + Ubuntu 24.04 (proot) runtime.<br />
        Monitor de processos e WebSocket entram na V2.
      </p>
    </div>
  )
}
