import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SourceBadge, SalesModeBadge } from "@/components/shared/SourceBadge";
import { SyncStatusBadge } from "@/components/shared/SyncStatusBadge";
import { IssueList, type Issue } from "@/components/shared/IssueList";
import { Tabs } from "@/components/shared/Tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Edit2, RefreshCw, Lock, Pencil } from "lucide-react";

const mockEvent = {
  id: "EVT-001",
  title: "Ночь музыки 2025",
  slug: "noch-muzyki-2025",
  city: "Алматы",
  venue: "Алатау Арена",
  venueId: "VEN-12",
  supplier: "ArtPro Kazakhstan",
  supplierId: "SUP-01",
  startDate: "2025-05-15T20:00:00Z",
  endDate: "2025-05-15T23:00:00Z",
  publishState: "published",
  minPrice: 9000,
  maxPrice: 25000,
  soldCount: 412,
  capacity: 800,
  category: "Музыка",
  ageRating: "16+",
  inventorySource: "imported" as const,
  salesMode: "internal_checkout" as const,
  externalSource: "ticketon.kz",
  externalId: "TKT-98221",
  externalUrl: "https://ticketon.kz/events/TKT-98221",
  syncStatus: "ok" as const,
  lastSyncAt: "2026-04-21T08:15:00Z",
  syncFrequency: "Каждые 15 минут",
  hasOverrides: true,
  overriddenFields: ["title", "description", "metaTitle"],
  createdAt: "2025-03-10T12:00:00Z",
  updatedAt: "2025-04-18T09:30:00Z",
  description: "Ежегодный фестиваль классической и джазовой музыки в исполнении лучших оркестров Казахстана и мира.",
  metaTitle: "Ночь музыки 2025 — Алматы | Daibilet",
  metaDescription: "Купить билеты",
  ogImage: null as string | null,
};

const seoIssues: Issue[] = [
  { severity: "warning", message: "meta description короче 50 символов", field: "metaDescription" },
  { severity: "warning", message: "не задан og:image", field: "ogImage" },
];
const qualityIssues: Issue[] = [
  { severity: "info", message: "продано 51% от capacity" },
];

const auditLog = [
  { ts: "2026-04-21T08:15:00Z", actor: "system/sync", action: "sync OK от ticketon.kz" },
  { ts: "2026-04-18T09:30:00Z", actor: "admin@daibilet.kz", action: "override title и metaTitle" },
  { ts: "2025-03-10T12:00:00Z", actor: "system/import", action: "import создан из ticketon.kz" },
];

