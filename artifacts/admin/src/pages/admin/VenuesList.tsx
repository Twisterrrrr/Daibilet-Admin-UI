import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  status: string;
  eventsCount: number;
}

const mockVenues: Venue[] = [
  { id: "VEN-001", name: "Алатау Арена", city: "Алматы", address: "ул. Алтынсарина, 31", capacity: 12000, status: "active", eventsCount: 8 },
  { id: "VEN-002", name: "Barys Arena", city: "Астана", address: "пр. Туран, 49", capacity: 10000, status: "active", eventsCount: 5 },
  { id: "VEN-003", name: "Мега Silk Way", city: "Алматы", address: "ул. Розыбакиева, 247а", capacity: 2500, status: "active", eventsCount: 12 },
  { id: "VEN-004", name: "Конгресс Холл", city: "Астана", address: "пр. Достык, 12", capacity: 3000, status: "active", eventsCount: 3 },
  { id: "VEN-005", name: "Park Hall", city: "Шымкент", address: "пр. Республики, 44", capacity: 1500, status: "inactive", eventsCount: 0 },
];

export default function VenuesList() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filtered = mockVenues.filter((v) =>
    !search ||
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase()) ||
    v.address.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Venue>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Название", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "address", header: "Адрес", cell: (r) => r.address },
    { key: "capacity", header: "Вместимость", cell: (r) => r.capacity.toLocaleString() },
    { key: "events", header: "Событий", cell: (r) => r.eventsCount },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <AdminLayout
      title="Площадки"
      breadcrumbs={[{ label: "Администратор" }, { label: "Площадки" }]}
    >
      <PageHeader
        title="Площадки"
        description={`${mockVenues.length} площадок в системе`}
        actions={
          <Button size="sm" data-testid="button-create-venue">
            <Plus className="w-4 h-4 mr-1.5" /> Добавить площадку
          </Button>
        }
      />
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по названию, городу, адресу..." />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/venues/${r.id}`)}
        emptyMessage="Площадки не найдены"
        data-testid="table-venues"
      />
    </AdminLayout>
  );
}
