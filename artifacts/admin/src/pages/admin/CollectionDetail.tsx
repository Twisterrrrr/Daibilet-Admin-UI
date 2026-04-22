import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/shared/DataTable";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit2, GripVertical } from "lucide-react";

const mockCollection = {
  id: "COL-08",
  title: "Лето 2025",
  slug: "leto-2025",
  status: "published",
  pinned: true,
  description: "Самые ожидаемые события лета 2025 года.",
  events: [
    { id: "EVT-001", order: 1, title: "Ночь музыки 2025", city: "Москва", date: "2025-05-15", status: "published" },
    { id: "EVT-002", order: 2, title: "Forum на Arena", city: "Санкт-Петербург", date: "2025-06-02", status: "published" },
    { id: "EVT-004", order: 3, title: "Saint Petersburg Jazz", city: "Санкт-Петербург", date: "2025-07-10", status: "published" },
  ],
};

export default function CollectionDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const id = params?.id ?? mockCollection.id;

  type EventRow = typeof mockCollection.events[number];
  const eventColumns: Column<EventRow>[] = [
    { key: "order", header: "#", cell: (r) => (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <GripVertical className="w-3 h-3" /> {r.order}
      </span>
    )},
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "title", header: "Название", cell: (r) => r.title },
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "date", header: "Дата", cell: (r) => formatDate(r.date) },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <AdminLayout
      title={mockCollection.title}
      breadcrumbs={[{ label: "Администратор" }, { label: "Подборки", href: "/admin/collections" }, { label: mockCollection.title }]}
    >
      <PageHeader
        title={mockCollection.title}
        description={id}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/collections")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-collection">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-4">
        <DetailSection title="Информация">
          <DetailField label="ID" value={id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockCollection.status} />} />
          <DetailField label="Slug" value={mockCollection.slug} />
          <DetailField label="Закреплена" value={mockCollection.pinned ? "Да" : "Нет"} />
          <DetailField label="Описание" value={mockCollection.description} className="sm:col-span-2 lg:col-span-3" />
        </DetailSection>
        <div className="bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">События в подборке ({mockCollection.events.length})</h3>
            <Button size="sm" variant="outline" data-testid="button-add-event-to-collection">Добавить событие</Button>
          </div>
          <DataTable
            columns={eventColumns}
            data={mockCollection.events}
            onRowClick={(r) => setLocation(`/admin/events/${r.id}`)}
            emptyMessage="Подборка пуста"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
