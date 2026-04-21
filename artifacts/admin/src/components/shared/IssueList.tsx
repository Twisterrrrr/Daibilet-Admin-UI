import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

export type IssueSeverity = "critical" | "warning" | "info" | "ok";

export interface Issue {
  severity: IssueSeverity;
  message: string;
  field?: string;
}

const severityConfig: Record<IssueSeverity, { icon: React.ElementType; cls: string }> = {
  critical: { icon: AlertCircle, cls: "text-red-600 dark:text-red-400" },
  warning: { icon: AlertTriangle, cls: "text-yellow-600 dark:text-yellow-400" },
  info: { icon: Info, cls: "text-blue-600 dark:text-blue-400" },
  ok: { icon: CheckCircle2, cls: "text-green-600 dark:text-green-400" },
};

export function IssueList({
  issues,
  emptyMessage = "Проблем не обнаружено",
  className,
}: {
  issues: Issue[];
  emptyMessage?: string;
  className?: string;
}) {
  if (issues.length === 0) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span>{emptyMessage}</span>
      </div>
    );
  }
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {issues.map((issue, i) => {
        const cfg = severityConfig[issue.severity];
        const Icon = cfg.icon;
        return (
          <li key={i} className="flex items-start gap-2 text-sm" data-testid={`issue-${issue.severity}-${i}`}>
            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", cfg.cls)} />
            <div>
              <span>{issue.message}</span>
              {issue.field && (
                <span className="ml-1 text-xs text-muted-foreground">({issue.field})</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function IssueCount({ issues }: { issues: Issue[] }) {
  const critical = issues.filter((i) => i.severity === "critical").length;
  const warning = issues.filter((i) => i.severity === "warning").length;
  if (critical === 0 && warning === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-3 h-3" /> OK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      {critical > 0 && (
        <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
          <AlertCircle className="w-3 h-3" /> {critical}
        </span>
      )}
      {warning > 0 && (
        <span className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="w-3 h-3" /> {warning}
        </span>
      )}
    </span>
  );
}
