import { useState } from 'react'

type Props = {
  onOpen: (r: string) => void
}

export default function ResourcesTable({ onOpen }: Props) {
  const [tab, setTab] = useState<'recentes' | 'favoritos'>('recentes')

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Recursos</h2>
        <a className="section-link" href="#/navegar" onClick={(e) => { e.preventDefault(); onOpen('/navegar') }}>Exibir todos</a>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'recentes' ? 'active' : ''}`} onClick={() => setTab('recentes')}>
          Recentes
        </button>
        <button className={`tab ${tab === 'favoritos' ? 'active' : ''}`} onClick={() => setTab('favoritos')}>
          Favoritos
        </button>
      </div>

      <div className="table">
        <div className="table-head">
          <div>Nome</div>
          <div>Tipo</div>
          <div>Última visualização</div>
        </div>

        <div className="empty-state">
          <div className="e-icon">▢</div>
          <p>Nenhum recurso foi visualizado recentemente.</p>
          <button className="btn-outline" onClick={() => onOpen('/navegar')}>Exibir todos os recursos</button>
        </div>
      </div>
    </section>
  )
}
