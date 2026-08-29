interface SectionTitleProps {
  children: string;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="section-title">{children}</h2>;
}
