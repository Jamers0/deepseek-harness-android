type Props = {
  onOpen: (r: string) => void
}

export default function SupportFooter({ onOpen }: Props) {
  const links = [
    { label: 'Documentação técnica do Kerberus', route: '/navegar' },
    { label: 'Guias de migração e deploy', route: '/navegar' },
    { label: 'Notas de atualização', route: '/navegar' },
    { label: 'Status da malha Tailscale', route: '/tailscale' },
    { label: 'Central de suporte', route: '/navegar' },
  ]

  return (
    <footer className="support">
      <div>
        <h4>Links úteis</h4>
        <div className="support-links">
          {links.map((l) => (
            <a key={l.label} href={`#${l.route}`} onClick={(e) => { e.preventDefault(); onOpen(l.route) }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mobile-callout">
        <h4>Versão móvel</h4>
        <p>
          Este painel é responsivo: abra-o pelo endereço configurado do Kerberus
          e use o botão de tema ☀/☾ no topo para alternar
          entre o modo escuro (preto) e o claro (branco).
        </p>
        <span className="mc-tag">Otimizado para Android</span>
      </div>
    </footer>
  )
}
