import { useState } from "react";
import { useLocation } from "wouter";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Download } from "lucide-react";

interface Order {
  id: string;
  buyer: string;
  event: string;
  amount: number;
  ticketsCount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const myOrders: Order[] = [
  { id: "ORD-1041", buyer: "Алия Бекова", event: "Ночь музыки 2025", amount: 18000, ticketsCount: 2, status: "completed", paymentStatus: "paid", createdAt: "2025-04-20T14:22:00Z" },
  { id: "ORD-1040", buyer: "Данияр Сейткали", event: "Ночь музыки 2025", amount: 9000, ticketsCount: 1, status: "completed", paymentStatus: "paid", createdAt: "2025-04-20T13:10:00Z" },
  { id: "ORD-1039", buyer: "Мария Петрова", event: "Ночь музыки 2025", amount: 9000, ticketsCount: 1, status: "cancelled", paymentStatus: "refunded", createdAt: "2025-04-20T11:45:00Z" },
  { id: "ORD-1038", buyer: "Темирлан Жумабаев", event: "Ночь музыки 2025", amount: 18000, ticketsCount: 2, status: "completed", paymentStatus: "paid", createdAt: "2025-04-19T20:00:00Z" },
];

export default function SupplierOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = myOrders.filter((o) => {
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Order>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "buyer", header: "Покупатель", cell: (r) => r.buyer },
    { key: "event", header: "Событие", cell: (r) => r.event },
    { key: "amount", header: "Сумма", cell: (r) => <span className="font-medium">{formatCurrency(r.amount)}</span> },
    { key: "tickets", header: "Билеты", cell: (r) => r.ticketsCount },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "payment", header: "Оплата", cell: (r) => <StatusBadge status={r.paymentStatus} /> },
    { key: "date", header: "Дата", cell: (r) => formatDateTime(r.createdAt) },
  ];

  return (
    <SupplierLayout
      title="Заказы"
      breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Заказы" }]}
    >
      <PageHeader
        title="Мои заказы"
        description={`${myOrders.length} заказов`}
        actions={
          <Button variant="outline" size="sm" data-testid="button-export-supplier-orders">
            <Download className="w-4 h-4 mr-1.5" /> Экспорт
          </Button>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по ID или покупателю..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-supplier-order-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="completed">Завершены</SelectItem>
              <SelectItem value="cancelled">Отменены</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="Заказы не найдены"
        data-testid="supplier-table-orders"
      />
    </SupplierLayout>
  );
}
