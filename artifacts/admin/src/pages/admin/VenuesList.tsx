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
import { Plus, ArrowUp, ArrowDown, CalendarRange, Building2, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";

type SalesModel = "event_only" | "standalone" | "hybrid";

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
  salesModel: SalesModel;
  category: string;
  eventsCount: number;
  admissionTypesCount: number;
  visits30d: number;
  delta: number;
  avgPosition: number | null;
}

const mockVenues: Venue[] = [
  { id: "VEN-001", name: "Алатау Арена",          slug: "alatau-arena",      citySlug: "almaty",   city: "Алматы",   address: "ул. Алтынсарина, 31",   capacity: 12000, status: "active",   isContentHub: true,  salesModel: "event_only", category: "Концертная площадка", eventsCount: 8,  admissionTypesCount: 0, visits30d: 24_800, delta: 18.2, avgPosition: 4.1 },
  { id: "VEN-002", name: "Barys Arena",           slug: "barys-arena",       citySlug: "astana",   city: "Астана",   address: "пр. Туран, 49",          capacity: 10000, status: "active",   isContentHub: true,  salesModel: "event_only", category: "Спортивная арена",    eventsCount: 5,  admissionTypesCount: 0, visits30d: 14_200, delta: 9.4,  avgPosition: 5.2 },
  { id: "VEN-003", name: "Мега Silk Way",         slug: "mega-silk-way",     citySlug: "almaty",   city: "Алматы",   address: "ул. Розыбакиева, 247а",  capacity: 2500,  status: "active",   isContentHub: true,  salesModel: "event_only", category: "Концертная площадка", eventsCount: 12, admissionTypesCount: 0, visits30d: 18_400, delta: 22.7, avgPosition: 3.8 },
  { id: "VEN-006", name: "Алматинский зоопарк",   slug: "almaty-zoo",        citySlug: "almaty",   city: "Алматы",   address: "ул. Есенберлина, 166",   capacity: 8000,  status: "active",   isContentHub: true,  salesModel: "standalone", category: "Зоопарк",             eventsCount: 0,  admissionTypesCount: 4, visits30d: 41_200, delta: 28.4, avgPosition: 2.3 },
  { id: "VEN-007", name: "Музей Кастеева",        slug: "kasteev-museum",    citySlug: "almaty",   city: "Алматы",   address: "мкр. Коктем-3, 22",      capacity: 600,   status: "active",   isContentHub: true,  salesModel: "hybrid",     category: "Музей",               eventsCount: 3,  admissionTypesCount: 5, visits30d: 12_800, delta: 14.2, avgPosition: 4.4 },
  { id: "VEN-008", name: "Океанариум Думан",      slug: "duman-oceanarium",  citySlug: "astana",   city: "Астана",   address: "пр. Кабанбай батыра, 6", capacity: 1200,  status: "active",   isContentHub: true,  salesModel: "standalone", category: "Океанариум",          eventsCount: 0,  admissionTypesCount: 3, visits30d: 22_400, delta: 11.8, avgPosition: 3.6 },
  { id: "VEN-004", name: "Конгресс Холл",         slug: "kongress-hall",     citySlug: "astana",   city: "Астана",   address: "пр. Достык, 12",          capacity: 3000,  status: "active",   isContentHub: false, salesModel: "event_only", category: "Конгресс-центр",      eventsCount: 3,  admissionTypesCount: 0, visits30d: 1_840,  delta: -4.2, avgPosition: 14.0 },
  { id: "VEN-005", name: "Park Hall",             slug: "park-hall",         citySlug: "shymkent", city: "Шымкент",  address: "пр. Республики, 44",      capacity: 1500,  status: "inactive", isContentHub: false, salesModel: "event_only", category: "Концертная площадка", eventsCount: 0,  admissionTypesCount: 0, visits30d: 120,    delta: -25,  avgPosition: null },
];

