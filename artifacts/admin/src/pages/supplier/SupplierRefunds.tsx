import { useState } from "react";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface RefundRow {
  id: string;
  orderId: string;
  event: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const myRefunds: RefundRow[] = [
  { id: "REF-22", orderId: "ORD-1041", event: "Ночь музыки 2025", amount: 18000, reason: "Не смогу посетить", status: "pending", createdAt: "2025-04-21T10:00:00Z" },
  { id: "REF-21", orderId: "ORD-1037", event: "Ночь музыки 2025", amount: 15500, reason: "Купил у конкурента", status: "approved", createdAt: "2025-04-19T19:00:00Z" },
];

export default function SupplierRefunds() {
  const [search, setSearch] = useState("");
  const filtered = myRefunds.filter((r) => !search || r.event.toLowerCase().includes(search.toLowerCase()) || r.orderId.includes(search));

  const columns: Column<RefundRow>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "order", header: "Заказ", cell: (r) => <span className="font-mono text-xs">{r.orderId}</span> },
    { key: "event", header: "Событие", cell: (r) => r.event },
    { key: "amount", header: "Сумма", cell: (r) => <span className="font-medium">{formatCurrency(r.amount)}</span> },
    { key: "reason", header: "Причина", cell: (r) => <span className="text-sm text-muted-foreground">{r.reason}</span> },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Создан", cell: (r) => formatDateTime(r.createdAt) },
  ];

  return (
    <SupplierLayout title="Возвраты" breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Возвраты" }]}>
      <PageHeader
        title="Возвраты по моим событиям"
        description={`${myRefunds.length} запросов`}
      />
      <Alert className="mb-4">
        <Info className="w-4 h-4" />
        <AlertDescription>
          Решения по возвратам принимает администратор. Здесь вы видите запросы, которые касаются ваших продаж.
        </AlertDescription>
      </Alert>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по событию или заказу..." />
      <DataTable columns={columns} data={filtered} emptyMessage="Запросов на возврат нет" data-testid="supplier-table-refunds" />
    </SupplierLayout>
  );
}
