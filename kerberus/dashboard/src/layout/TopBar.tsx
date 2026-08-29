import { useServices } from "@/hooks/useServices";

export default function TopBar() {
  const services = useServices();
  const online = services.filter((s) => s.status === "online").length;

  return (
    <div className="topbar">
      <span className="status-pill">
        <span className="badge online">
          <span className="led" />
          {online} online
        </span>
        <span className="badge warning">
          <span className="led" />
          {services.length - online} pendente(s)
        </span>
      </span>
      <span className="status-pill">kerberus-v1 · 127.0.0.1:3001</span>
    </div>
  );
}
