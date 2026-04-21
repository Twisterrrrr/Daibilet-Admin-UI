import { useState } from "react";
import { useLocation } from "wouter";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { SyncStatusBadge } from "@/components/shared/SyncStatusBadge";
import { Tabs } from "@/components/shared/Tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Lock, Send } from "lucide-react";

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
  inventorySource: "imported" as const,
  externalSource: "ticketon.kz",
  syncStatus: "ok" as const,
  description: "Ежегодный фестиваль классической и джазовой музыки.",
};

export default function SupplierEventDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [correction, setCorrection] = useState("");
  const isImported = mockEvent.inventorySource !== "manual";

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
        description={
          <span className="inline-flex items-center gap-2">
            <SourceBadge source={mockEvent.inventorySource} />
            <SyncStatusBadge status={mockEvent.syncStatus} />
            <StatusBadge status={mockEvent.status} />
          </span>
        }
        actions={
          <Button variant="outline" size="sm" onClick={() => setLocation("/supplier/events")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
          </Button>
        }
      />

      {isImported && (
        <Alert className="mb-4">
          <Lock className="w-4 h-4" />
          <AlertDescription>
            Это событие приходит из <strong>{mockEvent.externalSource}</strong>. Большинство полей доступны только для чтения. Если нужны правки — отправьте запрос на коррекцию во вкладке «Запрос на коррекцию».
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { key: "overview", label: "Обзор" },
          { key: "sales", label: "Продажи" },
          ...(isImported ? [{ key: "diagnostics", label: "Диагностика" }, { key: "correction", label: "Запрос на коррекцию" }] : []),
        ]}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Основная информация">
            <DetailField label="ID" value={mockEvent.id} readOnly />
            <DetailField label="Inventory" value={<SourceBadge source={mockEvent.inventorySource} />} />
            <DetailField label="Название" value={mockEvent.title} readOnly={isImported} />
            <DetailField label="Категория" value={mockEvent.category} readOnly={isImported} />
            <DetailField label="Возрастное ограничение" value={mockEvent.ageRating} />
          </DetailSection>

          <DetailSection title="Дата и место">
            <DetailField label="Дата" value={formatDate(mockEvent.startDate)} readOnly={isImported} />
            <DetailField label="Город" value={mockEvent.city} readOnly={isImported} />
            <DetailField label="Площадка" value={mockEvent.venue} readOnly={isImported} />
          </DetailSection>

          <DetailSection title="Билеты">
            <DetailField label="Цена от" value={formatCurrency(mockEvent.minPrice)} readOnly={isImported} />
            <DetailField label="Цена до" value={formatCurrency(mockEvent.maxPrice)} readOnly={isImported} />
            <DetailField label="Продано / Вместимость" value={`${mockEvent.soldCount} / ${mockEvent.capacity}`} readOnly />
          </DetailSection>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Описание</h3>
            <p className="text-sm leading-relaxed">{mockEvent.description}</p>
          </div>
        </div>
      )}

      {tab === "sales" && (
        <DetailSection title="Продажи">
          <DetailField label="Продано билетов" value={mockEvent.soldCount} readOnly />
          <DetailField label="Вместимость" value={mockEvent.capacity} readOnly />
          <DetailField label="Заполненность" value={`${Math.round((mockEvent.soldCount / mockEvent.capacity) * 100)}%`} readOnly />
          <DetailField label="Минимальная цена" value={formatCurrency(mockEvent.minPrice)} readOnly />
          <DetailField label="Выручка (оценка)" value={formatCurrency(mockEvent.soldCount * mockEvent.minPrice)} readOnly />
        </DetailSection>
      )}

      {tab === "diagnostics" && (
        <DetailSection title="Диагностика интеграции">
          <DetailField label="Источник" value={mockEvent.externalSource} readOnly />
          <DetailField label="Статус sync" value={<SyncStatusBadge status={mockEvent.syncStatus} />} />
          <DetailField label="Последняя синхронизация" value="21.04.2026, 08:15" readOnly />
        </DetailSection>
      )}

      {tab === "correction" && (
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
            <Send className="w-4 h-4" />
            Запрос на коррекцию
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Опишите, какие данные требуют правки. Запрос будет отправлен в команду Daibilet.
          </p>
          <Textarea
            placeholder="Например: дата концерта изменилась на 22 мая..."
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            rows={5}
            data-testid="textarea-correction"
          />
          <div className="mt-3 flex justify-end">
            <Button size="sm" disabled={!correction} data-testid="button-submit-correction">
              <Send className="w-4 h-4 mr-1.5" /> Отправить запрос
            </Button>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
}
