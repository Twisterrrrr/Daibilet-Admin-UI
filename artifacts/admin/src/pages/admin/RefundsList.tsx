import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Download } from "lucide-react";

interface RefundRow {
  id: string;
  orderId: string;
  buyer: string;
  event: string;
  supplier: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "processing";
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

const mockRefunds: RefundRow[] = [
  { id: "REF-22", orderId: "ORD-1041", buyer: "Алия Бекова", event: "Ночь музыки 2025", supplier: "АртПро Концерты", amount: 18000, reason: "Не смогу посетить мероприятие", status: "pending", createdAt: "2025-04-21T10:00:00Z" },
  { id: "REF-21", orderId: "ORD-1037", buyer: "Сания Нурланова", event: "Ночь музыки 2025", supplier: "АртПро Концерты", amount: 15500, reason: "Купил у конкурента", status: "approved", createdAt: "2025-04-19T19:00:00Z", decidedAt: "2025-04-19T20:30:00Z", decidedBy: "admin@daibilet.ru" },
  { id: "REF-20", orderId: "ORD-1039", buyer: "Мария Петрова", event: "Stand Up Night", supplier: "Комеди Хаус", amount: 9000, reason: "Изменились планы", status: "approved", createdAt: "2025-04-20T11:50:00Z", decidedAt: "2025-04-20T12:30:00Z", decidedBy: "admin@daibilet.ru" },
  { id: "REF-19", orderId: "ORD-1024", buyer: "Бакыт Касенов", event: "Forum на Arena", supplier: "Стар Ивентс", amount: 21500, reason: "Купил два раза по ошибке", status: "rejected", createdAt: "2025-04-15T09:00:00Z", decidedAt: "2025-04-15T14:00:00Z", decidedBy: "admin@daibilet.ru" },
  { id: "REF-18", orderId: "ORD-1019", buyer: "Айдана Кулжанова", event: "Saint Petersburg Jazz", supplier: "ДжазМедиа", amount: 15000, reason: "Заболел", status: "processing", createdAt: "2025-04-21T11:00:00Z" },
];

export default function RefundsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [, setLocation] = useLocation();

  const filtered = mockRefunds.filter((r) => {
    const matchSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.buyer.toLowerCase().includes(search.toLowerCase()) ||
      r.event.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<RefundRow>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "order", header: "Заказ", cell: (r) => (
      <button
        className="text-primary hover:underline text-sm font-mono"
        onClick={(e) => { e.stopPropagation(); setLocation(`/admin/orders/${r.orderId}`); }}
      >
        {r.orderId}
      </button>
    )},
    { key: "buyer", header: "Покупатель", cell: (r) => r.buyer },
    { key: "event", header: "Событие", cell: (r) => (
      <div className="flex flex-col">
        <span className="text-sm">{r.event}</span>
        <span className="text-xs text-muted-foreground">{r.supplier}</span>
      </div>
    )},
    { key: "amount", header: "Сумма", cell: (r) => <span className="font-medium">{formatCurrency(r.amount)}</span> },
    { key: "reason", header: "Причина", cell: (r) => <span className="text-sm text-muted-foreground line-clamp-2">{r.reason}</span> },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Создан", cell: (r) => formatDateTime(r.createdAt) },
  ];

  const pendingCount = mockRefunds.filter((r) => r.status === "pending").length;

  return (
    <AdminLayout title="Возвраты" breadcrumbs={[{ label: "Администратор" }, { label: "Возвраты" }]}>
      <PageHeader
        title="Запросы на возврат"
        description={`${mockRefunds.length} запросов · ${pendingCount} ожидает решения`}
        actions={
          <Button variant="outline" size="sm" data-testid="button-export-refunds">
            <Download className="w-4 h-4 mr-1.5" /> Экспорт
          </Button>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="ID запроса, заказа, покупателя..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44" data-testid="select-refund-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидают решения</SelectItem>
              <SelectItem value="processing">В обработке</SelectItem>
              <SelectItem value="approved">Одобрены</SelectItem>
              <SelectItem value="rejected">Отклонены</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/refunds/${r.id}`)}
        emptyMessage="Запросы не найдены"
        data-testid="table-refunds"
      />
    </AdminLayout>
  );
}
