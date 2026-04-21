import { cn } from "@/lib/utils";

interface DetailFieldProps {
  label: string;
  value?: React.ReactNode;
  readOnly?: boolean;
  className?: string;
}

export function DetailField({ label, value, readOnly = false, className }: DetailFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
        {readOnly && (
          <span className="ml-1.5 normal-case tracking-normal text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
            read-only
          </span>
        )}
      </span>
      <div className="text-sm text-foreground">
        {value ?? <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailSection({ title, children, className }: DetailSectionProps) {
  return (
    <div className={cn("bg-card border border-card-border rounded-lg p-5", className)}>
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}
