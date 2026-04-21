import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit2, ExternalLink } from "lucide-react";

const mockSupplier = {
  id: "SUP-01",
  name: "ArtPro Kazakhstan",
  legalName: 'ТОО "АртПро Казахстан"',
  bin: "180940001234",
  city: "Алматы",
  address: "ул. Жибек Жолы, 48, офис 305",
  contactEmail: "info@artpro.kz",
  contactPhone: "+7 727 355-66-77",
  website: "https://artpro.kz",
  status: "active",
  managerName: "Нурланов Ерлан",
  managerEmail: "e.nurlanov@artpro.kz",
  createdAt: "2024-01-15",
  updatedAt: "2025-04-10",
};

const mockEvents = [
  { id: "EVT-001", title: "Ночь музыки 2025", date: "2025-05-15", status: "published", soldCount: 412 },
  { id: "EVT-006", title: "Рок-фестиваль RockZone", date: "2025-08-01", status: "draft", soldCount: 0 },
];

interface EventRow { id: string; title: string; date: string; status: string; soldCount: number; }
const eventColumns: Column<EventRow>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
  { key: "title", header: "Название", cell: (r) => <span className="font-medium">{r.title}</span> },
  { key: "date", header: "Дата", cell: (r) => formatDate(r.date) },
  { key: "sold", header: "Продано", cell: (r) => r.soldCount },
  { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
];

export default function SupplierDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout
      title={mockSupplier.name}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Поставщики", href: "/admin/suppliers" },
        { label: mockSupplier.name },
      ]}
    >
      <PageHeader
        title={mockSupplier.name}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/suppliers")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-supplier">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={mockSupplier.id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockSupplier.status} />} />
          <DetailField label="Торговое название" value={mockSupplier.name} />
          <DetailField label="Юридическое название" value={mockSupplier.legalName} readOnly />
          <DetailField label="БИН" value={mockSupplier.bin} readOnly />
          <DetailField label="Дата регистрации" value={formatDate(mockSupplier.createdAt)} readOnly />
        </DetailSection>

        <DetailSection title="Контакты">
          <DetailField label="E-mail" value={mockSupplier.contactEmail} />
          <DetailField label="Телефон" value={mockSupplier.contactPhone} />
          <DetailField label="Сайт" value={
            mockSupplier.website ? (
              <a href={mockSupplier.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                {mockSupplier.website} <ExternalLink className="w-3 h-3" />
              </a>
            ) : "—"
          } />
          <DetailField label="Менеджер" value={mockSupplier.managerName} />
          <DetailField label="Email менеджера" value={mockSupplier.managerEmail} />
        </DetailSection>

        <DetailSection title="Адрес">
          <DetailField label="Город" value={mockSupplier.city} readOnly />
          <DetailField label="Адрес" value={mockSupplier.address} readOnly />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              События поставщика ({mockEvents.length})
            </h3>
          </div>
          <DataTable
            columns={eventColumns}
            data={mockEvents}
            onRowClick={(r) => setLocation(`/admin/events/${r.id}`)}
            emptyMessage="Нет событий"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
