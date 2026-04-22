import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SourceBadge, type InventorySource } from "@/components/shared/SourceBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Download, AlertTriangle, UserCheck, UserX } from "lucide-react";

interface Order {
  id: string;
  buyer: string;
  buyerEmail: string;
  buyerLinked: boolean;
  event: string;
  supplier: string;
  channel: "internal_checkout" | "ticketscloud_mirror" | "teplohod_api" | "ticketon_mirror" | "manual";
  inventoryOwner: InventorySource;
  paymentProvider: string;
  amount: number;
  ticketsCount: number;
  status: string;
  paymentStatus: string;
  hasRefundRequest: boolean;
  visibleInBuyerAccount: boolean;
  visibleInSupplierCabinet: boolean;
  createdAt: string;
}

const channelLabels: Record<Order["channel"], string> = {
  internal_checkout: "Internal checkout",
  ticketscloud_mirror: "Ticketscloud mirror",
  teplohod_api: "Teplohod API",
  ticketon_mirror: "Ticketon mirror",
  manual: "Manual",
};

const mockOrders: Order[] = [
  { id: "ORD-1041", buyer: "Алия Бекова", buyerEmail: "aliya@gmail.com", buyerLinked: true, event: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", channel: "internal_checkout", inventoryOwner: "imported", paymentProvider: "ЮKassa", amount: 18000, ticketsCount: 2, status: "completed", paymentStatus: "paid", hasRefundRequest: true, visibleInBuyerAccount: true, visibleInSupplierCabinet: true, createdAt: "2025-04-20T14:22:00Z" },
  { id: "ORD-1040", buyer: "Данияр Сейткали", buyerEmail: "d.seitkali@mail.ru", buyerLinked: true, event: "Forum на Arena", supplier: "Star Events", channel: "ticketscloud_mirror", inventoryOwner: "api", paymentProvider: "Ticketscloud", amount: 42500, ticketsCount: 2, status: "processing", paymentStatus: "paid", hasRefundRequest: false, visibleInBuyerAccount: true, visibleInSupplierCabinet: true, createdAt: "2025-04-20T13:10:00Z" },
  { id: "ORD-1039", buyer: "Мария Петрова", buyerEmail: "petrova@yandex.ru", buyerLinked: false, event: "Stand Up Night", supplier: "Comedy House", channel: "internal_checkout", inventoryOwner: "manual", paymentProvider: "Тинькофф Касса", amount: 9000, ticketsCount: 2, status: "cancelled", paymentStatus: "refunded", hasRefundRequest: false, visibleInBuyerAccount: false, visibleInSupplierCabinet: true, createdAt: "2025-04-20T11:45:00Z" },
  { id: "ORD-1038", buyer: "Темирлан Жумабаев", buyerEmail: "t.zhu@kz.com", buyerLinked: true, event: "Astana Jazz", supplier: "JazzMedia", channel: "teplohod_api", inventoryOwner: "hybrid", paymentProvider: "Teplohod gateway", amount: 31000, ticketsCount: 2, status: "completed", paymentStatus: "paid", hasRefundRequest: false, visibleInBuyerAccount: true, visibleInSupplierCabinet: true, createdAt: "2025-04-19T20:00:00Z" },
  { id: "ORD-1037", buyer: "Сания Нурланова", buyerEmail: "s.nurlanova@test.kz", buyerLinked: true, event: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", channel: "ticketon_mirror", inventoryOwner: "imported", paymentProvider: "Ticketon", amount: 15500, ticketsCount: 1, status: "cancelled", paymentStatus: "refunded", hasRefundRequest: false, visibleInBuyerAccount: true, visibleInSupplierCabinet: true, createdAt: "2025-04-19T18:30:00Z" },
  { id: "ORD-1036", buyer: "Арман Дюсенов", buyerEmail: "arman@gmail.com", buyerLinked: true, event: "Детский фестиваль", supplier: "KidsFest LLP", channel: "internal_checkout", inventoryOwner: "manual", paymentProvider: "СБП", amount: 6000, ticketsCount: 2, status: "completed", paymentStatus: "paid", hasRefundRequest: false, visibleInBuyerAccount: true, visibleInSupplierCabinet: true, createdAt: "2025-04-18T09:15:00Z" },
];

export default function OrdersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockOrders.filter((o) => {
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.event.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchChannel = channelFilter === "all" || o.channel === channelFilter;
    return matchSearch && matchStatus && matchChannel;
  });

  const columns: Column<Order>[] = [
    { key: "id", header: "ID", cell: (r) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
        {r.hasRefundRequest && (
          <span className="inline-flex items-center gap-1 text-[10px] text-yellow-700 dark:text-yellow-400">
            <AlertTriangle className="w-3 h-3" /> refund req
          </span>
        )}
      </div>
    )},
    { key: "buyer", header: "Покупатель", cell: (r) => (
      <div>
        <div className="flex items-center gap-1">
          <p className="font-medium text-sm">{r.buyer}</p>
          {r.buyerLinked ? (
            <UserCheck className="w-3 h-3 text-green-600" />
          ) : (
            <UserX className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">{r.buyerEmail}</p>
      </div>
    )},
    { key: "event", header: "Событие", cell: (r) => (
      <div className="flex flex-col">
        <span className="text-sm">{r.event}</span>
        <span className="text-xs text-muted-foreground">{r.supplier}</span>
      </div>
    )},
    { key: "channel", header: "Канал", cell: (r) => (
      <div className="flex flex-col gap-1">
        <span className="text-xs">{channelLabels[r.channel]}</span>
        <SourceBadge source={r.inventoryOwner} />
      </div>
    )},
    { key: "provider", header: "Провайдер оплаты", cell: (r) => (
      <span className="text-xs text-muted-foreground">{r.paymentProvider}</span>
    )},
    { key: "amount", header: "Сумма", cell: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{formatCurrency(r.amount)}</span>
        <span className="text-xs text-muted-foreground">{r.ticketsCount} бил.</span>
      </div>
    )},
    { key: "visibility", header: "Видимость", cell: (r) => (
      <div className="flex flex-col gap-0.5 text-[10px]">
        <span className={r.visibleInBuyerAccount ? "text-green-600" : "text-muted-foreground"}>
          {r.visibleInBuyerAccount ? "✓" : "—"} ЛК покупателя
        </span>
        <span className={r.visibleInSupplierCabinet ? "text-green-600" : "text-muted-foreground"}>
          {r.visibleInSupplierCabinet ? "✓" : "—"} ЛК поставщика
        </span>
      </div>
    )},
    { key: "status", header: "Статус", cell: (r) => (
      <div className="flex flex-col gap-1">
        <StatusBadge status={r.status} />
        <StatusBadge status={r.paymentStatus} />
      </div>
    )},
    { key: "date", header: "Дата", cell: (r) => formatDateTime(r.createdAt) },
  ];

  return (
    <AdminLayout
      title="Заказы"
      breadcrumbs={[{ label: "Администратор" }, { label: "Заказы" }]}
    >
      <PageHeader
        title="Заказы"
        description={`${mockOrders.length} заказов — единая проекция всех каналов продаж`}
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
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44" data-testid="select-order-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="completed">Завершены</SelectItem>
                <SelectItem value="cancelled">Отменены</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-48" data-testid="select-order-channel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все каналы</SelectItem>
                <SelectItem value="internal_checkout">Internal checkout</SelectItem>
                <SelectItem value="ticketscloud_mirror">Ticketscloud mirror</SelectItem>
                <SelectItem value="teplohod_api">Teplohod API</SelectItem>
                <SelectItem value="ticketon_mirror">Ticketon mirror</SelectItem>
              </SelectContent>
            </Select>
          </>
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
