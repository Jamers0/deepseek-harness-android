type Props = {
  title?: string
  onClick?: () => void
  children?: React.ReactNode
}

export default function IconButton({ title, onClick, children }: Props) {
  return (
    <button className="icon-btn" title={title} onClick={onClick}>
      {children}
    </button>
  )
}
