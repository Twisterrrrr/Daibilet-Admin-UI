import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { Download, ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { Link } from "wouter";

type TxKind = "payment" | "refund" | "payout" | "fee_adjustment";
type TxStatus = "settled" | "pending" | "failed" | "reversed";

interface Tx {
  id: string;
  externalRef: string;
  date: string;
  kind: TxKind;
  status: TxStatus;
  provider: string;
  orderId?: string;
  supplier: string;
  gross: number;
  fee: number;
  net: number;
}

const txs: Tx[] = [
  { id: "TX-90021", externalRef: "yk:8821-441",       date: "2026-04-21T08:14:00Z", kind: "payment", status: "settled", provider: "ЮKassa",         orderId: "ORD-1041", supplier: "ArtPro", gross: 12000, fee: 360, net: 11640 },
  { id: "TX-90020", externalRef: "tk:tr-77a4",        date: "2026-04-21T07:55:00Z", kind: "payment", status: "settled", provider: "Тинькофф Касса",  orderId: "ORD-1040", supplier: "Стар Ивентс", gross: 8500, fee: 255, net: 8245 },
  { id: "TX-90019", externalRef: "cp:f00210",         date: "2026-04-21T07:12:00Z", kind: "refund",  status: "settled", provider: "CloudPayments",   orderId: "ORD-1029", supplier: "Комеди Хаус", gross: -3500, fee: 0, net: -3500 },
  { id: "TX-90018", externalRef: "sbp:8821-440",      date: "2026-04-21T06:48:00Z", kind: "payment", status: "pending", provider: "СБП",             orderId: "ORD-1039", supplier: "ArtPro", gross: 14200, fee: 71, net: 14129 },
  { id: "TX-90017", externalRef: "po-2026-04-20-sup02", date: "2026-04-20T20:00:00Z", kind: "payout", status: "settled", provider: "Банковский перевод", supplier: "Стар Ивентс", gross: -842000, fee: 0, net: -842000 },
  { id: "TX-90016", externalRef: "tk:tr-77a3",        date: "2026-04-20T18:31:00Z", kind: "payment", status: "failed",  provider: "Тинькофф Касса",  orderId: "ORD-1038", supplier: "ДжазМедиа", gross: 6000, fee: 0, net: 0 },
  { id: "TX-90015", externalRef: "manual-adj-12",     date: "2026-04-20T15:10:00Z", kind: "fee_adjustment", status: "settled", provider: "—", supplier: "ArtPro", gross: 0, fee: -1200, net: 1200 },
];

const kindMeta: Record<TxKind, { label: string; icon: typeof ArrowDownLeft; className: string }> = {
  payment:        { label: "Платёж",      icon: ArrowDownLeft, className: "text-emerald-600" },
  refund:         { label: "Возврат",     icon: RotateCcw,     className: "text-amber-600" },
  payout:         { label: "Выплата",     icon: ArrowUpRight,  className: "text-blue-600" },
  fee_adjustment: { label: "Корректировка", icon: RotateCcw,  className: "text-violet-600" },
};

const statusMeta: Record<TxStatus, { label: string; className: string }> = {
  settled:  { label: "Проведено", className: "bg-emerald-100 text-emerald-700" },
  pending:  { label: "В обработке", className: "bg-amber-100 text-amber-700" },
  failed:   { label: "Ошибка",      className: "bg-red-100 text-red-700" },
  reversed: { label: "Отменено",    className: "bg-slate-200 text-slate-700" },
};

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("all");

  const filtered = txs.filter((t) => {
    const m = !search ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.externalRef.toLowerCase().includes(search.toLowerCase()) ||
      t.supplier.toLowerCase().includes(search.toLowerCase()) ||
      (t.orderId?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return m && (kind === "all" || t.kind === kind) && (status === "all" || t.status === status) && (provider === "all" || t.provider === provider);
  });

  const totalGross = filtered.filter((t) => t.kind === "payment").reduce((s, t) => s + t.gross, 0);
  const totalRefund = Math.abs(filtered.filter((t) => t.kind === "refund").reduce((s, t) => s + t.gross, 0));
  const totalFee = filtered.reduce((s, t) => s + (t.fee || 0), 0);

  const cols: Column<Tx>[] = [
    { key: "id", header: "ID", cell: (r) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-xs">{r.id}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{r.externalRef}</span>
      </div>
    )},
    { key: "date", header: "Дата/время", cell: (r) => <span className="text-sm">{formatDateTime(r.date)}</span> },
    { key: "kind", header: "Тип", cell: (r) => {
      const k = kindMeta[r.kind]; const Icon = k.icon;
      return <span className={`inline-flex items-center gap-1 text-sm ${k.className}`}><Icon className="w-3.5 h-3.5" />{k.label}</span>;
    }},
    { key: "status", header: "Статус", cell: (r) => {
      const s = statusMeta[r.status];
      return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>;
    }},
    { key: "provider", header: "Провайдер", cell: (r) => <span className="text-sm">{r.provider}</span> },
    { key: "order", header: "Заказ", cell: (r) => r.orderId ? (
      <Link href={`/admin/orders/${r.orderId}`}><span className="text-primary hover:underline text-xs cursor-pointer">{r.orderId}</span></Link>
    ) : <span className="text-muted-foreground text-xs">—</span> },
    { key: "supplier", header: "Поставщик", cell: (r) => <span className="text-sm">{r.supplier}</span> },
    { key: "gross", header: "Сумма (gross)", cell: (r) => (
      <span className={`tabular-nums text-sm font-medium ${r.gross < 0 ? "text-red-600" : ""}`}>{formatCurrency(r.gross)}</span>
    )},
    { key: "fee", header: "Комиссия", cell: (r) => <span className="tabular-nums text-xs text-muted-foreground">{formatCurrency(r.fee)}</span> },
    { key: "net", header: "Net", cell: (r) => <span className="tabular-nums text-sm">{formatCurrency(r.net)}</span> },
  ];

  return (
    <AdminLayout title="Транзакции" breadcrumbs={[{ label: "Администратор" }, { label: "Финансы", href: "/admin/finance" }, { label: "Транзакции" }]}>
      <PageHeader
        title="Транзакции"
        description={`${filtered.length} транзакций · gross ${formatCurrency(totalGross)} · возвраты ${formatCurrency(totalRefund)} · комиссии ${formatCurrency(totalFee)}`}
        actions={<Button variant="outline" size="sm" data-testid="button-export-tx"><Download className="w-4 h-4 mr-1.5" /> Экспорт CSV</Button>}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="ID, external ref, заказ, поставщик..."
        filters={
          <>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger className="w-40" data-testid="select-tx-kind"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="payment">Платежи</SelectItem>
                <SelectItem value="refund">Возвраты</SelectItem>
                <SelectItem value="payout">Выплаты</SelectItem>
                <SelectItem value="fee_adjustment">Корректировки</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40" data-testid="select-tx-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="settled">Проведено</SelectItem>
                <SelectItem value="pending">В обработке</SelectItem>
                <SelectItem value="failed">Ошибка</SelectItem>
                <SelectItem value="reversed">Отменено</SelectItem>
              </SelectContent>
            </Select>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-40" data-testid="select-tx-provider"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все провайдеры</SelectItem>
                <SelectItem value="ЮKassa">ЮKassa</SelectItem>
                <SelectItem value="Тинькофф Касса">Тинькофф Касса</SelectItem>
                <SelectItem value="СБП">СБП</SelectItem>
                <SelectItem value="CloudPayments">CloudPayments</SelectItem>
                <SelectItem value="Банковский перевод">Банковский перевод</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <DataTable columns={cols} data={filtered} emptyMessage="Транзакции не найдены" data-testid="table-transactions" />
    </AdminLayout>
  );
}
