import { AlertTriangle, Inbox, RefreshCw, WifiOff, ShieldAlert, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type SystemStateKind = "loading" | "empty" | "error" | "partial" | "ok";

export function parseStateParam(search: string): SystemStateKind {
  const params = new URLSearchParams(search);
  const v = params.get("state");
  if (v === "loading" || v === "empty" || v === "error" || v === "partial") return v;
  return "ok";
}

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "no-results";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const ResolvedIcon = Icon ?? (variant === "no-results" ? Search : Inbox);
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 px-6 py-12 rounded-lg border border-dashed border-border bg-muted/20",
        className
      )}
      data-testid="empty-state"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <ResolvedIcon className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-1 max-w-md">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  errorCode?: string;
  onRetry?: () => void;
  variant?: "network" | "server" | "permission";
  className?: string;
}

export function ErrorState({
  title,
  description,
  errorCode,
  onRetry,
  variant = "server",
  className,
}: ErrorStateProps) {
  const Icon = variant === "network" ? WifiOff : variant === "permission" ? ShieldAlert : AlertTriangle;
  const defaultTitle =
    variant === "network"
      ? "Нет связи с сервером"
      : variant === "permission"
      ? "Недостаточно прав"
      : "Не удалось загрузить данные";
  const defaultDesc =
    variant === "network"
      ? "Проверьте подключение к интернету. Мы попробуем снова, как только связь восстановится."
      : variant === "permission"
      ? "У вашей роли нет доступа к этому разделу. Обратитесь к администратору."
      : "Произошла ошибка на сервере. Попробуйте обновить страницу через несколько секунд.";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 px-6 py-12 rounded-lg border border-destructive/30 bg-destructive/5",
        className
      )}
      data-testid="error-state"
    >
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-1 max-w-md">
        <h3 className="text-base font-semibold text-foreground">{title ?? defaultTitle}</h3>
        <p className="text-sm text-muted-foreground">{description ?? defaultDesc}</p>
        {errorCode && (
          <code className="mt-1 text-[11px] text-muted-foreground font-mono">код: {errorCode}</code>
        )}
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} data-testid="button-retry">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Повторить
        </Button>
      )}
    </div>
  );
}

interface PartialErrorBannerProps {
  title?: string;
  message: string;
  failedSources?: string[];
  onRetry?: () => void;
  className?: string;
}

export function PartialErrorBanner({
  title = "Часть данных не загрузилась",
  message,
  failedSources,
  onRetry,
  className,
}: PartialErrorBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
        className
      )}
      data-testid="partial-error-banner"
    >
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-amber-900 dark:text-amber-200">{title}</div>
        <p className="text-sm text-amber-800/90 dark:text-amber-200/80 mt-0.5">{message}</p>
        {failedSources && failedSources.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {failedSources.map((src) => (
              <span
                key={src}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200"
              >
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="border-amber-400 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/40"
          data-testid="button-retry-partial"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Повторить
        </Button>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}
