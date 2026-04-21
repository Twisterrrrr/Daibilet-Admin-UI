import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Building2,
  Users,
  ShoppingCart,
  Globe,
  Megaphone,
  Settings,
  ChevronDown,
  Ticket,
  LogOut,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const adminNav: NavItem[] = [
  { label: "Дашборд", href: "/admin", icon: LayoutDashboard },
  { label: "События", href: "/admin/events", icon: CalendarDays },
  {
    label: "Площадки",
    icon: Building2,
    children: [
      { label: "Все площадки", href: "/admin/venues" },
      { label: "Города", href: "/admin/cities" },
    ],
  },
  { label: "Поставщики", href: "/admin/suppliers", icon: Users },
  { label: "Заказы", href: "/admin/orders", icon: ShoppingCart },
  { label: "Лендинги", href: "/admin/landings", icon: Globe },
  { label: "Промо-блоки", href: "/admin/promo-blocks", icon: Megaphone },
  { label: "Настройки", href: "/admin/settings", icon: Settings },
];

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  if (item.children) {
    const isActive = item.children.some((c) => location.startsWith(c.href));
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <item.icon className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              <ChevronDown
                className={cn("w-3 h-3 transition-transform", open && "rotate-180")}
              />
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="mt-1 ml-7 flex flex-col gap-0.5">
            {item.children.map((child) => (
              <Link key={child.href} href={child.href}>
                <span
                  className={cn(
                    "block px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                    location.startsWith(child.href)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  {child.label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = item.href
    ? item.href === "/admin"
      ? location === "/admin" || location === "/admin/"
      : location.startsWith(item.href + "/") || location === item.href
    : false;

  return (
    <Link href={item.href!}>
      <span
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <item.icon className="w-4 h-4 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </span>
    </Link>
  );
}

export function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-14" : "w-60"
      )}
    >
      <div className={cn("flex items-center gap-2 px-4 py-4 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Ticket className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground tracking-tight">Daibilet</span>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Администратор
          </span>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-0.5">
        {adminNav.map((item) => (
          <NavLink key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <Link href="/supplier">
          <span className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer">
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Кабинет поставщика</span>}
          </span>
        </Link>
      </div>
    </aside>
  );
}
