import { cn } from "@/lib/utils";
import { EmptyState, ErrorState } from "./SystemStates";
import { Inbox } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  onRowClick?: (row: T) => void;
  "data-testid"?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  error,
  onRetry,
  emptyMessage,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onRowClick,
  "data-testid": testId,
}: DataTableProps<T>) {
  if (error && !isLoading) {
    return (
      <ErrorState
        title="Не удалось загрузить список"
        description={error}
        onRetry={onRetry}
      />
    );
  }

  const showInlineEmpty = !isLoading && data.length === 0;
  const renderInlineEmpty = showInlineEmpty && (emptyTitle || emptyDescription || emptyAction);

  return (
    <div
      className="border border-border rounded-lg overflow-hidden bg-card"
      data-testid={testId}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  {renderInlineEmpty ? (
                    <div className="p-4">
                      <EmptyState
                        icon={Inbox}
                        title={emptyTitle ?? emptyMessage ?? "Нет данных"}
                        description={emptyDescription}
                        action={emptyAction}
                        variant="no-results"
                      />
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center text-muted-foreground">
                      {emptyMessage ?? "Нет данных"}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/40"
                  )}
                  onClick={() => onRowClick?.(row)}
                  data-testid={`row-${i}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 text-foreground", col.className)}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
