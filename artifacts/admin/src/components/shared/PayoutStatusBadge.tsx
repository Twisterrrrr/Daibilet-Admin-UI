import { cn } from "@/lib/utils";
import { Clock, RefreshCw, CheckCircle2, XCircle, PauseCircle } from "lucide-react";

export type PayoutStatus = "pending" | "processing" | "paid" | "failed" | "held";

const config: Record<PayoutStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending:    { label: "Ожидает",      icon: Clock,        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  processing: { label: "В обработке",  icon: RefreshCw,    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  paid:       { label: "Выплачено",    icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  failed:     { label: "Ошибка",       icon: XCircle,      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  held:       { label: "Заблокировано",icon: PauseCircle,  className: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

export function PayoutStatusBadge({ status, className }: { status: PayoutStatus; className?: string }) {
  const cfg = config[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", cfg.className, className)}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}
