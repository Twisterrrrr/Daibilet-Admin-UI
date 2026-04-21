import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";

const mockCity = {
  id: "CTY-001",
  name: "Almaty",
  nameRu: "Алматы",
  nameKk: "Алматы",
  country: "Kazakhstan",
  countryCode: "KZ",
  timezone: "Asia/Almaty",
  status: "active",
  lat: "43.2220",
  lng: "76.8512",
  importedSource: "geonames",
  sourceId: "1526273",
};

export default function CityDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout
      title={mockCity.nameRu}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Города", href: "/admin/cities" },
        { label: mockCity.nameRu },
      ]}
    >
      <PageHeader
        title={mockCity.nameRu}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/cities")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-city">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={mockCity.id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockCity.status} />} />
          <DetailField label="Название (EN)" value={mockCity.name} readOnly />
          <DetailField label="Название (RU)" value={mockCity.nameRu} />
          <DetailField label="Название (KK)" value={mockCity.nameKk} />
          <DetailField label="Страна" value={`${mockCity.country} (${mockCity.countryCode})`} readOnly />
          <DetailField label="Часовой пояс" value={mockCity.timezone} readOnly />
        </DetailSection>
        <DetailSection title="Геолокация">
          <DetailField label="Широта" value={mockCity.lat} readOnly />
          <DetailField label="Долгота" value={mockCity.lng} readOnly />
        </DetailSection>
        <DetailSection title="Источник импорта">
          <DetailField label="Источник" value={mockCity.importedSource} readOnly />
          <DetailField label="ID в источнике" value={mockCity.sourceId} readOnly />
        </DetailSection>
      </div>
    </AdminLayout>
  );
}
