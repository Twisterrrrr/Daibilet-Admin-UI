import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CalendarDays, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";

const recentOrders = [
  { id: "ORD-1041", buyer: "Алия Бекова", event: "Ночь музыки 2025", amount: 18000, status: "paid", createdAt: "2025-04-20T14:22:00Z" },
  { id: "ORD-1040", buyer: "Данияр Сейткали", event: "Ночь музыки 2025", amount: 9000, status: "paid", createdAt: "2025-04-20T13:10:00Z" },
  { id: "ORD-1039", buyer: "Мария Петрова", event: "Рок-фестиваль RockZone", amount: 24000, status: "paid", createdAt: "2025-04-19T20:00:00Z" },
];

interface OrderRow { id: string; buyer: string; event: string; amount: number; status: string; createdAt: string; }
const orderColumns: Column<OrderRow>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
  { key: "buyer", header: "Покупатель", cell: (r) => r.buyer },
  { key: "event", header: "Событие", cell: (r) => r.event },
  { key: "amount", header: "Сумма", cell: (r) => formatCurrency(r.amount) },
  { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  { key: "date", header: "Дата", cell: (r) => formatDateTime(r.createdAt) },
];

export default function SupplierDashboard() {
  return (
    <SupplierLayout
      title="Дашборд поставщика"
      breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Дашборд" }]}
    >
      <PageHeader
        title="Добро пожаловать, АртПро Концерты"
        description="Обзор вашей активности за последние 30 дней"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Активных событий" value="2" icon={CalendarDays} data-testid="supplier-stat-events" />
        <StatCard label="Заказов за 30 дней" value="48" icon={ShoppingCart} trend={{ value: "12%", positive: true }} data-testid="supplier-stat-orders" />
        <StatCard label="Выручка (30 дней)" value={formatCurrency(432000)} icon={TrendingUp} trend={{ value: "8%", positive: true }} data-testid="supplier-stat-revenue" />
        <StatCard label="Запросов на возврат" value="1" icon={AlertCircle} data-testid="supplier-stat-refunds" />
      </div>

      <div className="bg-card border border-card-border rounded-lg mb-6">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Последние заказы</h3>
        </div>
        <DataTable
          columns={orderColumns}
          data={recentOrders}
          emptyMessage="Нет заказов"
          data-testid="supplier-table-recent-orders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Ближайшие события</h3>
          <div className="flex flex-col gap-3">
            {[
              { title: "Ночь музыки 2025", date: "15 мая 2025", sold: 412, cap: 800 },
              { title: "Рок-фестиваль RockZone", date: "1 авг 2025", sold: 0, cap: 3000 },
            ].map((e) => (
              <div key={e.title} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{e.sold} / {e.cap}</p>
                  <p className="text-xs text-muted-foreground">билетов</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Уведомления</h3>
          <div className="flex flex-col gap-3">
            {[
              { text: "Запрос на возврат REF-22 ожидает обработки", type: "warning", time: "2 ч назад" },
              { text: "Событие «Ночь музыки 2025» одобрено модерацией", type: "success", time: "3 дн назад" },
              { text: "Ваш профиль верифицирован", type: "info", time: "1 нед назад" },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.type === "warning" ? "bg-yellow-500" : n.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                <div className="flex-1">
                  <p className="text-xs text-foreground">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
