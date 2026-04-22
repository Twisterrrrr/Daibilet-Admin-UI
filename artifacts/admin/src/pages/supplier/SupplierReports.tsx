import { useState } from "react";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Tabs } from "@/components/shared/Tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Ticket, Users, BarChart2, Download, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const summary = {
  gross: 1_240_000, deltaGross: 14.2,
  tickets: 312, deltaTickets: 9.1,
  orders: 156, deltaOrders: 11.4,
  avgCheck: 7948, deltaAvg: 2.6,
};

const eventsBreakdown = [
  { id: "EVT-002", name: "Forum на Arena",      orders: 88, tickets: 176, gross: 880_000, fillRate: 78 },
  { id: "EVT-007", name: "Moscow Theatre Week", orders: 41, tickets: 82,  gross: 246_000, fillRate: 58 },
  { id: "EVT-014", name: "Spring Showcase",     orders: 27, tickets: 54,  gross: 114_000, fillRate: 42 },
];

const dailyTrend = [
  { day: "01.04", orders: 4 }, { day: "04.04", orders: 8 }, { day: "07.04", orders: 12 },
  { day: "10.04", orders: 14 }, { day: "13.04", orders: 18 }, { day: "16.04", orders: 22 },
  { day: "19.04", orders: 28 }, { day: "21.04", orders: 24 },
];

const maxOrders = Math.max(...dailyTrend.map((d) => d.orders));

export default function SupplierReports() {
  const [tab, setTab] = useState("overview");
  const [period, setPeriod] = useState("30d");

  return (
    <SupplierLayout title="Отчёты" breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Отчёты" }]}>
      <PageHeader
        title="Отчёты и аналитика"
        description="Статистика по вашим событиям и продажам"
        actions={
          <>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40" data-testid="select-supplier-report-period"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 дней</SelectItem>
                <SelectItem value="30d">30 дней</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="ytd">С начала года</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" data-testid="button-export-supplier-report"><Download className="w-4 h-4 mr-1.5" /> Экспорт</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Оборот" value={formatCurrency(summary.gross)} delta={summary.deltaGross} icon={TrendingUp} />
        <KpiCard label="Билетов продано" value={formatNumber(summary.tickets)} delta={summary.deltaTickets} icon={Ticket} />
        <KpiCard label="Заказов" value={formatNumber(summary.orders)} delta={summary.deltaOrders} icon={Users} />
        <KpiCard label="Средний чек" value={formatCurrency(summary.avgCheck)} delta={summary.deltaAvg} icon={BarChart2} />
      </div>

      <Tabs
        items={[
          { key: "overview", label: "Обзор" },
          { key: "events", label: "По событиям", count: eventsBreakdown.length },
          { key: "trend", label: "Динамика" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Топ-3 события по обороту</h3>
            <div className="flex flex-col gap-3">
              {eventsBreakdown.slice(0, 3).map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.orders} заказов · {e.tickets} билетов</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{formatCurrency(e.gross)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Заполняемость залов</h3>
            <div className="flex flex-col gap-3">
              {eventsBreakdown.map((e) => (
                <div key={e.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{e.name}</span>
                    <span className="text-xs tabular-nums">{e.fillRate}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${e.fillRate >= 70 ? "bg-emerald-500" : e.fillRate >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${e.fillRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "events" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Событие</th>
                <th className="text-right px-4 py-2 font-medium">Заказов</th>
                <th className="text-right px-4 py-2 font-medium">Билетов</th>
                <th className="text-right px-4 py-2 font-medium">Оборот</th>
                <th className="text-right px-4 py-2 font-medium">Заполнение</th>
              </tr>
            </thead>
            <tbody>
              {eventsBreakdown.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-4 py-2"><span className="font-medium">{e.name}</span><span className="block text-xs text-muted-foreground font-mono">{e.id}</span></td>
                  <td className="px-4 py-2 text-right tabular-nums">{e.orders}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{e.tickets}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(e.gross)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{e.fillRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "trend" && (
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Динамика заказов по дням</h3>
          <div className="flex items-end gap-2 h-44">
            {dailyTrend.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/80 rounded-t" style={{ height: `${(d.orders / maxOrders) * 100}%` }} title={`${d.day}: ${d.orders}`} />
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SupplierLayout>
  );
}

function KpiCard({ label, value, delta, icon: Icon }: { label: string; value: string; delta: number; icon: typeof TrendingUp }) {
  const positive = delta >= 0;
  return (
    <div className="bg-card border border-card-border rounded-lg p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <div className="flex items-center gap-1 mt-1 text-xs">
        <span className={`inline-flex items-center gap-0.5 font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">vs пред. период</span>
      </div>
    </div>
  );
}
