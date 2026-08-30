import SectionTitle from '../components/SectionTitle'

export default function Projects() {
  return (
    <div className="page">
      <SectionTitle>Projetos</SectionTitle>
      <p>
        Repositório compartilhado: <code>deepseek-harness-android</code>.<br />
        Todo o desenvolvimento Kerberus vive isolado em <code>kerberus/</code>,
        sem tocar no DeepSeek Harness original.
      </p>
    </div>
  )
}
