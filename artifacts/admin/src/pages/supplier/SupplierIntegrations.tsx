import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DetailField, DetailSection } from "@/components/shared/DetailField";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { SyncStatusBadge } from "@/components/shared/SyncStatusBadge";
import { IssueList, type Issue } from "@/components/shared/IssueList";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { RefreshCw, Plug } from "lucide-react";

const integrations = [
  {
    id: "INT-01",
    name: "Ticketon mirror",
    source: "imported" as const,
    status: "ok" as const,
    eventsCount: 8,
    lastSyncAt: "2026-04-21T08:15:00Z",
    nextSyncAt: "2026-04-21T08:30:00Z",
    syncFrequency: "Каждые 15 минут",
    diagnostics: [] as Issue[],
  },
  {
    id: "INT-02",
    name: "Ticketscloud API",
    source: "api" as const,
    status: "stale" as const,
    eventsCount: 3,
    lastSyncAt: "2026-04-21T02:00:00Z",
    nextSyncAt: "2026-04-21T08:30:00Z",
    syncFrequency: "Каждые 30 минут",
    diagnostics: [
      { severity: "warning", message: "Последняя синхронизация была 6 часов назад" },
      { severity: "info", message: "Проверьте ваш API token в настройках" },
    ] as Issue[],
  },
];

export default function SupplierIntegrations() {
  return (
    <SupplierLayout title="Интеграции" breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Интеграции" }]}>
      <PageHeader
        title="Интеграции"
        description="Подключённые источники инвентаря и их статус"
      />

      <div className="flex flex-col gap-4">
        {integrations.map((int) => (
          <div key={int.id} className="bg-card border border-card-border rounded-lg" data-testid={`integration-${int.id}`}>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center">
                  <Plug className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">{int.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <SourceBadge source={int.source} />
                    <SyncStatusBadge status={int.status} />
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid={`button-resync-${int.id}`}>
                <RefreshCw className="w-4 h-4 mr-1.5" /> Запустить синхронизацию
              </Button>
            </div>
            <div className="p-5">
              <DetailSection title="Параметры">
                <DetailField label="ID интеграции" value={int.id} readOnly />
                <DetailField label="События" value={int.eventsCount} readOnly />
                <DetailField label="Частота" value={int.syncFrequency} readOnly />
                <DetailField label="Последняя синхронизация" value={formatDateTime(int.lastSyncAt)} readOnly />
                <DetailField label="Следующая синхронизация" value={formatDateTime(int.nextSyncAt)} readOnly />
              </DetailSection>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Диагностика</h4>
                <IssueList issues={int.diagnostics} emptyMessage="Проблем не обнаружено" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SupplierLayout>
  );
}
