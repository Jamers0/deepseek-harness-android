import SectionTitle from "@/components/SectionTitle";
import StatusCard from "@/components/StatusCard";
import { useServices } from "@/hooks/useServices";

export default function Runtime() {
  const services = useServices();
  const runtimeServices = services.filter(
    (s) => s.id === "vscode" || s.id === "api"
  );

  return (
    <div className="page">
      <SectionTitle>Runtime (Ubuntu 24.04)</SectionTitle>
      <div className="grid">
        {runtimeServices.map((s) => (
          <StatusCard key={s.id} service={s} />
        ))}
      </div>
      <SectionTitle>Terminal</SectionTitle>
      <div className="card">
        <p className="placeholder">
          Acesso ao terminal do Ubuntu (proot) e ao VS Code Server (8080) será
          integrado aqui na Fase 4 via WebSocket e controle de processos.
        </p>
      </div>
    </div>
  );
}
