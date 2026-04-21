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

interface Venue {
  id: string;
  name: string;
  slug: string;
  citySlug: string;
  city: string;
  address: string;
  capacity: number;
  status: string;
  isContentHub: boolean;
  eventsCount: number;
  visits30d: number;
  delta: number;
  avgPosition: number | null;
}

const mockVenues: Venue[] = [
  { id: "VEN-001", name: "Алатау Арена",   slug: "alatau-arena",      citySlug: "almaty",   city: "Алматы",   address: "ул. Алтынсарина, 31",   capacity: 12000, status: "active",   isContentHub: true,  eventsCount: 8,  visits30d: 24_800, delta: 18.2, avgPosition: 4.1 },
  { id: "VEN-002", name: "Barys Arena",    slug: "barys-arena",       citySlug: "astana",   city: "Астана",   address: "пр. Туран, 49",          capacity: 10000, status: "active",   isContentHub: true,  eventsCount: 5,  visits30d: 14_200, delta: 9.4,  avgPosition: 5.2 },
  { id: "VEN-003", name: "Мега Silk Way",  slug: "mega-silk-way",     citySlug: "almaty",   city: "Алматы",   address: "ул. Розыбакиева, 247а",  capacity: 2500,  status: "active",   isContentHub: true,  eventsCount: 12, visits30d: 18_400, delta: 22.7, avgPosition: 3.8 },
  { id: "VEN-004", name: "Конгресс Холл",  slug: "kongress-hall",     citySlug: "astana",   city: "Астана",   address: "пр. Достык, 12",          capacity: 3000,  status: "active",   isContentHub: false, eventsCount: 3,  visits30d: 1_840,  delta: -4.2, avgPosition: 14.0 },
  { id: "VEN-005", name: "Park Hall",      slug: "park-hall",         citySlug: "shymkent", city: "Шымкент",  address: "пр. Республики, 44",      capacity: 1500,  status: "inactive", isContentHub: false, eventsCount: 0,  visits30d: 120,    delta: -25,  avgPosition: null },
];

export default function VenuesList() {
  const [search, setSearch] = useState("");
  const [hubFilter, setHubFilter] = useState("all");
  const [city, setCity] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockVenues.filter((v) => {
    const m = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.address.toLowerCase().includes(search.toLowerCase());
    return m && (hubFilter === "all" || (hubFilter === "hub" ? v.isContentHub : !v.isContentHub)) && (city === "all" || v.city === city);
  });

  const totalVisits = mockVenues.reduce((s, v) => s + v.visits30d, 0);
  const hubsCount = mockVenues.filter((v) => v.isContentHub).length;

  const columns: Column<Venue>[] = [
    { key: "name", header: "Площадка", cell: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.name}</span>
        <span className="text-xs text-muted-foreground font-mono">/{r.citySlug}/venues/{r.slug}/</span>
      </div>
    )},
    { key: "hub", header: "Тип", cell: (r) => <ContentHubBadge isHub={r.isContentHub} /> },
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "capacity", header: "Вместимость", cell: (r) => <span className="tabular-nums">{r.capacity.toLocaleString()}</span> },
    { key: "events", header: "Событий", cell: (r) => <span className="tabular-nums">{r.eventsCount}</span> },
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
    <AdminLayout title="Площадки" breadcrumbs={[{ label: "Администратор" }, { label: "Каталог" }, { label: "Площадки" }]}>
      <PageHeader
        title="Площадки"
        description={`${mockVenues.length} площадок · ${hubsCount} контент-хабов · ${formatNumber(totalVisits)} визитов / 30 дн`}
        actions={<Button size="sm" data-testid="button-create-venue"><Plus className="w-4 h-4 mr-1.5" /> Добавить площадку</Button>}
      />

      <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 rounded-lg p-4 mb-4">
        <p className="text-sm text-violet-900 dark:text-violet-200">
          <strong>Площадки как контент-хабы:</strong> страницы вида <code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">/{"{city}"}/venues/{"{venue-slug}"}/</code> собирают
          трафик по запросам «купить билет в [площадка]», «афиша [площадка]». Контент-хабы имеют расширенное описание, схему зала, FAQ.
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по названию, адресу..."
        filters={
          <>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-40" data-testid="select-venue-city"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                <SelectItem value="Алматы">Алматы</SelectItem>
                <SelectItem value="Астана">Астана</SelectItem>
                <SelectItem value="Шымкент">Шымкент</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hubFilter} onValueChange={setHubFilter}>
              <SelectTrigger className="w-44" data-testid="select-venue-hub"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все площадки</SelectItem>
                <SelectItem value="hub">Контент-хабы</SelectItem>
                <SelectItem value="ref">Только справочник</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <DataTable columns={columns} data={filtered} onRowClick={(r) => setLocation(`/admin/venues/${r.id}`)} emptyMessage="Площадки не найдены" data-testid="table-venues" />
    </AdminLayout>
  );
}
