import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  fromType: "buyer" | "supplier";
  fromName: string;
  category: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "new" | "processing" | "completed" | "cancelled";
  assignedTo?: string;
  createdAt: string;
}

const mockTickets: Ticket[] = [
  { id: "SUP-301", subject: "Не пришёл билет на e-mail", fromType: "buyer", fromName: "Алия Бекова", category: "Заказы", priority: "high", status: "new", createdAt: "2025-04-21T10:00:00Z" },
  { id: "SUP-300", subject: "Запрос на перенос даты события", fromType: "supplier", fromName: "ArtPro Kazakhstan", category: "События", priority: "normal", status: "processing", assignedTo: "manager@daibilet.kz", createdAt: "2025-04-21T08:00:00Z" },
  { id: "SUP-299", subject: "Ошибка при оплате через Kaspi", fromType: "buyer", fromName: "Темирлан Жумабаев", category: "Платежи", priority: "urgent", status: "processing", assignedTo: "support@daibilet.kz", createdAt: "2025-04-20T20:00:00Z" },
  { id: "SUP-298", subject: "Как загрузить логотип", fromType: "supplier", fromName: "KidsFest LLP", category: "Профиль", priority: "low", status: "completed", assignedTo: "support@daibilet.kz", createdAt: "2025-04-19T14:00:00Z" },
];

const priorityStyles: Record<Ticket["priority"], string> = {
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
const priorityLabels: Record<Ticket["priority"], string> = {
  low: "Низкий", normal: "Обычный", high: "Высокий", urgent: "Срочный",
};

export default function SupportList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockTickets.filter((t) => {
    const matchSearch =
      !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.fromName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Ticket>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "subject", header: "Тема", cell: (r) => <span className="font-medium">{r.subject}</span> },
    { key: "from", header: "От кого", cell: (r) => (
      <div className="flex flex-col">
        <span className="text-sm">{r.fromName}</span>
        <span className="text-xs text-muted-foreground">
          {r.fromType === "buyer" ? "Покупатель" : "Поставщик"}
        </span>
      </div>
    )},
    { key: "category", header: "Категория", cell: (r) => r.category },
    { key: "priority", header: "Приоритет", cell: (r) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[r.priority]}`}>
        {priorityLabels[r.priority]}
      </span>
    )},
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "assigned", header: "Ответственный", cell: (r) => r.assignedTo ?? <span className="text-muted-foreground">—</span> },
    { key: "date", header: "Создан", cell: (r) => formatDateTime(r.createdAt) },
  ];

  const newCount = mockTickets.filter((t) => t.status === "new").length;

  return (
    <AdminLayout title="Поддержка" breadcrumbs={[{ label: "Администратор" }, { label: "Обращения" }]}>
      <PageHeader
        title="Обращения в поддержку"
        description={`${mockTickets.length} обращений · ${newCount} новых`}
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по теме или автору..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44" data-testid="select-support-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="processing">В работе</SelectItem>
              <SelectItem value="completed">Закрыты</SelectItem>
              <SelectItem value="cancelled">Отменены</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/support/${r.id}`)}
        emptyMessage="Обращений не найдено"
        data-testid="table-support"
      />
    </AdminLayout>
  );
}
