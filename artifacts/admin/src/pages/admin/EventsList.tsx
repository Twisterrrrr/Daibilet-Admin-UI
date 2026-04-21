import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SourceBadge, SalesModeBadge, type InventorySource, type SalesMode } from "@/components/shared/SourceBadge";
import { SyncStatusBadge, type SyncStatus } from "@/components/shared/SyncStatusBadge";
import { IssueCount, type Issue } from "@/components/shared/IssueList";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Lock, Pencil } from "lucide-react";

interface Event {
  id: string;
  title: string;
  city: string;
  venue: string;
  supplier: string;
  date: string;
  status: string;
  publishState: "published" | "draft" | "pending" | "rejected";
  ticketPrice: number;
  soldCount: number;
  inventorySource: InventorySource;
  salesMode: SalesMode;
  externalId?: string;
  syncStatus: SyncStatus;
  hasOverrides: boolean;
  seoIssues: Issue[];
  qualityIssues: Issue[];
}

const mockEvents: Event[] = [
  {
    id: "EVT-001", title: "Ночь музыки 2025", city: "Алматы", venue: "Алатау Арена",
    supplier: "ArtPro Kazakhstan", date: "2025-05-15", status: "published", publishState: "published",
    ticketPrice: 9000, soldCount: 412,
    inventorySource: "imported", salesMode: "internal_checkout",
    externalId: "ticketon:TKT-98221", syncStatus: "ok", hasOverrides: true,
    seoIssues: [{ severity: "warning", message: "meta description короче 50 символов" }],
    qualityIssues: [],
  },
  {
    id: "EVT-002", title: "Forum на Arena", city: "Астана", venue: "Barys Arena",
    supplier: "Star Events", date: "2025-06-02", status: "published", publishState: "published",
    ticketPrice: 21500, soldCount: 128,
    inventorySource: "api", salesMode: "external_redirect",
    externalId: "ticketscloud:abc-441", syncStatus: "ok", hasOverrides: false,
    seoIssues: [], qualityIssues: [],
  },
  {
    id: "EVT-003", title: "Stand Up Night", city: "Алматы", venue: "Мега Silk Way",
    supplier: "Comedy House", date: "2025-05-20", status: "draft", publishState: "draft",
    ticketPrice: 4500, soldCount: 0,
    inventorySource: "manual", salesMode: "internal_checkout",
    syncStatus: "never", hasOverrides: false,
    seoIssues: [{ severity: "critical", message: "не задан title" }],
    qualityIssues: [{ severity: "warning", message: "нет обложки" }],
  },
  {
    id: "EVT-004", title: "Astana Jazz", city: "Астана", venue: "Конгресс Холл",
    supplier: "JazzMedia", date: "2025-07-10", status: "published", publishState: "published",
    ticketPrice: 15000, soldCount: 237,
    inventorySource: "hybrid", salesMode: "hybrid",
    externalId: "teplohod:ev-7711", syncStatus: "stale", hasOverrides: true,
    seoIssues: [], qualityIssues: [],
  },
  {
    id: "EVT-005", title: "Детский фестиваль", city: "Шымкент", venue: "Park Hall",
    supplier: "KidsFest LLP", date: "2025-05-31", status: "pending", publishState: "pending",
    ticketPrice: 3000, soldCount: 0,
    inventorySource: "manual", salesMode: "internal_checkout",
    syncStatus: "never", hasOverrides: false,
    seoIssues: [], qualityIssues: [{ severity: "warning", message: "описание короче 200 символов" }],
  },
  {
    id: "EVT-006", title: "Рок-фестиваль RockZone", city: "Алматы", venue: "Алматы Арена",
    supplier: "ArtPro Kazakhstan", date: "2025-08-01", status: "draft", publishState: "draft",
    ticketPrice: 12000, soldCount: 0,
    inventorySource: "manual", salesMode: "internal_checkout",
    syncStatus: "never", hasOverrides: false,
    seoIssues: [{ severity: "warning", message: "slug совпадает с другим событием" }],
    qualityIssues: [],
  },
  {
    id: "EVT-007", title: "Almaty Theatre Week", city: "Алматы", venue: "Театр им. Ауэзова",
    supplier: "Star Events", date: "2025-09-12", status: "published", publishState: "published",
    ticketPrice: 6500, soldCount: 88,
    inventorySource: "api", salesMode: "mirror",
    externalId: "ticketscloud:thr-882", syncStatus: "error", hasOverrides: false,
    seoIssues: [], qualityIssues: [{ severity: "critical", message: "ошибка загрузки билетов из источника" }],
  },
];

