import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Edit2 } from "lucide-react";

const mockEvent = {
  id: "EVT-001",
  title: "Ночь музыки 2025",
  slug: "noch-muzyki-2025",
  city: "Алматы",
  venue: "Алатау Арена",
  supplier: "ArtPro Kazakhstan",
  supplierId: "SUP-01",
  startDate: "2025-05-15",
  endDate: "2025-05-15",
  status: "published",
  minPrice: 9000,
  maxPrice: 25000,
  soldCount: 412,
  capacity: 800,
  category: "Музыка",
  ageRating: "16+",
  importedSource: "ticketon.kz",
  sourceId: "TKT-98221",
  createdAt: "2025-03-10T12:00:00Z",
  updatedAt: "2025-04-18T09:30:00Z",
  description: "Ежегодный фестиваль классической и джазовой музыки в исполнении лучших оркестров Казахстана и мира.",
};

export default function EventDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const eventId = params?.id ?? mockEvent.id;

  return (
    <AdminLayout
      title={mockEvent.title}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "События", href: "/admin/events" },
        { label: mockEvent.title },
      ]}
    >
      <PageHeader
        title={mockEvent.title}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/events")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-event">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={eventId} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockEvent.status} />} />
          <DetailField label="Название" value={mockEvent.title} readOnly />
          <DetailField label="Слаг" value={mockEvent.slug} readOnly />
          <DetailField label="Категория" value={mockEvent.category} readOnly />
          <DetailField label="Возрастное ограничение" value={mockEvent.ageRating} />
        </DetailSection>

        <DetailSection title="Дата и место">
          <DetailField label="Начало" value={formatDate(mockEvent.startDate)} readOnly />
          <DetailField label="Окончание" value={formatDate(mockEvent.endDate)} readOnly />
          <DetailField label="Город" value={mockEvent.city} readOnly />
          <DetailField label="Площадка" value={mockEvent.venue} readOnly />
        </DetailSection>

        <DetailSection title="Билеты и поставщик">
          <DetailField label="Поставщик" value={
            <button
              className="text-primary hover:underline text-sm"
              onClick={() => setLocation(`/admin/suppliers/${mockEvent.supplierId}`)}
            >
              {mockEvent.supplier}
            </button>
          } />
          <DetailField label="Цена от" value={formatCurrency(mockEvent.minPrice)} readOnly />
          <DetailField label="Цена до" value={formatCurrency(mockEvent.maxPrice)} readOnly />
          <DetailField label="Продано билетов" value={`${mockEvent.soldCount} / ${mockEvent.capacity}`} readOnly />
        </DetailSection>

        <DetailSection title="Источник импорта">
          <DetailField label="Источник" value={mockEvent.importedSource} readOnly />
          <DetailField label="ID в источнике" value={mockEvent.sourceId} readOnly />
          <DetailField label="Создано" value={formatDate(mockEvent.createdAt)} readOnly />
          <DetailField label="Обновлено" value={formatDate(mockEvent.updatedAt)} readOnly />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Описание</h3>
          <p className="text-sm text-foreground leading-relaxed">{mockEvent.description}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
