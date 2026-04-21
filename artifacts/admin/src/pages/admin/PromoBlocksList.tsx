import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

interface PromoBlock {
  id: string;
  title: string;
  type: string;
  position: string;
  status: string;
  landingId: string | null;
  startsAt: string | null;
  endsAt: string | null;
  priority: number;
}

const mockPromoBlocks: PromoBlock[] = [
  { id: "PRB-001", title: "Летние фестивали — главный баннер", type: "banner", position: "hero", status: "active", landingId: "LND-001", startsAt: "2025-05-01", endsAt: "2025-08-31", priority: 1 },
  { id: "PRB-002", title: "Подборка джазовых концертов", type: "collection", position: "section_1", status: "active", landingId: "LND-001", startsAt: null, endsAt: null, priority: 2 },
  { id: "PRB-003", title: "Рекомендации Алматы", type: "recommendation", position: "sidebar", status: "inactive", landingId: "LND-001", startsAt: null, endsAt: null, priority: 5 },
  { id: "PRB-004", title: "Акция: скидка 15% на weekend", type: "promo", position: "header_strip", status: "draft", landingId: null, startsAt: "2025-05-02", endsAt: "2025-05-04", priority: 1 },
];

export default function PromoBlocksList() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filtered = mockPromoBlocks.filter((b) =>
    !search ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<PromoBlock>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "title", header: "Заголовок", cell: (r) => <span className="font-medium">{r.title}</span> },
    { key: "type", header: "Тип", cell: (r) => r.type },
    { key: "position", header: "Позиция", cell: (r) => r.position },
    { key: "priority", header: "Приоритет", cell: (r) => r.priority },
    { key: "period", header: "Период", cell: (r) => (
      r.startsAt ? `${formatDate(r.startsAt)} — ${formatDate(r.endsAt)}` : "Без ограничений"
    )},
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <AdminLayout
      title="Промо-блоки"
      breadcrumbs={[{ label: "Администратор" }, { label: "Промо-блоки" }]}
    >
      <PageHeader
        title="Промо-блоки"
        description={`${mockPromoBlocks.length} блоков`}
        actions={
          <Button size="sm" data-testid="button-create-promo-block">
            <Plus className="w-4 h-4 mr-1.5" /> Создать блок
          </Button>
        }
      />
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Поиск по заголовку, типу..." />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/promo-blocks/${r.id}`)}
        emptyMessage="Промо-блоки не найдены"
        data-testid="table-promo-blocks"
      />
    </AdminLayout>
  );
}
