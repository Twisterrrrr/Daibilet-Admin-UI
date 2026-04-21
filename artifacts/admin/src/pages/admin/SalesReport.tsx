import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

type Pivot = "event" | "city" | "supplier" | "category" | "date";

const data: Record<Pivot, { name: string; orders: number; tickets: number; gross: number; avgCheck: number; delta: number }[]> = {
  event: [
    { name: "Ночь музыки 2025",   orders: 412, tickets: 1238, gross: 18_570_000, avgCheck: 15008, delta: 18.4 },
    { name: "Forum на Arena",      orders: 128, tickets: 256,  gross: 8_192_000,  avgCheck: 32000, delta: 12.1 },
    { name: "Astana Jazz",         orders: 84,  tickets: 168,  gross: 3_360_000,  avgCheck: 20000, delta: -4.8 },
    { name: "Stand Up Night",      orders: 211, tickets: 422,  gross: 2_532_000,  avgCheck: 6000,  delta: 5.6 },
    { name: "Almaty Theatre Week", orders: 88,  tickets: 176,  gross: 2_112_000,  avgCheck: 12000, delta: 22.3 },
    { name: "Детский фестиваль",   orders: 34,  tickets: 102,  gross: 510_000,    avgCheck: 5000,  delta: -12.0 },
  ],
  city: [
    { name: "Алматы", orders: 612, tickets: 1768, gross: 22_410_000, avgCheck: 12679, delta: 14.2 },
    { name: "Астана", orders: 248, tickets: 528,  gross: 11_600_000, avgCheck: 21976, delta: 9.7 },
    { name: "Шымкент", orders: 84, tickets: 168,  gross: 1_344_000,  avgCheck: 8000,  delta: 3.2 },
  ],
  supplier: [
    { name: "ArtPro Kazakhstan", orders: 432, tickets: 1284, gross: 18_980_000, avgCheck: 14778, delta: 16.0 },
    { name: "Star Events",        orders: 168, tickets: 336,  gross: 10_640_000, avgCheck: 31666, delta: 11.2 },
    { name: "JazzMedia",          orders: 84,  tickets: 168,  gross: 3_360_000,  avgCheck: 20000, delta: -4.0 },
    { name: "Comedy House",       orders: 211, tickets: 422,  gross: 2_532_000,  avgCheck: 6000,  delta: 5.6 },
  ],
  category: [
    { name: "Концерты",  orders: 540, tickets: 1494, gross: 21_930_000, avgCheck: 14685, delta: 14.0 },
    { name: "Театр",      orders: 152, tickets: 320,  gross: 4_416_000,  avgCheck: 13800, delta: 8.4 },
    { name: "Stand Up",   orders: 211, tickets: 422,  gross: 2_532_000,  avgCheck: 6000,  delta: 5.6 },
    { name: "Дети",       orders: 34,  tickets: 102,  gross: 510_000,    avgCheck: 5000,  delta: -12.0 },
  ],
  date: [
    { name: "01—07 апр", orders: 188, tickets: 451, gross: 6_780_000,  avgCheck: 15035, delta: 4.1 },
    { name: "08—14 апр", orders: 244, tickets: 588, gross: 8_840_000,  avgCheck: 15030, delta: 9.2 },
    { name: "15—21 апр", orders: 312, tickets: 768, gross: 11_410_000, avgCheck: 14856, delta: 14.7 },
  ],
};

const pivotLabel: Record<Pivot, string> = {
  event: "Событие", city: "Город", supplier: "Поставщик", category: "Категория", date: "Период (неделя)",
};

export default function SalesReport() {
  const [pivot, setPivot] = useState<Pivot>("event");
  const [period, setPeriod] = useState("30d");
  const rows = data[pivot];
  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  const totalOrders = rows.reduce((s, r) => s + r.orders, 0);
  const totalTickets = rows.reduce((s, r) => s + r.tickets, 0);

  return (
    <AdminLayout title="Отчёт по продажам" breadcrumbs={[
      { label: "Администратор" }, { label: "Отчёты", href: "/admin/reports" }, { label: "Продажи" },
    ]}>
      <PageHeader
        title="Отчёт по продажам"
        description={`${formatNumber(totalOrders)} заказов · ${formatNumber(totalTickets)} билетов · оборот ${formatCurrency(totalGross)}`}
        actions={<Button variant="outline" size="sm" data-testid="button-export-sales"><Download className="w-4 h-4 mr-1.5" /> Экспорт CSV</Button>}
      />

      <div className="flex gap-2 mb-4">
        <Select value={pivot} onValueChange={(v) => setPivot(v as Pivot)}>
          <SelectTrigger className="w-44" data-testid="select-sales-pivot"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="event">По событиям</SelectItem>
            <SelectItem value="city">По городам</SelectItem>
            <SelectItem value="supplier">По поставщикам</SelectItem>
            <SelectItem value="category">По категориям</SelectItem>
            <SelectItem value="date">По неделям</SelectItem>
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40" data-testid="select-sales-period"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 дней</SelectItem>
            <SelectItem value="30d">30 дней</SelectItem>
            <SelectItem value="quarter">Квартал</SelectItem>
            <SelectItem value="ytd">С начала года</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2 font-medium">{pivotLabel[pivot]}</th>
              <th className="text-right px-4 py-2 font-medium">Заказов</th>
              <th className="text-right px-4 py-2 font-medium">Билетов</th>
              <th className="text-right px-4 py-2 font-medium">Оборот (gross)</th>
              <th className="text-right px-4 py-2 font-medium">Средний чек</th>
              <th className="text-right px-4 py-2 font-medium">Δ к пред. периоду</th>
              <th className="text-right px-4 py-2 font-medium">Доля</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const share = (r.gross / totalGross) * 100;
              const positive = r.delta >= 0;
              return (
                <tr key={r.name} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-2 font-medium">{r.name}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatNumber(r.orders)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatNumber(r.tickets)}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(r.gross)}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">{formatCurrency(r.avgCheck)}</td>
                  <td className={`px-4 py-2 text-right text-xs font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
                    <span className="inline-flex items-center gap-0.5">
                      {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(r.delta).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${share}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">{share.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td className="px-4 py-2 font-semibold">Итого</td>
              <td className="px-4 py-2 text-right tabular-nums font-semibold">{formatNumber(totalOrders)}</td>
              <td className="px-4 py-2 text-right tabular-nums font-semibold">{formatNumber(totalTickets)}</td>
              <td className="px-4 py-2 text-right tabular-nums font-semibold">{formatCurrency(totalGross)}</td>
              <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(Math.round(totalGross / totalOrders))}</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2 text-right text-xs text-muted-foreground">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AdminLayout>
  );
}
