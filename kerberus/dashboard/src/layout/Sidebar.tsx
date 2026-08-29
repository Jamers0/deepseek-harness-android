import { NavLink } from "react-router-dom";

interface NavEntry {
  to: string;
  label: string;
  icon: string;
}

const NAV: NavEntry[] = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/projects", label: "Novo Chat", icon: "✎" },
  { to: "/projects", label: "Projetos", icon: "▤" },
  { to: "/agents", label: "Agentes", icon: "⚇" },
  { to: "/runtime", label: "Terminal", icon: "▷" },
  { to: "/runtime", label: "Runtime", icon: "⚙" },
  { to: "/settings", label: "Configurações", icon: "⚒" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="dot" />
        KERBERUS
      </div>
      <nav>
        {NAV.map((item, i) => (
          <NavLink
            key={`${item.to}-${i}`}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
