import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ContentHubBadge } from "@/components/shared/TrafficStats";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface City {
  id: string;
  name: string;
  nameRu: string;
  slug: string;
  country: string;
  status: string;
  isContentHub: boolean;
  venuesCount: number;
  eventsCount: number;
  visits30d: number;
  delta: number;
  avgPosition: number | null;
}

const mockCities: City[] = [
  { id: "CTY-001", name: "Moscow",  nameRu: "Москва",   slug: "moscow",   country: "RU", status: "active",   isContentHub: true,  venuesCount: 12, eventsCount: 54, visits30d: 184_200, delta: 12.4, avgPosition: 3.2 },
  { id: "CTY-002", name: "Saint Petersburg",  nameRu: "Санкт-Петербург",   slug: "saint-petersburg",   country: "RU", status: "active",   isContentHub: true,  venuesCount: 7,  eventsCount: 28, visits30d: 92_400,  delta: 8.1,  avgPosition: 4.1 },
  { id: "CTY-003", name: "Kazan",nameRu: "Казань",  slug: "kazan", country: "RU", status: "active",   isContentHub: true,  venuesCount: 3,  eventsCount: 8,  visits30d: 18_900,  delta: 22.6, avgPosition: 6.5 },
  { id: "CTY-004", name: "Karaganda",nameRu:"Караганда", slug: "karaganda", country: "RU", status: "active",   isContentHub: false, venuesCount: 2,  eventsCount: 0,  visits30d: 1_240,   delta: -8.3, avgPosition: 18.2 },
  { id: "CTY-005", name: "Aktobe",  nameRu: "Актобе",   slug: "aktobe",   country: "RU", status: "inactive", isContentHub: false, venuesCount: 0,  eventsCount: 0,  visits30d: 0,       delta: 0,    avgPosition: null },
];

export default function CitiesList() {
  const [search, setSearch] = useState("");
  const [hubFilter, setHubFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockCities.filter((c) => {
    const m = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.nameRu.toLowerCase().includes(search.toLowerCase());
    return m && (hubFilter === "all" || (hubFilter === "hub" ? c.isContentHub : !c.isContentHub));
  });

  const totalVisits = mockCities.reduce((s, c) => s + c.visits30d, 0);
  const hubsCount = mockCities.filter((c) => c.isContentHub).length;

  const columns: Column<City>[] = [
    { key: "name", header: "Город", cell: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.nameRu}</span>
        <span className="text-xs text-muted-foreground font-mono">/{r.slug}/</span>
      </div>
    )},
    { key: "hub", header: "Тип", cell: (r) => <ContentHubBadge isHub={r.isContentHub} /> },
    { key: "venues", header: "Площадки", cell: (r) => <span className="tabular-nums">{r.venuesCount}</span> },
    { key: "events", header: "События", cell: (r) => <span className="tabular-nums">{r.eventsCount}</span> },
    { key: "visits", header: "Визиты / 30 дн", cell: (r) => (
      <div className="flex items-center gap-2 justify-end">
        <span className="tabular-nums font-medium">{formatNumber(r.visits30d)}</span>
        {r.delta !== 0 && (
          <span className={`text-xs inline-flex items-center ${r.delta > 0 ? "text-emerald-600" : "text-red-600"}`}>
            {r.delta > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(r.delta).toFixed(1)}%
          </span>
        )}
      </div>
    )},
    { key: "pos", header: "Сред. позиция", cell: (r) => r.avgPosition == null ? <span className="text-muted-foreground text-xs">—</span> : (
      <span className={`tabular-nums ${r.avgPosition <= 5 ? "text-emerald-600 font-medium" : r.avgPosition <= 10 ? "" : "text-amber-600"}`}>
        {r.avgPosition.toFixed(1)}
      </span>
    )},
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <AdminLayout title="Города" breadcrumbs={[{ label: "Администратор" }, { label: "Каталог" }, { label: "Города" }]}>
      <PageHeader
        title="Города"
        description={
          <>
            {mockCities.length} городов · {hubsCount} контент-хабов · {formatNumber(totalVisits)} визитов / 30 дн
          </>
        }
        actions={<Button size="sm" data-testid="button-create-city"><Plus className="w-4 h-4 mr-1.5" /> Добавить город</Button>}
      />

      <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 rounded-lg p-4 mb-4">
        <p className="text-sm text-violet-900 dark:text-violet-200">
          <strong>Города как контент-хабы:</strong> страницы городов формируют основной поисковый трафик через
          паттерн <code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">/{"{city-slug}"}/</code>.
          Города со статусом «контент-хаб» имеют расширенный SEO-контент (H1, intro, FAQ, блоки), остальные — только справочные.
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по названию города..."
        filters={
          <Select value={hubFilter} onValueChange={setHubFilter}>
            <SelectTrigger className="w-44" data-testid="select-cities-hub"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все города</SelectItem>
              <SelectItem value="hub">Контент-хабы</SelectItem>
              <SelectItem value="ref">Только справочник</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <DataTable columns={columns} data={filtered} onRowClick={(r) => setLocation(`/admin/cities/${r.id}`)} emptyMessage="Города не найдены" data-testid="table-cities" />
    </AdminLayout>
  );
}
