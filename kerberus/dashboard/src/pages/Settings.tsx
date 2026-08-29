import SectionTitle from "@/components/SectionTitle";

export default function Settings() {
  return (
    <div className="page">
      <SectionTitle>Configurações</SectionTitle>
      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Ambiente</div>
        <ul className="placeholder" style={{ paddingLeft: 18 }}>
          <li>Branch: kerberus-v1</li>
          <li>Host: Android (Termux) → Ubuntu 24.04 (proot)</li>
          <li>Harness: 127.0.0.1:3080</li>
          <li>Dashboard: 127.0.0.1:3001</li>
          <li>Regra: Harness nunca exposto em 0.0.0.0</li>
        </ul>
      </div>
    </div>
  );
}
