import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit2, Eye } from "lucide-react";

const mockLanding = {
  id: "LND-001",
  title: "Главная страница Алматы",
  slug: "almaty",
  type: "city",
  status: "published",
  metaTitle: "Концерты и события в Алматы — Daibilet",
  metaDescription: "Все события Алматы: концерты, фестивали, театр, спорт. Купи билеты онлайн.",
  cityId: "CTY-001",
  cityName: "Алматы",
  h1: "События в Алматы",
  introText: "Крупнейший агрегатор билетов в Казахстане. Концерты, театр, фестивали и спортивные события.",
  createdAt: "2024-01-10",
  updatedAt: "2025-04-01",
};

export default function LandingDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout
      title={mockLanding.title}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Лендинги", href: "/admin/landings" },
        { label: mockLanding.title },
      ]}
    >
      <PageHeader
        title={mockLanding.title}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/landings")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            {mockLanding.status === "published" && (
              <Button variant="outline" size="sm" data-testid="button-preview-landing">
                <Eye className="w-4 h-4 mr-1.5" /> Просмотр
              </Button>
            )}
            <Button size="sm" data-testid="button-edit-landing">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={mockLanding.id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockLanding.status} />} />
          <DetailField label="Заголовок" value={mockLanding.title} />
          <DetailField label="Слаг" value={mockLanding.slug} />
          <DetailField label="Тип" value={mockLanding.type} readOnly />
          <DetailField label="Город" value={mockLanding.cityName} readOnly />
        </DetailSection>

        <DetailSection title="SEO">
          <DetailField label="Meta Title" value={mockLanding.metaTitle} />
          <DetailField label="Meta Description" value={mockLanding.metaDescription} className="sm:col-span-2 lg:col-span-2" />
          <DetailField label="H1" value={mockLanding.h1} />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">Вводный текст</h3>
          <p className="text-sm text-foreground leading-relaxed">{mockLanding.introText}</p>
        </div>

        <DetailSection title="Служебные поля">
          <DetailField label="Создан" value={formatDate(mockLanding.createdAt)} readOnly />
          <DetailField label="Обновлён" value={formatDate(mockLanding.updatedAt)} readOnly />
        </DetailSection>
      </div>
    </AdminLayout>
  );
}
