import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit2 } from "lucide-react";

const mockBlock = {
  id: "PRB-001",
  title: "Летние фестивали — главный баннер",
  type: "banner",
  position: "hero",
  status: "active",
  landingId: "LND-001",
  landingTitle: "Главная страница Алматы",
  startsAt: "2025-05-01",
  endsAt: "2025-08-31",
  priority: 1,
  imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
  ctaText: "Смотреть события",
  ctaUrl: "/events?tag=festival",
  createdAt: "2025-04-01",
  updatedAt: "2025-04-15",
};

export default function PromoBlockDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout
      title={mockBlock.title}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Промо-блоки", href: "/admin/promo-blocks" },
        { label: mockBlock.title },
      ]}
    >
      <PageHeader
        title={mockBlock.title}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/promo-blocks")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-promo-block">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={mockBlock.id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockBlock.status} />} />
          <DetailField label="Заголовок" value={mockBlock.title} />
          <DetailField label="Тип" value={mockBlock.type} />
          <DetailField label="Позиция" value={mockBlock.position} />
          <DetailField label="Приоритет" value={mockBlock.priority} />
        </DetailSection>

        <DetailSection title="Привязка и период">
          <DetailField label="Лендинг" value={mockBlock.landingTitle} readOnly />
          <DetailField label="Начало" value={mockBlock.startsAt ? formatDate(mockBlock.startsAt) : "Не задано"} />
          <DetailField label="Конец" value={mockBlock.endsAt ? formatDate(mockBlock.endsAt) : "Не задано"} />
        </DetailSection>

        <DetailSection title="CTA и медиа">
          <DetailField label="Текст кнопки" value={mockBlock.ctaText} />
          <DetailField label="Ссылка кнопки" value={mockBlock.ctaUrl} />
        </DetailSection>

        {mockBlock.imageUrl && (
          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Изображение</h3>
            <img
              src={mockBlock.imageUrl}
              alt="Promo block preview"
              className="rounded-md max-h-48 object-cover w-full"
            />
          </div>
        )}

        <DetailSection title="Служебные поля">
          <DetailField label="Создан" value={formatDate(mockBlock.createdAt)} readOnly />
          <DetailField label="Обновлён" value={formatDate(mockBlock.updatedAt)} readOnly />
        </DetailSection>
      </div>
    </AdminLayout>
  );
}
