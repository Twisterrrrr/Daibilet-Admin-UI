import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download } from "lucide-react";

interface Event {
  id: string;
  title: string;
  city: string;
  venue: string;
  supplier: string;
  date: string;
  status: string;
  ticketPrice: number;
  soldCount: number;
}

const mockEvents: Event[] = [
  { id: "EVT-001", title: "Ночь музыки 2025", city: "Алматы", venue: "Алатау Арена", supplier: "ArtPro Kazakhstan", date: "2025-05-15", status: "published", ticketPrice: 9000, soldCount: 412 },
  { id: "EVT-002", title: "Forum на Arena", city: "Астана", venue: "Barys Arena", supplier: "Star Events", date: "2025-06-02", status: "published", ticketPrice: 21500, soldCount: 128 },
  { id: "EVT-003", title: "Stand Up Night", city: "Алматы", venue: "Мега Silk Way", supplier: "Comedy House", date: "2025-05-20", status: "draft", ticketPrice: 4500, soldCount: 0 },
  { id: "EVT-004", title: "Astana Jazz", city: "Астана", venue: "Конгресс Холл", supplier: "JazzMedia", date: "2025-07-10", status: "published", ticketPrice: 15000, soldCount: 237 },
  { id: "EVT-005", title: "Детский фестиваль", city: "Шымкент", venue: "Park Hall", supplier: "KidsFest LLP", date: "2025-05-31", status: "pending", ticketPrice: 3000, soldCount: 0 },
  { id: "EVT-006", title: "Рок-фестиваль RockZone", city: "Алматы", venue: "Алматы Арена", supplier: "ArtPro Kazakhstan", date: "2025-08-01", status: "draft", ticketPrice: 12000, soldCount: 0 },
];

export default function EventsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockEvents.filter((e) => {
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase()) ||
      e.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Event>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "title", header: "Название", cell: (r) => <span className="font-medium">{r.title}</span> },
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "venue", header: "Площадка", cell: (r) => r.venue },
    { key: "supplier", header: "Поставщик", cell: (r) => r.supplier },
    { key: "date", header: "Дата", cell: (r) => formatDate(r.date) },
    { key: "price", header: "Цена от", cell: (r) => formatCurrency(r.ticketPrice) },
    { key: "sold", header: "Продано", cell: (r) => r.soldCount.toLocaleString() },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <AdminLayout
      title="События"
      breadcrumbs={[{ label: "Администратор" }, { label: "События" }]}
    >
      <PageHeader
        title="События"
        description={`${mockEvents.length} событий в системе`}
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
        searchPlaceholder="Поиск по названию, городу, поставщику..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="published">Опубликованы</SelectItem>
              <SelectItem value="draft">Черновики</SelectItem>
              <SelectItem value="pending">На модерации</SelectItem>
              <SelectItem value="cancelled">Отменены</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/events/${r.id}`)}
        emptyMessage="Нет событий по заданным фильтрам"
        data-testid="table-events"
      />
    </AdminLayout>
  );
}