export default function EventDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const eventId = params?.id ?? mockEvent.id;
  const isImported = mockEvent.inventorySource !== "manual";

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
        description={
          <span className="inline-flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{eventId}</span>
            <SourceBadge source={mockEvent.inventorySource} />
            <SalesModeBadge mode={mockEvent.salesMode} />
            <SyncStatusBadge status={mockEvent.syncStatus} />
            <StatusBadge status={mockEvent.publishState} />
          </span>
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/events")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            {isImported && (
              <Button variant="outline" size="sm" data-testid="button-resync">
                <RefreshCw className="w-4 h-4 mr-1.5" /> Пересинхронизировать
              </Button>
            )}
            <Button size="sm" data-testid="button-edit-event">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />

      {isImported && (
        <Alert className="mb-4">
          <Lock className="w-4 h-4" />
          <AlertDescription>
            Источник <strong>{mockEvent.externalSource}</strong> владеет основными полями. Локальные правки сохраняются как override и применяются поверх данных источника.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { key: "overview", label: "Обзор" },
          { key: "source", label: "Источник / Sync" },
          { key: "content", label: "Контент" },
          { key: "seo", label: "SEO", count: seoIssues.length || undefined },
          { key: "quality", label: "Качество", count: qualityIssues.filter((i) => i.severity !== "info").length || undefined },
          { key: "audit", label: "Аудит" },
        ]}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Основная информация">
            <DetailField label="ID" value={eventId} readOnly />
            <DetailField label="Слаг" value={mockEvent.slug} readOnly={isImported && !mockEvent.overriddenFields.includes("slug")} />
            <DetailField label="Категория" value={mockEvent.category} readOnly={isImported} />
            <DetailField label="Возрастное ограничение" value={mockEvent.ageRating} />
            <DetailField label="Publish state" value={<StatusBadge status={mockEvent.publishState} />} />
            <DetailField label="Inventory source" value={<SourceBadge source={mockEvent.inventorySource} />} />
          </DetailSection>

          <DetailSection title="Дата и место">
            <DetailField label="Начало" value={formatDateTime(mockEvent.startDate)} readOnly={isImported} />
            <DetailField label="Окончание" value={formatDateTime(mockEvent.endDate)} readOnly={isImported} />
            <DetailField
              label="Город"
              value={mockEvent.city}
              readOnly={isImported}
            />
            <DetailField
              label="Площадка"
              value={
                <button
                  className="text-primary hover:underline text-sm"
                  onClick={() => setLocation(`/admin/venues/${mockEvent.venueId}`)}
                >
                  {mockEvent.venue}
                </button>
              }
              readOnly={isImported}
            />
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
            <DetailField label="Sales mode" value={<SalesModeBadge mode={mockEvent.salesMode} />} />
            <DetailField label="Цена от" value={formatCurrency(mockEvent.minPrice)} readOnly={isImported} />
            <DetailField label="Цена до" value={formatCurrency(mockEvent.maxPrice)} readOnly={isImported} />
            <DetailField label="Продано билетов" value={`${mockEvent.soldCount} / ${mockEvent.capacity}`} readOnly />
          </DetailSection>
        </div>
      )}

      {tab === "source" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Источник инвентаря">
            <DetailField label="Inventory source" value={<SourceBadge source={mockEvent.inventorySource} />} />
            <DetailField label="Sales mode" value={<SalesModeBadge mode={mockEvent.salesMode} />} />
            <DetailField label="External source" value={mockEvent.externalSource} readOnly />
            <DetailField label="External ID" value={<span className="font-mono text-xs">{mockEvent.externalId}</span>} readOnly />
            <DetailField
              label="External URL"
              value={
                <a href={mockEvent.externalUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs">
                  {mockEvent.externalUrl}
                </a>
              }
              readOnly
            />
          </DetailSection>

          <DetailSection title="Sync статус">
            <DetailField label="Статус" value={<SyncStatusBadge status={mockEvent.syncStatus} />} />
            <DetailField label="Последняя синхронизация" value={formatDateTime(mockEvent.lastSyncAt)} readOnly />
            <DetailField label="Частота" value={mockEvent.syncFrequency} readOnly />
            <DetailField label="Создано" value={formatDateTime(mockEvent.createdAt)} readOnly />
            <DetailField label="Обновлено" value={formatDateTime(mockEvent.updatedAt)} readOnly />
          </DetailSection>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Локальные override-поля
            </h3>
            {mockEvent.hasOverrides && mockEvent.overriddenFields.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {mockEvent.overriddenFields.map((f) => (
                  <li key={f} className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-mono">
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Override-полей нет — данные полностью от источника.</p>
            )}
          </div>
        </div>
      )}

      {tab === "content" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Описание и медиа">
            <DetailField
              label="Описание"
              value={<span className="block whitespace-pre-line">{mockEvent.description}</span>}
              className="sm:col-span-2 lg:col-span-3"
            />
            <DetailField label="og:image" value={mockEvent.ogImage ?? "—"} />
          </DetailSection>
        </div>
      )}

      {tab === "seo" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="SEO meta">
            <DetailField label="Slug" value={mockEvent.slug} />
            <DetailField label="Meta title" value={mockEvent.metaTitle} />
            <DetailField label="Meta description" value={mockEvent.metaDescription} className="sm:col-span-2" />
            <DetailField label="og:image" value={mockEvent.ogImage ?? "—"} />
          </DetailSection>
          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">SEO проблемы</h3>
            <IssueList issues={seoIssues} emptyMessage="SEO проблем не обнаружено" />
          </div>
        </div>
      )}

      {tab === "quality" && (
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">Контроль качества</h3>
          <IssueList issues={qualityIssues} emptyMessage="Замечаний по качеству нет" />
        </div>
      )}

      {tab === "audit" && (
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">История изменений</h3>
          <ul className="flex flex-col gap-3">
            {auditLog.map((entry, i) => (
              <li key={i} className="text-sm border-l-2 border-border pl-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDateTime(entry.ts)}</span>
                  <span>·</span>
                  <span className="font-mono">{entry.actor}</span>
                </div>
                <p>{entry.action}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
}
