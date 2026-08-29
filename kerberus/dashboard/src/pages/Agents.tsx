import SectionTitle from "@/components/SectionTitle";
import IconButton from "@/components/IconButton";

const AGENTS = [
  { name: "Harness Core", role: "Geração de código" },
  { name: "Runtime Monitor", role: "Consumo CPU/RAM (em breve)" },
  { name: "API Kerberus", role: "Orquestração (em breve)" },
];

export default function Agents() {
  return (
    <div className="page">
      <SectionTitle>Agentes</SectionTitle>
      <div className="grid">
        {AGENTS.map((a) => (
          <div className="card" key={a.name}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{a.name}</div>
                <div className="placeholder" style={{ fontSize: 13 }}>
                  {a.role}
                </div>
              </div>
              <IconButton icon="⚙" label={`config ${a.name}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
