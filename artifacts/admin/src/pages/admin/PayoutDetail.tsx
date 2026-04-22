import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DetailField, DetailSection } from "@/components/shared/DetailField";
import { PayoutStatusBadge } from "@/components/shared/PayoutStatusBadge";
import { MoneyAmount } from "@/components/shared/MoneyAmount";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/shared/Tabs";
import { useState } from "react";
import { ArrowLeft, Download, CheckCircle2, XCircle, Send } from "lucide-react";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils";

const payout = {
  id: "PO-2026-04-19-002",
  supplier: "Стар Ивентс",
  supplierId: "SUP-02",
  period: "01.04 — 15.04.2026",
  status: "processing" as const,
  scheduledAt: "2026-04-21T18:00:00Z",
  paidAt: null as string | null,
  bankAccount: "40702 810 9 38000 012345 (Сбербанк)",
  iban: "KZ123456789012345678",
  bin: "180940004411",
  orders: [
    { id: "ORD-1040", date: "2026-04-19", event: "Forum на Arena", gross: 8500, fee: 255, net: 8245 },
    { id: "ORD-1031", date: "2026-04-15", event: "Forum на Arena", gross: 17000, fee: 510, net: 16490 },
    { id: "ORD-1024", date: "2026-04-12", event: "Moscow Theatre Week", gross: 25000, fee: 750, net: 24250 },
  ],
  refunds: [
    { id: "REF-441", date: "2026-04-14", order: "ORD-1018", amount: 11500, reason: "Отмена покупателем" },
  ],
  audit: [
    { at: "2026-04-21T18:02:00Z", who: "system", action: "Передан в банк (отправлено платёжное поручение)" },
    { at: "2026-04-21T18:00:00Z", who: "Зарина А.", action: "Подтверждено" },
    { at: "2026-04-19T22:00:00Z", who: "system", action: "Сформирован акт за период 01.04 — 15.04.2026" },
  ],
};

const totals = {
  ordersCount: payout.orders.length,
  gross: payout.orders.reduce((s, o) => s + o.gross, 0),
  fee: payout.orders.reduce((s, o) => s + o.fee, 0),
  refunds: payout.refunds.reduce((s, r) => s + r.amount, 0),
};
const net = totals.gross - totals.fee - totals.refunds;

export default function PayoutDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");

  return (
    <AdminLayout title={`Акт ${payout.id}`} breadcrumbs={[
      { label: "Администратор" },
      { label: "Финансы", href: "/admin/finance" },
      { label: "Выплаты", href: "/admin/finance/payouts" },
      { label: payout.id },
    ]}>
      <PageHeader
        title={`Акт выплаты ${payout.id}`}
        description={
          <span className="inline-flex items-center gap-2 flex-wrap">
            <PayoutStatusBadge status={payout.status} />
            <span className="text-sm text-muted-foreground">{payout.supplier}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{payout.period}</span>
          </span>
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/finance/payouts")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button variant="outline" size="sm" data-testid="button-download-act"><Download className="w-4 h-4 mr-1.5" /> Скачать PDF</Button>
            {payout.status === "processing" && (
              <Button size="sm" data-testid="button-mark-paid"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Отметить как выплачено</Button>
            )}
            {payout.status === "pending" && (
              <Button size="sm" data-testid="button-send-payout"><Send className="w-4 h-4 mr-1.5" /> Отправить в банк</Button>
            )}
            {(payout.status === "pending" || payout.status === "processing") && (
              <Button variant="outline" size="sm" className="text-red-600" data-testid="button-hold-payout"><XCircle className="w-4 h-4 mr-1.5" /> Заблокировать</Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <SummaryBlock label="Заказов" value={String(totals.ordersCount)} />
        <SummaryBlock label="Gross" value={formatCurrency(totals.gross)} />
        <SummaryBlock label="Комиссия + возвраты" value={`−${formatCurrency(totals.fee + totals.refunds)}`} variant="muted" />
        <SummaryBlock label="К выплате" value={formatCurrency(net)} variant="primary" />
      </div>

      <Tabs
        items={[
          { key: "overview", label: "Обзор" },
          { key: "orders", label: "Заказы", count: payout.orders.length },
          { key: "refunds", label: "Возвраты", count: payout.refunds.length },
          { key: "audit", label: "Аудит" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Реквизиты получателя">
            <DetailField label="Поставщик" value={payout.supplier} readOnly />
            <DetailField label="БИН" value={payout.bin} readOnly />
            <DetailField label="IBAN / счёт" value={payout.bankAccount} readOnly />
          </DetailSection>
          <DetailSection title="Параметры акта">
            <DetailField label="ID акта" value={payout.id} readOnly />
            <DetailField label="Период" value={payout.period} readOnly />
            <DetailField label="Статус" value={<PayoutStatusBadge status={payout.status} />} />
            <DetailField label="Запланировано" value={formatDateTime(payout.scheduledAt)} readOnly />
            <DetailField label="Выплачено" value={payout.paidAt ? formatDateTime(payout.paidAt) : "—"} readOnly />
          </DetailSection>
        </div>
      )}

      {tab === "orders" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Заказ</th>
                <th className="text-left px-4 py-2 font-medium">Дата</th>
                <th className="text-left px-4 py-2 font-medium">Событие</th>
                <th className="text-right px-4 py-2 font-medium">Gross</th>
                <th className="text-right px-4 py-2 font-medium">Комиссия</th>
                <th className="text-right px-4 py-2 font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {payout.orders.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-accent/40 cursor-pointer" onClick={() => setLocation(`/admin/orders/${o.id}`)}>
                  <td className="px-4 py-2 font-mono text-xs text-primary">{o.id}</td>
                  <td className="px-4 py-2">{formatDate(o.date)}</td>
                  <td className="px-4 py-2">{o.event}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(o.gross)}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">{formatCurrency(o.fee)}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(o.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "refunds" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          {payout.refunds.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Возвратов в этом акте нет.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">ID возврата</th>
                  <th className="text-left px-4 py-2 font-medium">Заказ</th>
                  <th className="text-left px-4 py-2 font-medium">Дата</th>
                  <th className="text-left px-4 py-2 font-medium">Причина</th>
                  <th className="text-right px-4 py-2 font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {payout.refunds.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-2 font-mono text-xs text-primary">{r.order}</td>
                    <td className="px-4 py-2">{formatDate(r.date)}</td>
                    <td className="px-4 py-2">{r.reason}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-amber-700">−{formatCurrency(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "audit" && (
        <div className="bg-card border border-card-border rounded-lg p-5">
          <ol className="flex flex-col gap-3">
            {payout.audit.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p>{a.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(a.at)} · {a.who}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </AdminLayout>
  );
}

function SummaryBlock({ label, value, variant = "default" }: { label: string; value: string; variant?: "default" | "muted" | "primary" }) {
  return (
    <div className={`rounded-lg border p-4 ${variant === "primary" ? "bg-primary/5 border-primary/30" : "bg-card border-card-border"}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">{label}</p>
      <p className={`text-xl font-semibold tabular-nums ${variant === "muted" ? "text-muted-foreground" : variant === "primary" ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
