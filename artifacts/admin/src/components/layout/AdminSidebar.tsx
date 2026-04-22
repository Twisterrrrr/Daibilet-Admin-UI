import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  ShoppingCart,
  Globe,
  Megaphone,
  Settings,
  Ticket,
  LogOut,
  UserCircle,
  RotateCcw,
  Star,
  LifeBuoy,
  FileText,
  FolderTree,
  Search,
  Tags,
  Activity,
  Plug,
  Wallet,
  ArrowLeftRight,
  Scale,
  PieChart,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface NavGroup {
  label: string;
  items: { label: string; href: string; icon: React.ElementType }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Operations",
    items: [{ label: "Дашборд", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Каталог",
    items: [
      { label: "События", href: "/admin/events", icon: CalendarDays },
      { label: "Площадки", href: "/admin/venues", icon: Building2 },
      { label: "Города", href: "/admin/cities", icon: Globe },
      { label: "Категории", href: "/admin/categories", icon: FolderTree },
      { label: "Теги", href: "/admin/tags", icon: Tags },
    ],
  },
  {
    label: "Продажи",
    items: [
      { label: "Заказы", href: "/admin/orders", icon: ShoppingCart },
      { label: "Возвраты", href: "/admin/refunds", icon: RotateCcw },
      { label: "Покупатели", href: "/admin/users", icon: UserCircle },
    ],
  },
  {
    label: "Партнёры",
    items: [
      { label: "Поставщики", href: "/admin/suppliers", icon: Users },
      { label: "Интеграции", href: "/admin/integrations", icon: Plug },
    ],
  },
  {
    label: "Финансы",
    items: [
      { label: "Финансы", href: "/admin/finance", icon: Wallet },
      { label: "Транзакции", href: "/admin/finance/transactions", icon: ArrowLeftRight },
      { label: "Выплаты", href: "/admin/finance/payouts", icon: Wallet },
      { label: "Сверки", href: "/admin/finance/reconciliation", icon: Scale },
    ],
  },
  {
    label: "Аналитика",
    items: [{ label: "Отчёты", href: "/admin/reports", icon: PieChart }],
  },
  {
    label: "Маркетинг",
    items: [
      { label: "Лендинги", href: "/admin/landings", icon: Globe },
      { label: "Промо-блоки", href: "/admin/promo-blocks", icon: Megaphone },
      { label: "Промо-размещения", href: "/admin/promo-placements", icon: LayoutDashboard },
      { label: "Статьи / Блог", href: "/admin/articles", icon: FileText },
      { label: "Подборки", href: "/admin/collections", icon: FolderTree },
      { label: "SEO Аудит", href: "/admin/seo-audit", icon: Search },
    ],
  },
  {
    label: "Поддержка",
    items: [
      { label: "Чат с сайта", href: "/admin/chat", icon: MessageCircle },
      { label: "Обращения", href: "/admin/support", icon: LifeBuoy },
      { label: "Отзывы", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    label: "Система",
    items: [
      { label: "Сотрудники / RBAC", href: "/admin/staff", icon: ShieldCheck },
      { label: "Логи / диагностика", href: "/admin/logs", icon: Activity },
      { label: "Системные состояния", href: "/admin/system-states", icon: AlertCircle },
      { label: "Настройки", href: "/admin/settings", icon: Settings },
      { label: "Локаль и форматы", href: "/admin/settings/locale", icon: Globe },
    ],
  },
];

function NavLink({
  item,
  collapsed,
}: {
  item: { label: string; href: string; icon: React.ElementType };
  collapsed: boolean;
}) {
  const [location] = useLocation();
  const isActive =
    item.href === "/admin"
      ? location === "/admin" || location === "/admin/"
      : location.startsWith(item.href + "/") || location === item.href;
  return (
    <Link href={item.href}>
      <span
        className={cn(
          "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "")}`}
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
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-4 border-b border-sidebar-border",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Ticket className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground tracking-tight">
            Daibilet
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-3">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            {!collapsed && (
              <div className="px-3 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {group.label}
                </span>
              </div>
            )}
            {group.items.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} />
            ))}
          </div>
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
