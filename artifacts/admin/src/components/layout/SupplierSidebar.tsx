import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingCart,
  User,
  BarChart2,
  MessageSquare,
  Ticket,
  ShieldCheck,
  Plug,
  RotateCcw,
} from "lucide-react";

const supplierNav = [
  { label: "Дашборд", href: "/supplier", icon: LayoutDashboard },
  { label: "Мои события", href: "/supplier/events", icon: CalendarDays },
  { label: "Заказы", href: "/supplier/orders", icon: ShoppingCart },
  { label: "Возвраты", href: "/supplier/refunds", icon: RotateCcw },
  { label: "Интеграции", href: "/supplier/integrations", icon: Plug },
  { label: "Отчёты", href: "/supplier/reports", icon: BarChart2 },
  { label: "Профиль / Компания", href: "/supplier/profile", icon: User },
  { label: "Обращения", href: "/supplier/support", icon: MessageSquare },
];

export function SupplierSidebar() {
  const [location] = useLocation();

  return (
    <aside className="flex flex-col h-full w-60 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Ticket className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sidebar-foreground tracking-tight">Daibilet</span>
      </div>

      <div className="px-3 pt-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Кабинет поставщика
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-0.5">
        {supplierNav.map((item) => {
          const isActive =
            item.href === "/supplier"
              ? location === "/supplier" || location === "/supplier/"
              : location.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                data-testid={`supplier-nav-${item.label.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "")}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <Link href="/admin">
          <span className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Панель администратора</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
