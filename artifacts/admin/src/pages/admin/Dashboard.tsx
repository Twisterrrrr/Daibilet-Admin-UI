import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  CalendarDays,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";

const mockRecentOrders = [
  { id: "ORD-1041", buyer: "Алия Бекова", event: "Ночь музыки 2025", amount: 18000, status: "paid", createdAt: "2025-04-20T14:22:00Z" },
  { id: "ORD-1040", buyer: "Данияр Сейткали", event: "Forum на Arena", amount: 42500, status: "processing", createdAt: "2025-04-20T13:10:00Z" },
  { id: "ORD-1039", buyer: "Мария Петрова", event: "Stand Up Night", amount: 9000, status: "refunded", createdAt: "2025-04-20T11:45:00Z" },
  { id: "ORD-1038", buyer: "Темирлан Жумабаев", event: "Saint Petersburg Jazz", amount: 31000, status: "paid", createdAt: "2025-04-19T20:00:00Z" },
  { id: "ORD-1037", buyer: "Сания Нурланова", event: "Ночь музыки 2025", amount: 15500, status: "cancelled", createdAt: "2025-04-19T18:30:00Z" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Дашборд"
      breadcrumbs={[{ label: "Администратор" }, { label: "Дашборд" }]}
    >
      <PageHeader
        title="Обзор платформы"
        description="Сводка ключевых метрик за последние 30 дней"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Всего заказов"
          value="3 241"
          icon={ShoppingCart}
          trend={{ value: "12%", positive: true }}
          data-testid="stat-orders"
        />
        <StatCard
          label="Активные события"
          value="87"
          icon={CalendarDays}
          trend={{ value: "4%", positive: true }}
          data-testid="stat-events"
        />
        <StatCard
          label="Поставщики"
          value="34"
          icon={Users}
          trend={{ value: "2", positive: true }}
          data-testid="stat-suppliers"
        />
        <StatCard
          label="Выручка (30 дней)"
          value={formatCurrency(14_820_000)}
          icon={TrendingUp}
          trend={{ value: "8.3%", positive: true }}
          data-testid="stat-revenue"
        />
      </div>

      <div className="bg-card border border-card-border rounded-lg mb-6">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Последние заказы</h3>
        </div>
        <DataTable
          data={mockRecentOrders}
          columns={[
            { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
            { key: "buyer", header: "Покупатель", cell: (r) => r.buyer },
            { key: "event", header: "Событие", cell: (r) => r.event },
            { key: "amount", header: "Сумма", cell: (r) => formatCurrency(r.amount) },
            { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
            { key: "date", header: "Дата", cell: (r) => formatDateTime(r.createdAt) },
          ]}
          data-testid="table-recent-orders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Статусы событий</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "Опубликованы", count: 54, pct: 62 },
              { label: "Черновики", count: 21, pct: 24 },
              { label: "Отменены", count: 12, pct: 14 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Топ городов</h3>
          <div className="flex flex-col gap-2">
            {[
              { city: "Москва", orders: 1842 },
              { city: "Санкт-Петербург", orders: 1109 },
              { city: "Казань", orders: 290 },
            ].map((item, i) => (
              <div key={item.city} className="flex items-center gap-3">
                <span className="w-5 text-xs text-muted-foreground font-medium">{i + 1}.</span>
                <span className="flex-1 text-sm">{item.city}</span>
                <span className="text-sm font-medium text-foreground">{item.orders.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Запросы на возврат</h3>
          <div className="flex flex-col gap-3">
            {[
              { id: "REF-22", buyer: "К. Аримова", amount: 15000, status: "pending" },
              { id: "REF-21", buyer: "Д. Ахметов", amount: 9500, status: "pending" },
              { id: "REF-20", buyer: "А. Смирнова", amount: 42000, status: "approved" },
            ].map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium">{r.buyer}</p>
                  <p className="text-xs text-muted-foreground">{r.id} · {formatCurrency(r.amount)}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
