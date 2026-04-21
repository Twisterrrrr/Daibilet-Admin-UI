import { PanelLeftClose, PanelLeftOpen, Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface TopbarProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

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
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">/</span>}
                <span className={i < breadcrumbs.length - 1 ? "text-muted-foreground" : "font-medium text-foreground"}>
                  {crumb.label}
                </span>
              </span>
            ))}
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
