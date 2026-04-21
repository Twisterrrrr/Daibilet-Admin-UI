import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DetailField, DetailSection } from "@/components/shared/DetailField";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { SyncStatusBadge, type SyncStatus } from "@/components/shared/SyncStatusBadge";
import { IssueList, type Issue } from "@/components/shared/IssueList";
import { FilterBar } from "@/components/shared/FilterBar";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { RefreshCw, Plug, Plus, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  source: "imported" | "api";
  supplier: string;
  supplierId: string;
  status: SyncStatus;
  eventsCount: number;
  lastSyncAt: string;
  nextSyncAt: string;
  syncFrequency: string;
  diagnostics: Issue[];
}

const integrations: Integration[] = [
  {
    id: "INT-01", name: "Ticketon mirror", source: "imported",
    supplier: "ArtPro Kazakhstan", supplierId: "SUP-01",
    status: "ok", eventsCount: 8,
    lastSyncAt: "2026-04-21T08:15:00Z", nextSyncAt: "2026-04-21T08:30:00Z",
    syncFrequency: "Каждые 15 минут", diagnostics: [],
  },
  {
    id: "INT-02", name: "Ticketscloud API", source: "api",
    supplier: "Star Events", supplierId: "SUP-02",
    status: "stale", eventsCount: 3,
    lastSyncAt: "2026-04-21T02:00:00Z", nextSyncAt: "2026-04-21T08:30:00Z",
    syncFrequency: "Каждые 30 минут",
    diagnostics: [
      { severity: "warning", message: "Последняя синхронизация была 6 часов назад" },
      { severity: "info", message: "Проверьте API token в настройках интеграции" },
    ],
  },
  {
    id: "INT-03", name: "Teplohod API", source: "api",
    supplier: "JazzMedia", supplierId: "SUP-04",
    status: "error", eventsCount: 5,
    lastSyncAt: "2026-04-21T07:50:00Z", nextSyncAt: "2026-04-21T08:35:00Z",
    syncFrequency: "Каждые 5 минут",
    diagnostics: [
      { severity: "critical", message: "HTTP 500 от teplohod.kz/api/events" },
      { severity: "warning", message: "Срок действия токена истекает через 7 дней" },
    ],
  },
];

export default function Integrations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = integrations.filter((i) => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const okCount = integrations.filter((i) => i.status === "ok").length;
  const errorCount = integrations.filter((i) => i.status === "error").length;
  const staleCount = integrations.filter((i) => i.status === "stale").length;
  const totalEvents = integrations.reduce((sum, i) => sum + i.eventsCount, 0);

  return (
    <AdminLayout title="Интеграции" breadcrumbs={[{ label: "Администратор" }, { label: "Интеграции" }]}>
      <PageHeader
        title="Интеграции"
        description="Подключённые источники инвентаря (mirror и API)"
        actions={
          <Button size="sm" data-testid="button-add-integration">
            <Plus className="w-4 h-4 mr-1.5" /> Подключить источник
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Подключено источников" value={integrations.length} icon={Plug} />
        <StatCard label="Sync OK" value={okCount} icon={CheckCircle2} />
        <StatCard label="Stale / устарели" value={staleCount} icon={Clock} />
        <StatCard label="Ошибки" value={errorCount} icon={AlertCircle} />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по имени или поставщику..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44" data-testid="select-integration-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="ok">Sync OK</SelectItem>
              <SelectItem value="stale">Устарели</SelectItem>
              <SelectItem value="error">С ошибками</SelectItem>
              <SelectItem value="syncing">Синхронизируются</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="flex flex-col gap-4">
        {filtered.map((int) => (
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
                    <span className="text-xs text-muted-foreground">
                      Поставщик: <span className="text-foreground">{int.supplier}</span>
                    </span>
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
                <DetailField label="Всего событий" value={int.eventsCount} readOnly />
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
    </AdminLayout>
  );
}
