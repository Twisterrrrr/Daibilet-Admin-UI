import { useState } from "react";
import { useLocation } from "wouter";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { PayoutStatusBadge, type PayoutStatus } from "@/components/shared/PayoutStatusBadge";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Wallet, Download, FileText, Info, CalendarClock } from "lucide-react";

const balance = {
  available: 0,
  pending: 842_100,
  nextPayoutDate: "2026-04-22T18:00:00Z",
  totalEarnedYTD: 8_420_000,
};

const breakdown = {
  gross: 880_000,
  fee: 26_400,
  refunds: 11_500,
  net: 842_100,
};

interface PayoutRow {
  id: string;
  period: string;
  status: PayoutStatus;
  net: number;
  scheduledAt: string;
  paidAt?: string;
}

const payouts: PayoutRow[] = [
  { id: "PO-2026-04-19-002", period: "01.04 — 15.04.2026", status: "processing", net: 842_100, scheduledAt: "2026-04-21T18:00:00Z" },
  { id: "PO-2026-04-04-002", period: "16.03 — 31.03.2026", status: "paid",       net: 1_140_000, scheduledAt: "2026-04-04T18:00:00Z", paidAt: "2026-04-04T18:21:00Z" },
  { id: "PO-2026-03-19-002", period: "01.03 — 15.03.2026", status: "paid",       net: 980_000,   scheduledAt: "2026-03-19T18:00:00Z", paidAt: "2026-03-19T19:02:00Z" },
  { id: "PO-2026-03-04-002", period: "16.02 — 28.02.2026", status: "paid",       net: 1_220_000, scheduledAt: "2026-03-04T18:00:00Z", paidAt: "2026-03-04T18:33:00Z" },
];

const feeStructure = [
  { tier: "Internal checkout", fee: "10% от стоимости билета", apply: "Билет продан через сайт Daibilet" },
  { tier: "External redirect", fee: "3% (агентская комиссия)", apply: "Покупатель ушёл на сайт партнёра" },
  { tier: "Refund handling fee", fee: "0 ₸ (для активных)",     apply: "Если возврат был инициирован покупателем" },
];

export default function SupplierFinance() {
  const [tab, setTab] = useState("overview");
  const [, setLocation] = useLocation();

  return (
    <SupplierLayout title="Финансы" breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Финансы" }]}>
      <PageHeader
        title="Финансы"
        description="Баланс, ожидающие выплаты и история актов"
        actions={
          <Button variant="outline" size="sm" data-testid="button-download-statement">
            <Download className="w-4 h-4 mr-1.5" /> Скачать выписку
          </Button>
        }
      />

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          Выплаты выполняются 2 раза в месяц (15-го и 30-го). Деньги идут на ваш расчётный счёт, указанный в профиле компании.
        </AlertDescription>
      </Alert>

      {/* Balance overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <BalanceCard label="К выплате" amount={balance.pending} icon={Wallet} variant="primary"
          subtitle={`следующая выплата ${formatDate(balance.nextPayoutDate)}`} />
        <BalanceCard label="Доступно сейчас" amount={balance.available} icon={CalendarClock}
          subtitle="накопится к ближайшей выплате" />
        <BalanceCard label="Заработано за год" amount={balance.totalEarnedYTD} icon={FileText}
          subtitle="с начала 2026" />
        <div className="bg-card border border-card-border rounded-lg p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Текущий период</p>
          <p className="text-sm font-semibold mb-1">01.04 — 15.04.2026</p>
          <p className="text-xs text-muted-foreground">формируется акт</p>
          <div className="mt-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
            41 заказ за период
          </div>
        </div>
      </div>

      <Tabs
        items={[
          { key: "overview", label: "Обзор" },
          { key: "history", label: "История выплат", count: payouts.length },
          { key: "fees", label: "Комиссии" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Расчёт ближайшей выплаты</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Row label="Оборот за период (gross)" value={formatCurrency(breakdown.gross)} />
            <Row label="Минус комиссия платформы" value={`−${formatCurrency(breakdown.fee)}`} variant="muted" />
            <Row label="Минус возвраты" value={`−${formatCurrency(breakdown.refunds)}`} variant="muted" />
            <div className="border-t border-border my-2" />
            <Row label="К выплате (net)" value={formatCurrency(breakdown.net)} variant="primary" />
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">ID акта</th>
                <th className="text-left px-4 py-2 font-medium">Период</th>
                <th className="text-left px-4 py-2 font-medium">Статус</th>
                <th className="text-right px-4 py-2 font-medium">Сумма</th>
                <th className="text-left px-4 py-2 font-medium">Дата выплаты</th>
                <th className="text-right px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-2 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-2">{p.period}</td>
                  <td className="px-4 py-2"><PayoutStatusBadge status={p.status} /></td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(p.net)}</td>
                  <td className="px-4 py-2 text-xs">
                    {p.paidAt ? (
                      <span className="text-emerald-600">{formatDate(p.paidAt)}</span>
                    ) : (
                      <span className="text-muted-foreground">план: {formatDate(p.scheduledAt)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button variant="outline" size="sm" data-testid={`button-download-${p.id}`}>
                      <Download className="w-3.5 h-3.5 mr-1" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "fees" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Структура комиссии</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Действует с 01.01.2026 · согласно вашему договору</p>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Канал / Условие</th>
                <th className="text-left px-4 py-2 font-medium">Размер комиссии</th>
                <th className="text-left px-4 py-2 font-medium">Когда применяется</th>
              </tr>
            </thead>
            <tbody>
              {feeStructure.map((f) => (
                <tr key={f.tier} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{f.tier}</td>
                  <td className="px-4 py-2">{f.fee}</td>
                  <td className="px-4 py-2 text-muted-foreground">{f.apply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SupplierLayout>
  );
}

function BalanceCard({ label, amount, subtitle, icon: Icon, variant = "default" }: {
  label: string; amount: number; subtitle: string; icon: typeof Wallet; variant?: "default" | "primary";
}) {
  return (
    <div className={`rounded-lg border p-5 ${variant === "primary" ? "bg-primary/5 border-primary/30" : "bg-card border-card-border"}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <Icon className={`w-4 h-4 ${variant === "primary" ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <MoneyAmount amount={amount} size="lg" variant={variant === "primary" ? "default" : "default"} />
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function Row({ label, value, variant = "default" }: { label: string; value: string; variant?: "default" | "muted" | "primary" }) {
  return (
    <div className="flex items-center justify-between">
      <span className={variant === "muted" ? "text-muted-foreground" : variant === "primary" ? "font-semibold" : ""}>{label}</span>
      <span className={`tabular-nums ${variant === "primary" ? "text-lg font-semibold text-primary" : variant === "muted" ? "text-muted-foreground" : "font-medium"}`}>{value}</span>
    </div>
  );
}
