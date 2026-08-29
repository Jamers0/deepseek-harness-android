interface IconButtonProps {
  icon: string;
  label?: string;
  onClick?: () => void;
}

export default function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button
      className="icon-btn"
      onClick={onClick}
      aria-label={label ?? "ação"}
      title={label}
    >
      {icon}
    </button>
  );
}
