import { PanelLeftClose, PanelLeftOpen, Bell, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface TopbarProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

const DEFAULT_HREFS: Record<string, string> = {
  "Администратор": "/admin",
  "Кабинет поставщика": "/supplier",
  "Дашборд": "/admin",
  "События": "/admin/events",
  "Площадки": "/admin/venues",
  "Города": "/admin/cities",
  "Категории": "/admin/categories",
  "Теги": "/admin/tags",
  "Заказы": "/admin/orders",
  "Возвраты": "/admin/refunds",
  "Покупатели": "/admin/users",
  "Поставщики": "/admin/suppliers",
  "Интеграции": "/admin/integrations",
  "Финансы": "/admin/finance",
  "Транзакции": "/admin/finance/transactions",
  "Выплаты": "/admin/finance/payouts",
  "Сверки": "/admin/finance/reconciliation",
  "Отчёты": "/admin/reports",
  "Лендинги": "/admin/landings",
  "Подборки": "/admin/collections",
  "Статьи": "/admin/articles",
  "Promo-блоки": "/admin/promo-blocks",
  "Промо-размещения": "/admin/promo-placements",
  "SEO-аудит": "/admin/seo-audit",
  "Отзывы": "/admin/reviews",
  "Чат с сайта": "/admin/chat",
  "Обращения": "/admin/support",
  "Сотрудники": "/admin/staff",
  "Логи / диагностика": "/admin/logs",
  "Системные состояния": "/admin/system-states",
  "Настройки": "/admin/settings",
  "Дубликаты площадок": "/admin/venues/duplicates",
  "Кандидаты площадок": "/admin/venues/candidates",
  "Мои события": "/supplier/events",
  "Профиль / Компания": "/supplier/profile",
};

export function Topbar({ title, sidebarCollapsed, onToggleSidebar, breadcrumbs }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center gap-4 px-4 shrink-0">
      {onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="shrink-0"
          data-testid="button-toggle-sidebar"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </Button>
      )}

      <div className="flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              const cls = isLast ? "font-medium text-foreground" : "text-muted-foreground";
              const href = crumb.href ?? DEFAULT_HREFS[crumb.label];
              return (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-muted-foreground">/</span>}
                  {href && !isLast ? (
                    <Link
                      href={href}
                      className={`${cls} hover:text-foreground hover:underline cursor-pointer`}
                      data-testid={`breadcrumb-${i}`}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cls}>{crumb.label}</span>
                  )}
                </span>
              );
            })}
          </div>
        ) : (
          <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-toggle-theme">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" data-testid="button-notifications">
          <Bell className="w-4 h-4" />
        </Button>
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold ml-1" data-testid="avatar-user">
          А
        </div>
      </div>
    </header>
  );
}
