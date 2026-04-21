import { useState } from "react";
import { useLocation } from "wouter";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SourceBadge, type InventorySource } from "@/components/shared/SourceBadge";
import { SyncStatusBadge, type SyncStatus } from "@/components/shared/SyncStatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  inventorySource: InventorySource;
  syncStatus?: SyncStatus;
}

const myEvents: MyEvent[] = [
  { id: "EVT-001", title: "Ночь музыки 2025", city: "Алматы", venue: "Алатау Арена", date: "2025-05-15", status: "published", minPrice: 9000, soldCount: 412, capacity: 800, inventorySource: "imported", syncStatus: "ok" },
  { id: "EVT-006", title: "Рок-фестиваль RockZone", city: "Алматы", venue: "Алматы Арена", date: "2025-08-01", status: "draft", minPrice: 12000, soldCount: 0, capacity: 3000, inventorySource: "manual" },
  { id: "EVT-008", title: "Хиты лета", city: "Алматы", venue: "Mega Park", date: "2025-07-04", status: "pending", minPrice: 7500, soldCount: 0, capacity: 1500, inventorySource: "hybrid", syncStatus: "stale" },
];

export default function SupplierEventsList() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = myEvents.filter((e) =>
    (!search || e.title.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase())) &&
    (sourceFilter === "all" || e.inventorySource === sourceFilter)
  );

  const columns: Column<MyEvent>[] = [
    { key: "title", header: "Название", cell: (r) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{r.title}</span>
        <SourceBadge source={r.inventorySource} />
      </div>
    )},
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "venue", header: "Площадка", cell: (r) => r.venue },
    { key: "date", header: "Дата", cell: (r) => formatDate(r.date) },
    { key: "price", header: "Цена от", cell: (r) => formatCurrency(r.minPrice) },
    { key: "sold", header: "Продано", cell: (r) => `${r.soldCount} / ${r.capacity}` },
    { key: "sync", header: "Sync", cell: (r) => r.syncStatus ? <SyncStatusBadge status={r.syncStatus} /> : <span className="text-muted-foreground text-xs">—</span> },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <SupplierLayout title="Мои события" breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Мои события" }]}>
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
          <strong>Manual</strong> события вы создаёте сами. <strong>Imported</strong> и <strong>API</strong> события приходят из внешних источников и доступны частично только для чтения. <strong>Hybrid</strong> — ядро от источника, цены/описание можно частично переопределять.
        </AlertDescription>
      </Alert>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по названию или городу..."
        filters={
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-44" data-testid="select-supplier-source">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все источники</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="imported">Imported</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        }
      />

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
