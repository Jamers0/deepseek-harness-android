import type { ServiceStatus } from "@/lib/services";

interface ServiceBadgeProps {
  status: ServiceStatus;
  label?: string;
}

const MAP: Record<ServiceStatus, { cls: string; text: string }> = {
  online: { cls: "online", text: "Online" },
  offline: { cls: "offline", text: "Offline" },
  warning: { cls: "warning", text: "Pendente" },
};

export default function ServiceBadge({ status, label }: ServiceBadgeProps) {
  const m = MAP[status];
  return (
    <span className={`badge ${m.cls}`}>
      <span className="led" />
      {label ?? m.text}
    </span>
  );
}
