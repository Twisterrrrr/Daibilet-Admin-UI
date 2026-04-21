import { cn } from "@/lib/utils";

type StatusVariant =
  | "active"
  | "inactive"
  | "draft"
  | "published"
  | "pending"
  | "approved"
  | "rejected"
  | "refunded"
  | "cancelled"
  | "completed"
  | "new"
  | "processing"
  | "paid"
  | string;

const variantStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const statusLabels: Record<string, string> = {
  active: "Активен",
  inactive: "Неактивен",
  draft: "Черновик",
  published: "Опубликован",
  pending: "На рассмотрении",
  approved: "Одобрен",
  rejected: "Отклонён",
  refunded: "Возврат",
  cancelled: "Отменён",
  completed: "Завершён",
  new: "Новый",
  processing: "В обработке",
  paid: "Оплачен",
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = variantStyles[status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  const displayLabel = label ?? statusLabels[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        style,
        className
      )}
      data-testid={`badge-status-${status}`}
    >
      {displayLabel}
    </span>
  );
}
