import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { StatCard } from "@/components/shared/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type Level = "info" | "warn" | "error";

interface LogEntry {
  ts: string;
  level: Level;
  source: string;
  message: string;
  context?: string;
}

const mockLogs: LogEntry[] = [
  { ts: "2026-04-21T08:15:23Z", level: "info", source: "sync/ticketon", message: "Sync OK для EVT-001 (3 цены, 1 секция)", context: "TKT-98221" },
  { ts: "2026-04-21T08:14:11Z", level: "error", source: "sync/ticketscloud", message: "Connection timeout после 30s", context: "thr-882" },
  { ts: "2026-04-21T08:12:00Z", level: "warn", source: "checkout", message: "Платёж задержан более 60с — ЮKassa", context: "ORD-1041" },
  { ts: "2026-04-21T08:10:00Z", level: "info", source: "audit", message: "Override применён к EVT-001 (поля: title, metaTitle)", context: "admin@daibilet.ru" },
  { ts: "2026-04-21T08:05:00Z", level: "warn", source: "import/teplohod", message: "Sync stale более 6 часов", context: "ev-7711" },
  { ts: "2026-04-21T07:50:00Z", level: "error", source: "payment/kaspi", message: "Webhook signature invalid", context: "KP-482112230" },
  { ts: "2026-04-21T07:30:00Z", level: "info", source: "auth", message: "Поставщик SUP-04 успешно вошёл" },
  { ts: "2026-04-21T07:00:00Z", level: "info", source: "moderation", message: "EVT-005 подан на модерацию" },
];

const levelStyles: Record<Level, string> = {
  info: "text-blue-600 dark:text-blue-400",
  warn: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
};

export default function Logs() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const sources = Array.from(new Set(mockLogs.map((l) => l.source)));

  const filtered = mockLogs.filter((l) => {
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || (l.context?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchLevel = levelFilter === "all" || l.level === levelFilter;
    const matchSource = sourceFilter === "all" || l.source === sourceFilter;
    return matchSearch && matchLevel && matchSource;
  });

  const errorCount = mockLogs.filter((l) => l.level === "error").length;
  const warnCount = mockLogs.filter((l) => l.level === "warn").length;
  const infoCount = mockLogs.filter((l) => l.level === "info").length;

  const columns: Column<LogEntry>[] = [
    { key: "ts", header: "Время", cell: (r) => <span className="font-mono text-xs">{formatDateTime(r.ts)}</span> },
    { key: "level", header: "Уровень", cell: (r) => (
      <span className={`text-xs font-mono uppercase font-semibold ${levelStyles[r.level]}`}>
        {r.level}
      </span>
    )},
    { key: "source", header: "Источник", cell: (r) => <span className="font-mono text-xs">{r.source}</span> },
    { key: "message", header: "Сообщение", cell: (r) => r.message },
    { key: "context", header: "Контекст", cell: (r) => r.context ? <span className="font-mono text-xs text-muted-foreground">{r.context}</span> : <span className="text-muted-foreground">—</span> },
  ];

  return (
    <AdminLayout title="Логи / диагностика" breadcrumbs={[{ label: "Администратор" }, { label: "Логи / диагностика" }]}>
      <PageHeader
        title="Логи и диагностика"
        description="Системные события: sync, checkout, payment, moderation, audit"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Всего событий (24ч)" value={mockLogs.length} icon={Activity} />
        <StatCard label="Ошибок" value={errorCount} icon={AlertCircle} />
        <StatCard label="Предупреждений" value={warnCount} icon={AlertTriangle} />
        <StatCard label="Info" value={infoCount} icon={CheckCircle2} />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по сообщению или контексту..."
        filters={
          <>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-36" data-testid="select-log-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48" data-testid="select-log-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все источники</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <DataTable columns={columns} data={filtered} emptyMessage="Логов нет" data-testid="table-logs" />
    </AdminLayout>
  );
}
