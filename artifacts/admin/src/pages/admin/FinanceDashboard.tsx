import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Wallet, CircleDollarSign, Receipt, TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const channelBreakdown = [
  { channel: "Internal checkout", gross: 38_420_000, share: 64, fee: 3_842_000 },
  { channel: "External redirect", gross: 12_180_000, share: 20, fee: 365_400 },
  { channel: "Mirror (Ticketon)",  gross: 7_400_000,  share: 12, fee: 222_000 },
  { channel: "Hybrid",             gross: 2_300_000,  share: 4,  fee: 184_000 },
];

const providerSummary = [
  { provider: "Kaspi Pay",  volume: 28_900_000, success: 98.4, fee: 868_000 },
  { provider: "Halyk",      volume: 14_200_000, success: 97.1, fee: 426_000 },
  { provider: "Wooppay",    volume: 9_800_000,  success: 95.6, fee: 392_000 },
  { provider: "ForteBank",  volume: 7_400_000,  success: 96.8, fee: 222_000 },
];

const recentAlerts = [
  { id: 1, severity: "critical", text: "Расхождение со сверкой Kaspi за 19.04 — 142 000 ₸", href: "/admin/finance/reconciliation" },
  { id: 2, severity: "warning",  text: "3 выплаты ожидают подтверждения свыше 48 часов", href: "/admin/finance/payouts" },
  { id: 3, severity: "info",     text: "Выплата SUP-02 (Star Events) запланирована на завтра", href: "/admin/finance/payouts" },
];

export default function FinanceDashboard() {
  const [period, setPeriod] = useState("30d");

  return (
    <AdminLayout title="Финансы" breadcrumbs={[{ label: "Администратор" }, { label: "Финансы" }]}>
      <PageHeader
        title="Финансовый дашборд"
        description="Сводка по обороту, комиссиям и выплатам"
        actions={
          <>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40" data-testid="select-finance-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="7d">7 дней</SelectItem>
                <SelectItem value="30d">30 дней</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="ytd">С начала года</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" data-testid="button-export-finance">Экспорт</Button>
          </>
        }
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="GMV (оборот)" amount={60_300_000} delta={12.4} subtitle="vs предыдущий период" icon={CircleDollarSign} />
        <KpiCard label="Выручка платформы" amount={4_613_400} delta={9.8} subtitle="комиссии + сборы" icon={TrendingUp} />
        <KpiCard label="К выплате поставщикам" amount={51_280_600} delta={11.6} subtitle="net после комиссий" icon={Wallet} variant="muted" />
        <KpiCard label="Возвраты" amount={1_842_000} delta={-3.2} subtitle="3.05% от GMV" icon={Receipt} variant="negative" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <QuickLink href="/admin/finance/transactions" title="Транзакции" desc="Платежи и возвраты" />
        <QuickLink href="/admin/finance/payouts" title="Выплаты поставщикам" desc="Очередь и история" badge="3 в обработке" />
        <QuickLink href="/admin/finance/reconciliation" title="Сверки" desc="С платёжными провайдерами" badge="1 расхождение" badgeVariant="critical" />
        <QuickLink href="/admin/reports" title="Отчёты" desc="Аналитика и экспорты" />
      </div>

      {/* Channel breakdown */}
      <div className="bg-card border border-card-border rounded-lg mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Оборот по каналам продаж</h3>
          <Link href="/admin/reports/channels"><span className="text-xs text-primary hover:underline cursor-pointer">Подробнее →</span></Link>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {channelBreakdown.map((c) => (
            <div key={c.channel} className="flex items-center gap-4">
              <div className="w-44 shrink-0 text-sm">{c.channel}</div>
              <div className="flex-1 min-w-0">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${c.share}%` }} />
                </div>
              </div>
              <div className="w-28 text-right text-sm tabular-nums">{formatCurrency(c.gross)}</div>
              <div className="w-12 text-right text-xs text-muted-foreground">{c.share}%</div>
              <div className="w-32 text-right text-xs text-muted-foreground">
                комиссия <span className="text-foreground">{formatCurrency(c.fee)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Providers + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Платёжные провайдеры</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/50">
                <tr>
                  <th className="text-left px-5 py-2 font-medium">Провайдер</th>
                  <th className="text-right px-5 py-2 font-medium">Объём</th>
                  <th className="text-right px-5 py-2 font-medium">Success rate</th>
                  <th className="text-right px-5 py-2 font-medium">Комиссия провайдера</th>
                </tr>
              </thead>
              <tbody>
                {providerSummary.map((p) => (
                  <tr key={p.provider} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">{p.provider}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatCurrency(p.volume)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      <span className={p.success >= 97 ? "text-emerald-600" : "text-amber-600"}>
                        {p.success.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{formatCurrency(p.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Финансовые алерты</h3>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {recentAlerts.map((a) => (
              <Link key={a.id} href={a.href}>
                <div className={`flex items-start gap-2 p-2 rounded-md cursor-pointer hover:bg-accent/40 ${
                  a.severity === "critical" ? "border-l-2 border-red-500" :
                  a.severity === "warning" ? "border-l-2 border-amber-500" : "border-l-2 border-blue-500"
                }`}>
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                    a.severity === "critical" ? "text-red-500" :
                    a.severity === "warning" ? "text-amber-500" : "text-blue-500"
                  }`} />
                  <span className="text-sm">{a.text}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function KpiCard({ label, amount, delta, subtitle, icon: Icon, variant = "default" }: {
  label: string; amount: number; delta: number; subtitle: string;
  icon: typeof Wallet; variant?: "default" | "muted" | "negative";
}) {
  const isPositive = delta >= 0;
  return (
    <div className="bg-card border border-card-border rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <MoneyAmount amount={amount} size="xl" variant={variant === "negative" ? "negative" : "default"} />
      <div className="flex items-center gap-1.5 mt-2 text-xs">
        <span className={`inline-flex items-center gap-0.5 font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  );
}

function QuickLink({ href, title, desc, badge, badgeVariant }: {
  href: string; title: string; desc: string; badge?: string; badgeVariant?: "default" | "critical";
}) {
  return (
    <Link href={href}>
      <div className="bg-card border border-card-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
        <div className="flex items-start justify-between mb-1">
          <p className="font-medium text-sm">{title}</p>
          {badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              badgeVariant === "critical" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            }`}>{badge}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
