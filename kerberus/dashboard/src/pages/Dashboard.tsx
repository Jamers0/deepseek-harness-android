import { useServices } from "@/hooks/useServices";
import { RUNTIME_INFO } from "@/lib/services";
import StatusCard from "@/components/StatusCard";
import SectionTitle from "@/components/SectionTitle";

export default function Dashboard() {
  const services = useServices();

  return (
    <div className="page">
      <SectionTitle>Serviços</SectionTitle>
      <div className="grid">
        {services.map((s) => (
          <StatusCard key={s.id} service={s} />
        ))}
      </div>

      <SectionTitle>Sistema</SectionTitle>
      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          {RUNTIME_INFO.os}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {RUNTIME_INFO.stack.join(" · ")}
        </div>
      </div>
    </div>
  );
}
