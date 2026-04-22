import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { Plus } from "lucide-react";

interface Collection {
  id: string;
  title: string;
  slug: string;
  eventsCount: number;
  status: "draft" | "published";
  pinned: boolean;
  updatedAt: string;
}

const mockCollections: Collection[] = [
  { id: "COL-08", title: "Лето 2025", slug: "leto-2025", eventsCount: 24, status: "published", pinned: true, updatedAt: "2025-04-20T11:00:00Z" },
  { id: "COL-07", title: "Семейные мероприятия", slug: "family", eventsCount: 11, status: "published", pinned: false, updatedAt: "2025-04-15T11:00:00Z" },
  { id: "COL-06", title: "Концерты в Санкт-Петербурге", slug: "saint-petersburg-concerts", eventsCount: 7, status: "published", pinned: false, updatedAt: "2025-04-10T11:00:00Z" },
  { id: "COL-05", title: "Test draft", slug: "test-draft", eventsCount: 0, status: "draft", pinned: false, updatedAt: "2025-04-21T11:00:00Z" },
];

export default function CollectionsList() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const filtered = mockCollections.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()));
  const columns: Column<Collection>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "title", header: "Название", cell: (r) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{r.title}</span>
        {r.pinned && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">PINNED</span>}
      </div>
    )},
    { key: "slug", header: "Slug", cell: (r) => <span className="font-mono text-xs">{r.slug}</span> },
    { key: "events", header: "Событий", cell: (r) => r.eventsCount },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "updated", header: "Обновлено", cell: (r) => formatDateTime(r.updatedAt) },
  ];
  return (
    <AdminLayout title="Подборки" breadcrumbs={[{ label: "Администратор" }, { label: "Подборки" }]}>
      <PageHeader
        title="Подборки"
        description={`${mockCollections.length} подборок`}
        actions={
          <Button size="sm" data-testid="button-create-collection">
            <Plus className="w-4 h-4 mr-1.5" /> Создать подборку
          </Button>
        }
      />
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по названию..." />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/collections/${r.id}`)}
        emptyMessage="Подборки не найдены"
      />
    </AdminLayout>
  );
}
