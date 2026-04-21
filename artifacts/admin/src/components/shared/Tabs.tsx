import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-border mb-4 flex items-center gap-1 overflow-x-auto", className)}>
      {items.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
            active === tab.key
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          data-testid={`tab-${tab.key}`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-1.5 px-1.5 py-0.5 rounded text-xs",
              active === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
