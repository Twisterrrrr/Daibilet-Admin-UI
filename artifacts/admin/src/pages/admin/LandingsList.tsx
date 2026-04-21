import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Plus, ExternalLink } from "lucide-react";

interface Landing {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  cityId: string | null;
  createdAt: string;
  updatedAt: string;
}

const mockLandings: Landing[] = [
  { id: "LND-001", title: "Главная страница Алматы", slug: "almaty", type: "city", status: "published", cityId: "CTY-001", createdAt: "2024-01-10", updatedAt: "2025-04-01" },
  { id: "LND-002", title: "Концерты Алматы — весна 2025", slug: "concerts-almaty-spring-2025", type: "collection", status: "published", cityId: "CTY-001", createdAt: "2025-02-15", updatedAt: "2025-04-15" },
  { id: "LND-003", title: "Astana Events Hub", slug: "astana", type: "city", status: "published", cityId: "CTY-002", createdAt: "2024-01-10", updatedAt: "2025-03-20" },
  { id: "LND-004", title: "Фестивали лета 2025", slug: "summer-festivals-2025", type: "promo", status: "draft", cityId: null, createdAt: "2025-04-18", updatedAt: "2025-04-18" },
];

export default function LandingsList() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filtered = mockLandings.filter((l) =>
    !search ||
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.slug.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Landing>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "title", header: "Заголовок", cell: (r) => <span className="font-medium">{r.title}</span> },
    { key: "slug", header: "Слаг", cell: (r) => (
      <span className="font-mono text-xs text-muted-foreground">{r.slug}</span>
    )},
    { key: "type", header: "Тип", cell: (r) => r.type },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "updated", header: "Обновлён", cell: (r) => formatDate(r.updatedAt) },
    { key: "actions", header: "", cell: (r) => (
      r.status === "published" ? (
        <a
          href={`/landings/${r.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : null
    )},
  ];

  return (
    <AdminLayout
      title="Лендинги"
      breadcrumbs={[{ label: "Администратор" }, { label: "Лендинги" }]}
    >
      <PageHeader
        title="Лендинги"
        description={`${mockLandings.length} лендингов`}
        actions={
          <Button size="sm" data-testid="button-create-landing">
            <Plus className="w-4 h-4 mr-1.5" /> Создать лендинг
          </Button>
        }
      />
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по заголовку или слагу..." />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/landings/${r.id}`)}
        emptyMessage="Лендинги не найдены"
        data-testid="table-landings"
      />
    </AdminLayout>
  );
}
