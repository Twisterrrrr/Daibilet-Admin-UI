import { useState } from "react";
import { useLocation } from "wouter";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface MyEvent {
  id: string;
  title: string;
  city: string;
  venue: string;
  date: string;
  status: string;
  minPrice: number;
  soldCount: number;
  capacity: number;
  isImported: boolean;
}

const myEvents: MyEvent[] = [
  { id: "EVT-001", title: "Ночь музыки 2025", city: "Алматы", venue: "Алатау Арена", date: "2025-05-15", status: "published", minPrice: 9000, soldCount: 412, capacity: 800, isImported: true },
  { id: "EVT-006", title: "Рок-фестиваль RockZone", city: "Алматы", venue: "Алматы Арена", date: "2025-08-01", status: "draft", minPrice: 12000, soldCount: 0, capacity: 3000, isImported: false },
];

export default function SupplierEventsList() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filtered = myEvents.filter((e) =>
    !search ||
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<MyEvent>[] = [
    { key: "title", header: "Название", cell: (r) => (
      <div>
        <span className="font-medium">{r.title}</span>
        {r.isImported && (
          <span className="ml-2 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">импорт</span>
        )}
      </div>
    )},
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "venue", header: "Площадка", cell: (r) => r.venue },
    { key: "date", header: "Дата", cell: (r) => formatDate(r.date) },
    { key: "price", header: "Цена от", cell: (r) => formatCurrency(r.minPrice) },
    { key: "sold", header: "Продано", cell: (r) => `${r.soldCount} / ${r.capacity}` },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <SupplierLayout
      title="Мои события"
      breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Мои события" }]}
    >
      <PageHeader
        title="Мои события"
        description={`${myEvents.length} событий`}
        actions={
          <Button size="sm" data-testid="button-create-supplier-event">
            <Plus className="w-4 h-4 mr-1.5" /> Создать событие
          </Button>
        }
      />

      <Alert className="mb-4">
        <Info className="w-4 h-4" />
        <AlertDescription>
          Новые события проходят модерацию перед публикацией. Поля, отмеченные как «импорт», доступны только для чтения.
        </AlertDescription>
      </Alert>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по названию или городу..." />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/supplier/events/${r.id}`)}
        emptyMessage="У вас нет событий"
        data-testid="supplier-table-events"
      />
    </SupplierLayout>
  );
}
