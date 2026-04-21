import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";

const mockVenue = {
  id: "VEN-001",
  name: "Алатау Арена",
  slug: "alatau-arena",
  city: "Алматы",
  address: "ул. Алтынсарина, 31",
  lat: "43.2364",
  lng: "76.8978",
  capacity: 12000,
  status: "active",
  phone: "+7 727 222-33-44",
  website: "https://alatauarena.kz",
  importedSource: "ticketon.kz",
  sourceId: "VEN-KZT-44",
  description: "Многофункциональный спортивно-концертный комплекс в Алматы.",
};

export default function VenueDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout
      title={mockVenue.name}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Площадки", href: "/admin/venues" },
        { label: mockVenue.name },
      ]}
    >
      <PageHeader
        title={mockVenue.name}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/venues")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-venue">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={mockVenue.id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockVenue.status} />} />
          <DetailField label="Название" value={mockVenue.name} readOnly />
          <DetailField label="Слаг" value={mockVenue.slug} readOnly />
          <DetailField label="Вместимость" value={mockVenue.capacity.toLocaleString()} readOnly />
        </DetailSection>

        <DetailSection title="Расположение">
          <DetailField label="Город" value={mockVenue.city} readOnly />
          <DetailField label="Адрес" value={mockVenue.address} readOnly />
          <DetailField label="Широта" value={mockVenue.lat} readOnly />
          <DetailField label="Долгота" value={mockVenue.lng} readOnly />
        </DetailSection>

        <DetailSection title="Контакты">
          <DetailField label="Телефон" value={mockVenue.phone} readOnly />
          <DetailField label="Веб-сайт" value={
            <a href={mockVenue.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {mockVenue.website}
            </a>
          } readOnly />
        </DetailSection>

        <DetailSection title="Источник импорта">
          <DetailField label="Источник" value={mockVenue.importedSource} readOnly />
          <DetailField label="ID в источнике" value={mockVenue.sourceId} readOnly />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Описание</h3>
          <p className="text-sm text-foreground leading-relaxed">{mockVenue.description}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
