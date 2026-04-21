import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock } from "lucide-react";

export type SyncStatus = "ok" | "stale" | "error" | "syncing" | "never" | string;

const syncConfig: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  ok: {
    label: "Sync OK",
    icon: CheckCircle2,
    cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  stale: {
    label: "Устарело",
    icon: Clock,
    cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  error: {
    label: "Ошибка",
    icon: XCircle,
    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  syncing: {
    label: "Синхронизация",
    icon: RefreshCw,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  never: {
    label: "Не выполнялась",
    icon: AlertTriangle,
    cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
};

export function SyncStatusBadge({ status, className }: { status: SyncStatus; className?: string }) {
  const cfg = syncConfig[status] ?? {
    label: status,
    icon: AlertTriangle,
    cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        cfg.cls,
        className
      )}
      data-testid={`badge-sync-${status}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}
