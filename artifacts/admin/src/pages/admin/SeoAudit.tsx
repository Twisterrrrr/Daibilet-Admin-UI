import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { StatCard } from "@/components/shared/StatCard";
import { IssueCount, type Issue } from "@/components/shared/IssueList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, AlertTriangle, CheckCircle2, Search } from "lucide-react";

interface AuditRow {
  id: string;
  entityType: "event" | "landing" | "venue" | "collection" | "article";
  entityTitle: string;
  url: string;
  issues: Issue[];
  score: number;
}

const mockAudits: AuditRow[] = [
  { id: "EVT-003", entityType: "event", entityTitle: "Stand Up Night", url: "/events/stand-up-night", score: 42, issues: [
    { severity: "critical", message: "не задан title" },
    { severity: "warning", message: "нет meta description" },
    { severity: "warning", message: "нет og:image" },
  ]},
  { id: "EVT-006", entityType: "event", entityTitle: "Рок-фестиваль RockZone", url: "/events/rock-zone", score: 65, issues: [
    { severity: "warning", message: "slug совпадает с другим событием" },
  ]},
  { id: "EVT-001", entityType: "event", entityTitle: "Ночь музыки 2025", url: "/events/noch-muzyki-2025", score: 78, issues: [
    { severity: "warning", message: "meta description короче 50 символов" },
    { severity: "warning", message: "не задан og:image" },
  ]},
  { id: "LND-02", entityType: "landing", entityTitle: "Лендинг Forum на Arena", url: "/landings/forum-arena", score: 91, issues: [
    { severity: "info", message: "можно увеличить плотность ключевых слов" },
  ]},
  { id: "ART-12", entityType: "article", entityTitle: "Топ-10 концертов мая в Алматы", url: "/blog/top-10", score: 96, issues: [] },
  { id: "VEN-12", entityType: "venue", entityTitle: "Алатау Арена", url: "/venues/alatau-arena", score: 88, issues: [] },
];

const entityLabels: Record<string, string> = {
  event: "Событие", landing: "Лендинг", venue: "Площадка", collection: "Подборка", article: "Статья",
};

export default function SeoAudit() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockAudits.filter((a) => {
    const matchSearch = !search || a.entityTitle.toLowerCase().includes(search.toLowerCase()) || a.url.includes(search);
    const matchType = typeFilter === "all" || a.entityType === typeFilter;
    return matchSearch && matchType;
  });

  const totalCritical = mockAudits.reduce((sum, a) => sum + a.issues.filter((i) => i.severity === "critical").length, 0);
  const totalWarnings = mockAudits.reduce((sum, a) => sum + a.issues.filter((i) => i.severity === "warning").length, 0);
  const avgScore = Math.round(mockAudits.reduce((sum, a) => sum + a.score, 0) / mockAudits.length);
  const okEntities = mockAudits.filter((a) => a.issues.filter((i) => i.severity !== "info").length === 0).length;

  const columns: Column<AuditRow>[] = [
    { key: "type", header: "Тип", cell: (r) => <span className="text-xs text-muted-foreground">{entityLabels[r.entityType]}</span> },
    { key: "title", header: "Сущность", cell: (r) => (
      <div>
        <p className="font-medium text-sm">{r.entityTitle}</p>
        <p className="text-xs text-muted-foreground font-mono">{r.url}</p>
      </div>
    )},
    { key: "score", header: "Score", cell: (r) => (
      <span className={`font-semibold ${r.score >= 90 ? "text-green-600" : r.score >= 70 ? "text-yellow-600" : "text-red-600"}`}>
        {r.score}
      </span>
    )},
    { key: "issues", header: "Проблемы", cell: (r) => <IssueCount issues={r.issues} /> },
    { key: "details", header: "Детали", cell: (r) => (
      <ul className="text-xs space-y-0.5">
        {r.issues.slice(0, 2).map((i, idx) => (
          <li key={idx} className="text-muted-foreground line-clamp-1">{i.message}</li>
        ))}
        {r.issues.length > 2 && <li className="text-muted-foreground">+{r.issues.length - 2} ещё</li>}
      </ul>
    )},
  ];

  const goTo = (r: AuditRow) => {
    if (r.entityType === "event") setLocation(`/admin/events/${r.id}`);
    else if (r.entityType === "landing") setLocation(`/admin/landings/${r.id}`);
    else if (r.entityType === "venue") setLocation(`/admin/venues/${r.id}`);
    else if (r.entityType === "article") setLocation(`/admin/articles/${r.id}`);
    else if (r.entityType === "collection") setLocation(`/admin/collections/${r.id}`);
  };

  return (
    <AdminLayout title="SEO Аудит" breadcrumbs={[{ label: "Администратор" }, { label: "SEO Аудит" }]}>
      <PageHeader title="SEO Аудит" description="Сводка по качеству SEO всех публичных страниц" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Средний SEO score" value={`${avgScore}`} icon={Search} />
        <StatCard label="Критичных проблем" value={totalCritical} icon={AlertCircle} />
        <StatCard label="Предупреждений" value={totalWarnings} icon={AlertTriangle} />
        <StatCard label="Чистых сущностей" value={`${okEntities} / ${mockAudits.length}`} icon={CheckCircle2} />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по названию или URL..."
        filters={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44" data-testid="select-seo-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="event">События</SelectItem>
              <SelectItem value="landing">Лендинги</SelectItem>
              <SelectItem value="venue">Площадки</SelectItem>
              <SelectItem value="article">Статьи</SelectItem>
              <SelectItem value="collection">Подборки</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={goTo}
        emptyMessage="Нет данных"
        data-testid="table-seo-audit"
      />
    </AdminLayout>
  );
}
