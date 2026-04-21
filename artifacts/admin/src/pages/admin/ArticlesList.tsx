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

interface Article {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: "draft" | "published";
  views: number;
  publishedAt?: string;
  updatedAt: string;
}

const mockArticles: Article[] = [
  { id: "ART-12", title: "Топ-10 концертов мая в Алматы", slug: "top-10-koncertov-maya-almaty", author: "editor@daibilet.kz", status: "published", views: 4821, publishedAt: "2025-04-15T10:00:00Z", updatedAt: "2025-04-15T10:00:00Z" },
  { id: "ART-11", title: "Гид по фестивалям Казахстана 2025", slug: "festivali-kz-2025", author: "editor@daibilet.kz", status: "published", views: 9120, publishedAt: "2025-04-01T09:00:00Z", updatedAt: "2025-04-08T14:00:00Z" },
  { id: "ART-10", title: "Как выбрать билет: лайфхаки", slug: "kak-vybrat-bilet", author: "marketing@daibilet.kz", status: "draft", views: 0, updatedAt: "2025-04-20T16:00:00Z" },
];

export default function ArticlesList() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const filtered = mockArticles.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.slug.includes(search.toLowerCase())
  );
  const columns: Column<Article>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "title", header: "Заголовок", cell: (r) => (
      <div>
        <p className="font-medium">{r.title}</p>
        <p className="text-xs text-muted-foreground font-mono">/{r.slug}</p>
      </div>
    )},
    { key: "author", header: "Автор", cell: (r) => r.author },
    { key: "views", header: "Просмотры", cell: (r) => r.views.toLocaleString() },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "published", header: "Опубликовано", cell: (r) => r.publishedAt ? formatDateTime(r.publishedAt) : <span className="text-muted-foreground">—</span> },
  ];

  return (
    <AdminLayout title="Статьи / Блог" breadcrumbs={[{ label: "Администратор" }, { label: "Статьи / Блог" }]}>
      <PageHeader
        title="Статьи / Блог"
        description={`${mockArticles.length} статей`}
        actions={
          <Button size="sm" data-testid="button-create-article">
            <Plus className="w-4 h-4 mr-1.5" /> Создать статью
          </Button>
        }
      />
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по заголовку или slug..." />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/articles/${r.id}`)}
        emptyMessage="Статьи не найдены"
      />
    </AdminLayout>
  );
}
