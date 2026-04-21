import { cn } from "@/lib/utils";
import { Pencil, Download, Plug, Layers } from "lucide-react";

export type InventorySource = "manual" | "imported" | "api" | "hybrid" | string;
export type SalesMode = "internal_checkout" | "external_redirect" | "mirror" | "hybrid" | string;

const sourceConfig: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  manual: {
    label: "Manual",
    icon: Pencil,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  imported: {
    label: "Imported",
    icon: Download,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  api: {
    label: "API",
    icon: Plug,
    cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  hybrid: {
    label: "Hybrid",
    icon: Layers,
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

const salesModeLabels: Record<string, string> = {
  internal_checkout: "Internal checkout",
  external_redirect: "External redirect",
  mirror: "Mirror",
  hybrid: "Hybrid",
};

export function SourceBadge({ source, className }: { source: InventorySource; className?: string }) {
  const cfg = sourceConfig[source] ?? {
    label: source,
    icon: Plug,
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
      data-testid={`badge-source-${source}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export function SalesModeBadge({ mode, className }: { mode: SalesMode; className?: string }) {
  const label = salesModeLabels[mode] ?? mode;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border",
        className
      )}
      data-testid={`badge-sales-mode-${mode}`}
    >
      {label}
    </span>
  );
}