const salesModelMeta: Record<SalesModel, { label: string; icon: typeof CalendarRange; className: string; hint: string }> = {
  event_only:  { label: "Только события",       icon: CalendarRange, className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200", hint: "Концертные залы, арены — только ticketed events" },
  standalone:  { label: "Прямые продажи",       icon: Building2,     className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", hint: "Музеи, зоопарки, океанариумы — открытая цена входа" },
  hybrid:      { label: "Гибрид",                icon: Sparkles,      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", hint: "Постоянная экспозиция + временные события" },
};

export function SalesModelBadge({ model }: { model: SalesModel }) {
  const m = salesModelMeta[model]; const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.className}`}>
      <Icon className="w-3 h-3" /> {m.label}
    </span>
  );
}

export { salesModelMeta };
export type { SalesModel };

export default function VenuesList() {
  const [search, setSearch] = useState("");
  const [hubFilter, setHubFilter] = useState("all");
  const [model, setModel] = useState("all");
  const [city, setCity] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockVenues.filter((v) => {
    const m = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.address.toLowerCase().includes(search.toLowerCase());
    return m && (hubFilter === "all" || (hubFilter === "hub" ? v.isContentHub : !v.isContentHub))
            && (city === "all" || v.city === city)
            && (model === "all" || v.salesModel === model);
  });

  const totalVisits = mockVenues.reduce((s, v) => s + v.visits30d, 0);
  const standaloneCount = mockVenues.filter((v) => v.salesModel === "standalone").length;
  const hybridCount = mockVenues.filter((v) => v.salesModel === "hybrid").length;

  const columns: Column<Venue>[] = [
    { key: "name", header: "Площадка", cell: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.name}</span>
        <span className="text-xs text-muted-foreground font-mono">/{r.citySlug}/venues/{r.slug}/</span>
      </div>
    )},
    { key: "category", header: "Категория", cell: (r) => <span className="text-xs text-muted-foreground">{r.category}</span> },
    { key: "model", header: "Модель продаж", cell: (r) => <SalesModelBadge model={r.salesModel} /> },
    { key: "hub", header: "Хаб", cell: (r) => <ContentHubBadge isHub={r.isContentHub} /> },
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "events", header: "События", cell: (r) => (
      <div className="flex flex-col items-end text-xs">
        <span className="tabular-nums">{r.eventsCount}</span>
        {r.admissionTypesCount > 0 && (
          <span className="text-emerald-600">+{r.admissionTypesCount} тарифов</span>
        )}
      </div>
    )},
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
        description={`${mockVenues.length} площадок · ${standaloneCount} с прямыми продажами · ${hybridCount} гибридных · ${formatNumber(totalVisits)} визитов / 30 дн`}
        actions={<Button size="sm" data-testid="button-create-venue"><Plus className="w-4 h-4 mr-1.5" /> Добавить площадку</Button>}
      />

      <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 rounded-lg p-4 mb-4 text-sm text-violet-900 dark:text-violet-200">
        <p className="mb-2">
          <strong>Площадки как контент-хабы:</strong> страницы вида <code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">/{"{city}"}/venues/{"{slug}"}/</code> собирают
          трафик по запросам «купить билет в [площадка]».
        </p>
        <p>
          <strong>Три модели продаж:</strong>
          {" "}<code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">event_only</code> — только ticketed события (концертные залы);
          {" "}<code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">standalone</code> — площадка сама продаёт билеты по открытой цене (музеи, зоопарки, океанариумы);
          {" "}<code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">hybrid</code> — и то, и другое (например, музей с временными выставками).
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по названию, адресу..."
        filters={
          <>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-36" data-testid="select-venue-city"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                <SelectItem value="Алматы">Алматы</SelectItem>
                <SelectItem value="Астана">Астана</SelectItem>
                <SelectItem value="Шымкент">Шымкент</SelectItem>
              </SelectContent>
            </Select>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-44" data-testid="select-venue-model"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все модели</SelectItem>
                <SelectItem value="event_only">Только события</SelectItem>
                <SelectItem value="standalone">Прямые продажи</SelectItem>
                <SelectItem value="hybrid">Гибрид</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hubFilter} onValueChange={setHubFilter}>
              <SelectTrigger className="w-40" data-testid="select-venue-hub"><SelectValue /></SelectTrigger>
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
