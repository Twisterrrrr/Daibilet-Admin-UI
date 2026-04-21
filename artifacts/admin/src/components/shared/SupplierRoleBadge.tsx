import { cn } from "@/lib/utils";
import { Download, Building2, Plug } from "lucide-react";

export type SupplierRole = "import_only" | "internal" | "api";

const roleConfig: Record<SupplierRole, { label: string; description: string; icon: typeof Download; className: string }> = {
  import_only: {
    label: "Только импорт",
    description: "События импортируются из внешнего источника. ЛК поставщика не активирован.",
    icon: Download,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  internal: {
    label: "Внутренние + ЛК",
    description: "Поставщик создаёт события в своём ЛК. Полный доступ к кабинету.",
    icon: Building2,
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  api: {
    label: "Внешний API",
    description: "События приходят через API партнёра. ЛК опционален.",
    icon: Plug,
    className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
};

export function SupplierRoleBadge({ role, className }: { role: SupplierRole; className?: string }) {
  const cfg = roleConfig[role];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        cfg.className,
        className
      )}
      title={cfg.description}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export function getSupplierRoleLabel(role: SupplierRole) {
  return roleConfig[role].label;
}
export function getSupplierRoleDescription(role: SupplierRole) {
  return roleConfig[role].description;
}
