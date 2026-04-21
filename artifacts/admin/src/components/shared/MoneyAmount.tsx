import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MoneyAmountProps {
  amount: number | null | undefined;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "positive" | "negative" | "muted";
  deltaPercent?: number;
  subtitle?: string;
}

const sizeClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl font-semibold",
  xl: "text-3xl font-bold tracking-tight",
};

const variantClass = {
  default: "text-foreground",
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-red-600 dark:text-red-400",
  muted: "text-muted-foreground",
};

export function MoneyAmount({
  amount, currency = "KZT", className, size = "md", variant = "default", deltaPercent, subtitle,
}: MoneyAmountProps) {
  const isPositiveDelta = deltaPercent != null && deltaPercent >= 0;
  return (
    <div className={cn("inline-flex flex-col gap-0.5", className)}>
      <span className={cn(sizeClass[size], variantClass[variant], "tabular-nums")}>
        {formatCurrency(amount, currency)}
      </span>
      {(deltaPercent != null || subtitle) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {deltaPercent != null && (
            <span className={cn("inline-flex items-center gap-0.5 font-medium", isPositiveDelta ? "text-emerald-600" : "text-red-600")}>
              {isPositiveDelta ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(deltaPercent).toFixed(1)}%
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
