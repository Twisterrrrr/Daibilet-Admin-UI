import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Topbar } from "./Topbar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title={title}
          breadcrumbs={breadcrumbs}
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
