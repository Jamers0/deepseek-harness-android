import type { KerberusService } from "@/lib/services";
import ServiceBadge from "./ServiceBadge";

interface StatusCardProps {
  service: KerberusService;
}

export default function StatusCard({ service }: StatusCardProps) {
  return (
    <article className="status-card accent">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="title">{service.name}</span>
        <ServiceBadge status={service.status} />
      </div>
      <span className="port">
        {service.host}:{service.port}
      </span>
      <span className="desc">{service.description}</span>
    </article>
  );
}
