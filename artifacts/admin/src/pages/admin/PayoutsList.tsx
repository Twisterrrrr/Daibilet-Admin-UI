import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { PayoutStatusBadge, type PayoutStatus } from "@/components/shared/PayoutStatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Wallet, Clock, CheckCircle2, AlertCircle, Play } from "lucide-react";

interface Payout {
  id: string;
  supplier: string;
  supplierId: string;
  period: string;
  status: PayoutStatus;
  ordersCount: number;
  gross: number;
  fee: number;
  refunds: number;
  net: number;
  scheduledAt: string;
  paidAt?: string;
}

const payouts: Payout[] = [
  { id: "PO-2026-04-19-001", supplier: "АртПро Концерты", supplierId: "SUP-01", period: "01.04 — 15.04.2026", status: "pending",    ordersCount: 88, gross: 1_200_000, fee: 36_000, refunds: 24_000, net: 1_140_000, scheduledAt: "2026-04-22T10:00:00Z" },
  { id: "PO-2026-04-19-002", supplier: "Стар Ивентс",       supplierId: "SUP-02", period: "01.04 — 15.04.2026", status: "processing", ordersCount: 41, gross: 880_000,   fee: 26_400, refunds: 11_500, net: 842_100,   scheduledAt: "2026-04-21T18:00:00Z" },
  { id: "PO-2026-04-19-003", supplier: "Комеди Хаус",      supplierId: "SUP-03", period: "01.04 — 15.04.2026", status: "paid",       ordersCount: 22, gross: 280_000,   fee: 8_400,  refunds: 3_500,  net: 268_100,   scheduledAt: "2026-04-19T18:00:00Z", paidAt: "2026-04-19T18:14:00Z" },
  { id: "PO-2026-04-19-004", supplier: "ДжазМедиа",         supplierId: "SUP-04", period: "01.04 — 15.04.2026", status: "held",       ordersCount: 18, gross: 360_000,   fee: 10_800, refunds: 0,      net: 349_200,   scheduledAt: "2026-04-22T10:00:00Z" },
  { id: "PO-2026-04-04-001", supplier: "АртПро Концерты", supplierId: "SUP-01", period: "16.03 — 31.03.2026", status: "paid",       ordersCount: 102,gross: 1_540_000, fee: 46_200, refunds: 18_000, net: 1_475_800, scheduledAt: "2026-04-04T18:00:00Z", paidAt: "2026-04-04T18:21:00Z" },
  { id: "PO-2026-04-04-002", supplier: "Стар Ивентс",       supplierId: "SUP-02", period: "16.03 — 31.03.2026", status: "failed",     ordersCount: 0,  gross: 0,         fee: 0,      refunds: 0,      net: 0,         scheduledAt: "2026-04-04T18:00:00Z" },
];

export default function PayoutsList() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = payouts.filter((p) => {
    const m = !search || p.id.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase());
    return m && (statusFilter === "all" || p.status === statusFilter);
  });

  const pendingCount = payouts.filter((p) => p.status === "pending").length;
  const processingCount = payouts.filter((p) => p.status === "processing").length;
  const paidThisCycle = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.net, 0);
  const totalPending = payouts.filter((p) => p.status === "pending" || p.status === "processing").reduce((s, p) => s + p.net, 0);

  const cols: Column<Payout>[] = [
    { key: "id", header: "ID акта", cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "supplier", header: "Поставщик", cell: (r) => <span className="font-medium text-sm">{r.supplier}</span> },
    { key: "period", header: "Период", cell: (r) => <span className="text-sm">{r.period}</span> },
    { key: "orders", header: "Заказов", cell: (r) => <span className="tabular-nums">{r.ordersCount}</span> },
    { key: "gross", header: "Gross", cell: (r) => <span className="tabular-nums text-sm">{formatCurrency(r.gross)}</span> },
    { key: "fee", header: "Комиссия", cell: (r) => <span className="tabular-nums text-xs text-muted-foreground">{formatCurrency(r.fee)}</span> },
    { key: "refunds", header: "Возвраты", cell: (r) => <span className="tabular-nums text-xs text-amber-700">{r.refunds ? `−${formatCurrency(r.refunds)}` : "—"}</span> },
    { key: "net", header: "К выплате", cell: (r) => <span className="tabular-nums text-sm font-semibold">{formatCurrency(r.net)}</span> },
    { key: "status", header: "Статус", cell: (r) => <PayoutStatusBadge status={r.status} /> },
    { key: "date", header: "План / факт", cell: (r) => (
      <div className="flex flex-col text-xs">
        <span className="text-muted-foreground">план: {formatDate(r.scheduledAt)}</span>
        {r.paidAt && <span className="text-emerald-600">факт: {formatDate(r.paidAt)}</span>}
      </div>
    )},
  ];

  return (
    <AdminLayout title="Выплаты" breadcrumbs={[{ label: "Администратор" }, { label: "Финансы", href: "/admin/finance" }, { label: "Выплаты" }]}>
      <PageHeader
        title="Выплаты поставщикам"
        description="Управление актами выплат и их статусами"
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-export-payouts">Экспорт</Button>
            <Button size="sm" data-testid="button-run-payout-cycle"><Play className="w-4 h-4 mr-1.5" /> Запустить цикл выплат</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ожидают подтверждения" value={pendingCount} icon={Clock} />
        <StatCard label="В обработке" value={processingCount} icon={Wallet} />
        <StatCard label="К выплате (сейчас)" value={formatCurrency(totalPending)} icon={AlertCircle} />
        <StatCard label="Выплачено за период" value={formatCurrency(paidThisCycle)} icon={CheckCircle2} />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="ID акта, поставщик..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44" data-testid="select-payout-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидают</SelectItem>
              <SelectItem value="processing">В обработке</SelectItem>
              <SelectItem value="paid">Выплачено</SelectItem>
              <SelectItem value="failed">Ошибка</SelectItem>
              <SelectItem value="held">Заблокировано</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <DataTable
        columns={cols}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/finance/payouts/${r.id}`)}
        emptyMessage="Выплаты не найдены"
        data-testid="table-payouts"
      />
    </AdminLayout>
  );
}
