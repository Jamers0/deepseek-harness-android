import { useEffect } from 'react'
import { HOST } from '../lib/services'

/**
 * Terminal pop-up: abre um modal com o terminal real do host.
 *
 * Usa o code-server (que já roda em :8080 no proot Ubuntu) como fonte de
 * terminal — é o shell completo do S21 (Termux + Ubuntu via proot).
 *
 * O code-server pede senha no primeiro acesso (auth=password, senha na
 * página Code-server Config). Após logar, o terminal fica persistente.
 */
export default function TerminalPopup({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const codeServerUrl = `http://${HOST}:8080/`

  return (
    <div className="term-overlay" onClick={onClose}>
      <div className="term-modal" onClick={(e) => e.stopPropagation()}>
        <div className="term-head">
          <div className="term-title">
            <span className="term-dot green" />
            <span className="term-dot yellow" />
            <span className="term-dot red" />
            <b>Terminal · S21 (Ubuntu / Termux)</b>
          </div>
          <div className="term-actions">
            <a className="term-ext" href={codeServerUrl} target="_blank" rel="noreferrer" title="Abrir em nova aba">
              ↗
            </a>
            <button className="term-close" onClick={onClose} aria-label="Fechar" title="Fechar (Esc)">
              ✕
            </button>
          </div>
        </div>
        <iframe
          className="term-frame"
          src={codeServerUrl}
          title="Terminal"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  )
}