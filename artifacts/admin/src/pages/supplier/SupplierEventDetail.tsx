import { useLocation } from "wouter";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Lock } from "lucide-react";

const mockEvent = {
  id: "EVT-001",
  title: "Ночь музыки 2025",
  city: "Алматы",
  venue: "Алатау Арена",
  startDate: "2025-05-15",
  status: "published",
  minPrice: 9000,
  maxPrice: 25000,
  soldCount: 412,
  capacity: 800,
  category: "Музыка",
  ageRating: "16+",
  isImported: true,
  importedSource: "ticketon.kz",
  description: "Ежегодный фестиваль классической и джазовой музыки.",
};

export default function SupplierEventDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();

  return (
    <SupplierLayout
      title={mockEvent.title}
      breadcrumbs={[
        { label: "Кабинет поставщика" },
        { label: "Мои события", href: "/supplier/events" },
        { label: mockEvent.title },
      ]}
    >
      <PageHeader
        title={mockEvent.title}
        actions={
          <Button variant="outline" size="sm" onClick={() => setLocation("/supplier/events")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
          </Button>
        }
      />

      {mockEvent.isImported && (
        <Alert className="mb-4">
          <Lock className="w-4 h-4" />
          <AlertDescription>
            Это событие импортировано из <strong>{mockEvent.importedSource}</strong>. Большинство полей доступны только для чтения.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={mockEvent.id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockEvent.status} />} />
          <DetailField label="Название" value={mockEvent.title} readOnly />
          <DetailField label="Категория" value={mockEvent.category} readOnly />
          <DetailField label="Возрастное ограничение" value={mockEvent.ageRating} />
        </DetailSection>

        <DetailSection title="Дата и место">
          <DetailField label="Дата начала" value={formatDate(mockEvent.startDate)} readOnly />
          <DetailField label="Город" value={mockEvent.city} readOnly />
          <DetailField label="Площадка" value={mockEvent.venue} readOnly />
        </DetailSection>

        <DetailSection title="Билеты">
          <DetailField label="Цена от" value={formatCurrency(mockEvent.minPrice)} readOnly />
          <DetailField label="Цена до" value={formatCurrency(mockEvent.maxPrice)} readOnly />
          <DetailField label="Продано / Вместимость" value={`${mockEvent.soldCount} / ${mockEvent.capacity}`} readOnly />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">Описание</h3>
          <p className="text-sm text-foreground leading-relaxed">{mockEvent.description}</p>
        </div>
      </div>
    </SupplierLayout>
  );
}
