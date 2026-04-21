import { SupplierSidebar } from "./SupplierSidebar";
import { Topbar } from "./Topbar";

interface SupplierLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function SupplierLayout({ children, title, breadcrumbs }: SupplierLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SupplierSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
