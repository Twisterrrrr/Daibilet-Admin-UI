import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
  "data-testid"?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
  "data-testid": testId,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-card-border rounded-lg p-5 flex flex-col gap-3",
        className
      )}
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent-foreground" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.positive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