export default function EventsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockEvents.filter((e) => {
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase()) ||
      e.supplier.toLowerCase().includes(search.toLowerCase()) ||
      (e.externalId?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "all" || e.publishState === statusFilter;
    const matchSource = sourceFilter === "all" || e.inventorySource === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const columns: Column<Event>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "title", header: "Название", cell: (r) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{r.title}</span>
        {r.externalId && <span className="text-[10px] font-mono text-muted-foreground">{r.externalId}</span>}
      </div>
    )},
    { key: "supplier", header: "Поставщик", cell: (r) => r.supplier },
    { key: "city", header: "Город / Площадка", cell: (r) => (
      <div className="flex flex-col">
        <span className="text-sm">{r.city}</span>
        <span className="text-xs text-muted-foreground">{r.venue}</span>
      </div>
    )},
    { key: "date", header: "Дата", cell: (r) => formatDate(r.date) },
    { key: "source", header: "Inventory", cell: (r) => (
      <div className="flex flex-col gap-1">
        <SourceBadge source={r.inventorySource} />
        <SalesModeBadge mode={r.salesMode} />
      </div>
    )},
    { key: "sync", header: "Sync", cell: (r) => (
      <div className="flex flex-col gap-1">
        <SyncStatusBadge status={r.syncStatus} />
        {r.hasOverrides && (
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400">
            <Pencil className="w-3 h-3" /> override
          </span>
        )}
      </div>
    )},
    { key: "issues", header: "Качество / SEO", cell: (r) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Q:</span>
          <IssueCount issues={r.qualityIssues} />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">SEO:</span>
          <IssueCount issues={r.seoIssues} />
        </div>
      </div>
    )},
    { key: "price", header: "Цена / Продано", cell: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{formatCurrency(r.ticketPrice)}</span>
        <span className="text-xs text-muted-foreground">{r.soldCount.toLocaleString()} продано</span>
      </div>
    )},
    { key: "status", header: "Publish", cell: (r) => <StatusBadge status={r.publishState} /> },
  ];

  return (
    <AdminLayout
      title="События"
      breadcrumbs={[{ label: "Администратор" }, { label: "События" }]}
    >
      <PageHeader
        title="События"
        description={`${mockEvents.length} событий — операторский слой над всеми каналами`}
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-export-events">
              <Download className="w-4 h-4 mr-1.5" /> Экспорт
            </Button>
            <Button size="sm" data-testid="button-create-event">
              <Plus className="w-4 h-4 mr-1.5" /> Создать событие
            </Button>
          </>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Название, город, поставщик, external ID..."
        filters={
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44" data-testid="select-status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="published">Опубликованы</SelectItem>
                <SelectItem value="draft">Черновики</SelectItem>
                <SelectItem value="pending">На модерации</SelectItem>
                <SelectItem value="rejected">Отклонены</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-44" data-testid="select-source-filter">
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
          </>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/events/${r.id}`)}
        emptyMessage="Нет событий по заданным фильтрам"
        data-testid="table-events"
      />

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Lock className="w-3 h-3" /> read-only поля от источника</span>
        <span className="inline-flex items-center gap-1"><Pencil className="w-3 h-3" /> override — есть локальные правки</span>
      </div>
    </AdminLayout>
  );
}
