import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface City {
  id: string;
  name: string;
  nameRu: string;
  country: string;
  timezone: string;
  status: string;
  venuesCount: number;
  eventsCount: number;
}

const mockCities: City[] = [
  { id: "CTY-001", name: "Almaty", nameRu: "Алматы", country: "Kazakhstan", timezone: "Asia/Almaty", status: "active", venuesCount: 12, eventsCount: 54 },
  { id: "CTY-002", name: "Astana", nameRu: "Астана", country: "Kazakhstan", timezone: "Asia/Almaty", status: "active", venuesCount: 7, eventsCount: 28 },
  { id: "CTY-003", name: "Shymkent", nameRu: "Шымкент", country: "Kazakhstan", timezone: "Asia/Almaty", status: "active", venuesCount: 3, eventsCount: 8 },
  { id: "CTY-004", name: "Karaganda", nameRu: "Қарағанды", country: "Kazakhstan", timezone: "Asia/Almaty", status: "inactive", venuesCount: 2, eventsCount: 0 },
];

export default function CitiesList() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filtered = mockCities.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameRu.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<City>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Название (EN)", cell: (r) => r.name },
    { key: "nameRu", header: "Название (RU)", cell: (r) => <span className="font-medium">{r.nameRu}</span> },
    { key: "country", header: "Страна", cell: (r) => r.country },
    { key: "timezone", header: "Часовой пояс", cell: (r) => r.timezone },
    { key: "venues", header: "Площадки", cell: (r) => r.venuesCount },
    { key: "events", header: "События", cell: (r) => r.eventsCount },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <AdminLayout
      title="Города"
      breadcrumbs={[{ label: "Администратор" }, { label: "Площадки" }, { label: "Города" }]}
    >
      <PageHeader
        title="Города"
        description={`${mockCities.length} города в системе`}
        actions={
          <Button size="sm" data-testid="button-create-city">
            <Plus className="w-4 h-4 mr-1.5" /> Добавить город
          </Button>
        }
      />
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по названию города..." />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/cities/${r.id}`)}
        emptyMessage="Города не найдены"
        data-testid="table-cities"
      />
    </AdminLayout>
  );
}
