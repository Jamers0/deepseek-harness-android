import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TopBar from "./TopBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Header />
        <TopBar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
