import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatNumber } from "@/lib/utils";
import { Plus, ExternalLink, Globe2, MapPin, Layers, ArrowUp, ArrowDown } from "lucide-react";

type Scope = "global" | "single_city" | "multi_city";

interface Landing {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  scope: Scope;
  cities: string[]; // city slugs
  visits30d: number;
  delta: number;
  avgPosition: number | null;
  updatedAt: string;
}

const mockLandings: Landing[] = [
  { id: "LND-001", title: "Главная страница Алматы",        slug: "almaty",                       type: "city",        status: "published", scope: "single_city", cities: ["almaty"],                          visits30d: 184_200, delta: 12.4, avgPosition: 3.2,  updatedAt: "2026-04-01" },
  { id: "LND-003", title: "Главная страница Астаны",        slug: "astana",                       type: "city",        status: "published", scope: "single_city", cities: ["astana"],                          visits30d: 92_400,  delta: 8.1,  avgPosition: 4.1,  updatedAt: "2026-03-20" },
  { id: "LND-002", title: "Концерты Алматы — весна 2025",   slug: "concerts-spring-2025",         type: "collection",  status: "published", scope: "single_city", cities: ["almaty"],                          visits30d: 38_100,  delta: 22.7, avgPosition: 5.4,  updatedAt: "2026-04-15" },
  { id: "LND-007", title: "Stand Up афиша по Казахстану",   slug: "standup",                      type: "category",    status: "published", scope: "multi_city",  cities: ["almaty", "astana", "shymkent"],   visits30d: 26_400,  delta: 14.0, avgPosition: 6.2,  updatedAt: "2026-04-10" },
  { id: "LND-008", title: "Театры Казахстана",              slug: "theatres",                     type: "category",    status: "published", scope: "multi_city",  cities: ["almaty", "astana"],               visits30d: 14_800,  delta: 5.6,  avgPosition: 8.1,  updatedAt: "2026-04-05" },
  { id: "LND-004", title: "Фестивали лета 2025",            slug: "summer-festivals-2025",        type: "promo",       status: "draft",     scope: "global",      cities: [],                                  visits30d: 0,       delta: 0,    avgPosition: null, updatedAt: "2026-04-18" },
  { id: "LND-009", title: "Главная Daibilet",               slug: "",                              type: "homepage",    status: "published", scope: "global",      cities: [],                                  visits30d: 220_400, delta: 6.8,  avgPosition: 2.1,  updatedAt: "2026-03-01" },
];

const scopeMeta: Record<Scope, { label: string; icon: typeof Globe2; className: string }> = {
  global:      { label: "Глобальный",       icon: Globe2, className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  single_city: { label: "Один город",        icon: MapPin, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  multi_city:  { label: "Мульти-городовой", icon: Layers, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
};

function ScopeBadge({ scope }: { scope: Scope }) {
  const m = scopeMeta[scope]; const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.className}`}>
      <Icon className="w-3 h-3" /> {m.label}
    </span>
  );
}

function formatUrl(l: Landing): string {
  if (l.scope === "global") return l.slug ? `daibilet.kz/${l.slug}/` : `daibilet.kz/`;
  if (l.scope === "multi_city") return `daibilet.kz/{city}/${l.slug}/`;
  // single_city
  return `daibilet.kz/${l.cities[0] ?? ""}/${l.slug === l.cities[0] ? "" : l.slug + "/"}`.replace(/\/+/g, "/");
}

export default function LandingsList() {
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("all");
  const [status, setStatus] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockLandings.filter((l) => {
    const m = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.slug.toLowerCase().includes(search.toLowerCase());
    return m && (scope === "all" || l.scope === scope) && (status === "all" || l.status === status);
  });

  const totalVisits = mockLandings.reduce((s, l) => s + l.visits30d, 0);
  const multiCityCount = mockLandings.filter((l) => l.scope === "multi_city").length;

  const columns: Column<Landing>[] = [
    { key: "title", header: "Лендинг", cell: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.title}</span>
        <span className="text-xs text-muted-foreground font-mono">{formatUrl(r)}</span>
      </div>
    )},
    { key: "scope", header: "Scope", cell: (r) => (
      <div className="flex flex-col gap-1 items-start">
        <ScopeBadge scope={r.scope} />
        {r.scope === "multi_city" && (
          <span className="text-[10px] text-muted-foreground">{r.cities.length} городов</span>
        )}
      </div>
    )},
    { key: "type", header: "Тип", cell: (r) => <span className="text-sm">{r.type}</span> },
    { key: "visits", header: "Визиты / 30 дн", cell: (r) => (
      <div className="flex items-center gap-2 justify-end">
        <span className="tabular-nums font-medium">{formatNumber(r.visits30d)}</span>
        {r.delta !== 0 && (
          <span className={`text-xs inline-flex items-center ${r.delta > 0 ? "text-emerald-600" : "text-red-600"}`}>
            {r.delta > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(r.delta).toFixed(1)}%
          </span>
        )}
      </div>
    )},
    { key: "pos", header: "Сред. позиция", cell: (r) => r.avgPosition == null ? <span className="text-muted-foreground text-xs">—</span> : (
      <span className={`tabular-nums ${r.avgPosition <= 5 ? "text-emerald-600 font-medium" : r.avgPosition <= 10 ? "" : "text-amber-600"}`}>
        {r.avgPosition.toFixed(1)}
      </span>
    )},
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "updated", header: "Обновлён", cell: (r) => <span className="text-xs">{formatDate(r.updatedAt)}</span> },
    { key: "actions", header: "", cell: (r) => (
      r.status === "published" ? (
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : null
    )},
  ];

  return (
    <AdminLayout title="Лендинги" breadcrumbs={[{ label: "Администратор" }, { label: "Маркетинг" }, { label: "Лендинги" }]}>
      <PageHeader
        title="Лендинги"
        description={`${mockLandings.length} лендингов · ${multiCityCount} мульти-городовых · ${formatNumber(totalVisits)} визитов / 30 дн`}
        actions={<Button size="sm" data-testid="button-create-landing"><Plus className="w-4 h-4 mr-1.5" /> Создать лендинг</Button>}
      />

      <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 rounded-lg p-4 mb-4">
        <p className="text-sm text-violet-900 dark:text-violet-200 leading-relaxed">
          <strong>Лендинги — основной канал органического трафика.</strong> Поддерживаются три scope:
          {" "}<code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">global</code> (одна страница на весь сайт),
          {" "}<code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">single_city</code> (привязан к одному городу),
          {" "}<code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">multi_city</code> (один шаблон, развёрнут на N городов как <code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">/{"{city}"}/{"{slug}"}/</code>).
        </p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по заголовку или slug..."
        filters={
          <>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="w-44" data-testid="select-landing-scope"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все scope</SelectItem>
                <SelectItem value="global">Глобальные</SelectItem>
                <SelectItem value="single_city">Один город</SelectItem>
                <SelectItem value="multi_city">Мульти-городовые</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40" data-testid="select-landing-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="published">Опубликован</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <DataTable columns={columns} data={filtered} onRowClick={(r) => setLocation(`/admin/landings/${r.id}`)} emptyMessage="Лендинги не найдены" data-testid="table-landings" />
    </AdminLayout>
  );
}
