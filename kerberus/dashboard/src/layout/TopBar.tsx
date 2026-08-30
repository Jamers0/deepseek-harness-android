export default function TopBar() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '8px 0' }}>
      <button className="icon-btn" title="Notificações">◔</button>
      <button className="icon-btn" title="Perfil">☻</button>
    </div>
  )
}
