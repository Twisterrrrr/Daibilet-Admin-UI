import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SourceBadge, SalesModeBadge } from "@/components/shared/SourceBadge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const sourceData = [
  { source: "manual" as const,   events: 18, orders: 540, gross: 9_720_000, fee: 972_000, share: 16 },
  { source: "imported" as const, events: 42, orders: 1_280, gross: 38_400_000, fee: 1_152_000, share: 64 },
  { source: "api" as const,      events: 12, orders: 320, gross: 9_600_000, fee: 288_000, share: 16 },
  { source: "hybrid" as const,   events: 4,  orders: 86,  gross: 2_580_000, fee: 206_400, share: 4 },
];

const salesModeData = [
  { mode: "internal_checkout" as const, orders: 1_540, gross: 38_420_000, fee: 3_842_000, share: 64 },
  { mode: "external_redirect" as const, orders: 480,   gross: 12_180_000, fee: 365_400,   share: 20 },
  { mode: "mirror" as const,             orders: 200,   gross: 7_400_000,  fee: 222_000,   share: 12 },
  { mode: "hybrid" as const,             orders: 86,    gross: 2_300_000,  fee: 184_000,   share: 4 },
];

const totalGross = sourceData.reduce((s, x) => s + x.gross, 0);

export default function ChannelReport() {
  return (
    <AdminLayout title="Источники и каналы" breadcrumbs={[
      { label: "Администратор" }, { label: "Отчёты", href: "/admin/reports" }, { label: "Источники и каналы" },
    ]}>
      <PageHeader
        title="Отчёт по источникам и каналам"
        description={`Распределение оборота ${formatCurrency(totalGross)} по inventorySource и salesMode`}
        actions={<Button variant="outline" size="sm" data-testid="button-export-channels"><Download className="w-4 h-4 mr-1.5" /> Экспорт</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section
          title="Inventory source"
          description="Откуда у нас событие: создано вручную, импортировано mirror'ом, через партнёрский API или гибрид"
        >
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Источник</th>
                <th className="text-right px-4 py-2 font-medium">Событий</th>
                <th className="text-right px-4 py-2 font-medium">Заказов</th>
                <th className="text-right px-4 py-2 font-medium">Оборот</th>
                <th className="text-right px-4 py-2 font-medium">Доля</th>
              </tr>
            </thead>
            <tbody>
              {sourceData.map((r) => (
                <tr key={r.source} className="border-t border-border">
                  <td className="px-4 py-2"><SourceBadge source={r.source} /></td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatNumber(r.events)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatNumber(r.orders)}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(r.gross)}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${r.share}%` }} />
                      </div>
                      <span className="text-xs tabular-nums w-9 text-right">{r.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section
          title="Sales mode"
          description="Где совершается покупка: наш checkout, редирект на сайт партнёра, mirror или гибрид"
        >
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Режим</th>
                <th className="text-right px-4 py-2 font-medium">Заказов</th>
                <th className="text-right px-4 py-2 font-medium">Оборот</th>
                <th className="text-right px-4 py-2 font-medium">Комиссия</th>
                <th className="text-right px-4 py-2 font-medium">Доля</th>
              </tr>
            </thead>
            <tbody>
              {salesModeData.map((r) => (
                <tr key={r.mode} className="border-t border-border">
                  <td className="px-4 py-2"><SalesModeBadge mode={r.mode} /></td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatNumber(r.orders)}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(r.gross)}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">{formatCurrency(r.fee)}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${r.share}%` }} />
                      </div>
                      <span className="text-xs tabular-nums w-9 text-right">{r.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-6">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          <strong>Важно:</strong> для <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">mirror</code> и <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">external_redirect</code> наш чек = только агентская комиссия,
          оборот идёт через партнёра. Для <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">internal_checkout</code> — мы держим деньги до выплаты поставщику.
        </p>
      </div>
    </AdminLayout>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}
