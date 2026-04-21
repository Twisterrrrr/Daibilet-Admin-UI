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

interface Order {
  id: string;
  buyer: string;
  buyerEmail: string;
  event: string;
  supplier: string;
  amount: number;
  ticketsCount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const mockOrders: Order[] = [
  { id: "ORD-1041", buyer: "Алия Бекова", buyerEmail: "aliya@gmail.com", event: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", amount: 18000, ticketsCount: 2, status: "completed", paymentStatus: "paid", createdAt: "2025-04-20T14:22:00Z" },
  { id: "ORD-1040", buyer: "Данияр Сейткали", buyerEmail: "d.seitkali@mail.ru", event: "Forum на Arena", supplier: "Star Events", amount: 42500, ticketsCount: 2, status: "processing", paymentStatus: "paid", createdAt: "2025-04-20T13:10:00Z" },
  { id: "ORD-1039", buyer: "Мария Петрова", buyerEmail: "petrova@yandex.ru", event: "Stand Up Night", supplier: "Comedy House", amount: 9000, ticketsCount: 2, status: "cancelled", paymentStatus: "refunded", createdAt: "2025-04-20T11:45:00Z" },
  { id: "ORD-1038", buyer: "Темирлан Жумабаев", buyerEmail: "t.zhu@kz.com", event: "Astana Jazz", supplier: "JazzMedia", amount: 31000, ticketsCount: 2, status: "completed", paymentStatus: "paid", createdAt: "2025-04-19T20:00:00Z" },
  { id: "ORD-1037", buyer: "Сания Нурланова", buyerEmail: "s.nurlanova@test.kz", event: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", amount: 15500, ticketsCount: 1, status: "cancelled", paymentStatus: "refunded", createdAt: "2025-04-19T18:30:00Z" },
  { id: "ORD-1036", buyer: "Арман Дюсенов", buyerEmail: "arman@gmail.com", event: "Детский фестиваль", supplier: "KidsFest LLP", amount: 6000, ticketsCount: 2, status: "completed", paymentStatus: "paid", createdAt: "2025-04-18T09:15:00Z" },
];

export default function OrdersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockOrders.filter((o) => {
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.event.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Order>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "buyer", header: "Покупатель", cell: (r) => (
      <div>
        <p className="font-medium text-sm">{r.buyer}</p>
        <p className="text-xs text-muted-foreground">{r.buyerEmail}</p>
      </div>
    )},
    { key: "event", header: "Событие", cell: (r) => r.event },
    { key: "supplier", header: "Поставщик", cell: (r) => <span className="text-xs text-muted-foreground">{r.supplier}</span> },
    { key: "amount", header: "Сумма", cell: (r) => <span className="font-medium">{formatCurrency(r.amount)}</span> },
    { key: "tickets", header: "Билеты", cell: (r) => r.ticketsCount },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "payment", header: "Оплата", cell: (r) => <StatusBadge status={r.paymentStatus} /> },
    { key: "date", header: "Дата", cell: (r) => formatDateTime(r.createdAt) },
  ];

  return (
    <AdminLayout
      title="Заказы"
      breadcrumbs={[{ label: "Администратор" }, { label: "Заказы" }]}
    >
      <PageHeader
        title="Заказы"
        description={`${mockOrders.length} заказов`}
        actions={
          <Button variant="outline" size="sm" data-testid="button-export-orders">
            <Download className="w-4 h-4 mr-1.5" /> Экспорт
          </Button>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по ID, покупателю, событию..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-order-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="processing">В обработке</SelectItem>
              <SelectItem value="completed">Завершены</SelectItem>
              <SelectItem value="cancelled">Отменены</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/orders/${r.id}`)}
        emptyMessage="Заказы не найдены"
        data-testid="table-orders"
      />
    </AdminLayout>
  );
}
