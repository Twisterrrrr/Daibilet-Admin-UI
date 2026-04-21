import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, Edit2 } from "lucide-react";

const mockArticle = {
  id: "ART-12",
  title: "Топ-10 концертов мая в Алматы",
  slug: "top-10-koncertov-maya-almaty",
  author: "editor@daibilet.kz",
  status: "published",
  views: 4821,
  publishedAt: "2025-04-15T10:00:00Z",
  updatedAt: "2025-04-15T10:00:00Z",
  metaTitle: "Топ-10 концертов мая в Алматы — обзор | Daibilet",
  metaDescription: "Подборка лучших музыкальных мероприятий Алматы на май 2025 года.",
  content: "В мае 2025 года Алматы ждёт насыщенный концертный сезон. В подборке — десять самых ярких событий…",
};

export default function ArticleDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const id = params?.id ?? mockArticle.id;
  return (
    <AdminLayout
      title={mockArticle.title}
      breadcrumbs={[{ label: "Администратор" }, { label: "Статьи / Блог", href: "/admin/articles" }, { label: mockArticle.title }]}
    >
      <PageHeader
        title={mockArticle.title}
        description={id}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/articles")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-article">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={id} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockArticle.status} />} />
          <DetailField label="Автор" value={mockArticle.author} />
          <DetailField label="Slug" value={mockArticle.slug} />
          <DetailField label="Просмотры" value={mockArticle.views.toLocaleString()} readOnly />
          <DetailField label="Опубликовано" value={formatDateTime(mockArticle.publishedAt)} readOnly />
        </DetailSection>
        <DetailSection title="SEO">
          <DetailField label="Meta title" value={mockArticle.metaTitle} className="sm:col-span-2 lg:col-span-3" />
          <DetailField label="Meta description" value={mockArticle.metaDescription} className="sm:col-span-2 lg:col-span-3" />
        </DetailSection>
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">Контент</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">{mockArticle.content}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
