import SectionTitle from "@/components/SectionTitle";

export default function Projects() {
  return (
    <div className="page">
      <SectionTitle>Projetos</SectionTitle>
      <div className="card">
        <p className="placeholder">
          Gestão de projetos Git do ecossistema Kerberus. Esta secção será
          ligada à API Kerberus (porta 3000) na Fase 2 para listar, criar e
          clonar repositórios diretamente do Dashboard.
        </p>
      </div>
    </div>
  );
}
