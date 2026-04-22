import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/shared/Tabs";
import { ArrowLeft, GitMerge, X, ExternalLink, CheckCircle2, AlertTriangle, MapPin, Phone, Calendar } from "lucide-react";

interface VenueRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  capacity: number;
  eventsCount: number;
  createdAt: string;
  sources: string[]; // which integrations contributed
  trust: number;
}

interface DuplicateCluster {
  id: string;
  reasons: string[];        // similarity reasons
  similarity: number;
  status: "open" | "merged" | "not_duplicate";
  venues: VenueRecord[];
  detectedAt: string;
}

const mockClusters: DuplicateCluster[] = [
  {
    id: "DUP-014",
    reasons: ["имя 88%", "адрес 95%", "координаты в радиусе 30м"],
    similarity: 91,
    status: "open",
    detectedAt: "2026-04-21T08:00:00Z",
    venues: [
      { id: "VEN-001",  name: "ВТБ Арена",     address: "ул. Алтынсарина, 31",  city: "Москва", phone: "+7 727 357-11-22", capacity: 12000, eventsCount: 8, createdAt: "2024-02-10", sources: ["ticketon", "manual"], trust: 95 },
      { id: "VEN-201",  name: "Alatau Arena",      address: "Алтынсарина 31",        city: "Москва", phone: "+7 727 357-11-22", capacity: 12000, eventsCount: 1, createdAt: "2026-03-14", sources: ["sxodim"],            trust: 68 },
    ],
  },
  {
    id: "DUP-013",
    reasons: ["имя 75%", "адрес 100%", "тот же телефон"],
    similarity: 84,
    status: "open",
    detectedAt: "2026-04-20T16:42:00Z",
    venues: [
      { id: "VEN-007",  name: "Третьяковская галерея",                       address: "мкр. Коктем-3, 22", city: "Москва", phone: "+7 727 247-82-46", capacity: 600, eventsCount: 3, createdAt: "2024-04-22", sources: ["manual"],   trust: 92 },
      { id: "VEN-188",  name: "Государственный музей искусств Кастеева", address: "Коктем-3, 22",      city: "Москва", phone: "+7 727 247-82-46", capacity: 600, eventsCount: 0, createdAt: "2026-02-01", sources: ["csv_import"], trust: 60 },
      { id: "VEN-244",  name: "Kasteev Museum",                          address: "Кoktem-3, 22",      city: "Moscow", phone: "+77272478246",     capacity:   0, eventsCount: 0, createdAt: "2026-04-12", sources: ["kassir_api"], trust: 70 },
    ],
  },
  {
    id: "DUP-012",
    reasons: ["похожие координаты (45м)", "имя 62%"],
    similarity: 71,
    status: "open",
    detectedAt: "2026-04-19T11:00:00Z",
    venues: [
      { id: "VEN-003",  name: "Крокус Сити Холл",  address: "ул. Розыбакиева, 247а",  city: "Москва", capacity: 2500, eventsCount: 12, createdAt: "2024-05-10", sources: ["manual"],   trust: 90 },
      { id: "VEN-211",  name: "Mega Hall",       address: "Розыбакиева 247А, ТРЦ Mega", city: "Москва", capacity: 2500, eventsCount: 0, createdAt: "2026-03-22", sources: ["sxodim"], trust: 64 },
    ],
  },
  {
    id: "DUP-011",
    reasons: ["имя 100%", "разные города (вероятно сеть)"],
    similarity: 60,
    status: "not_duplicate",
    detectedAt: "2026-04-15T10:00:00Z",
    venues: [
      { id: "VEN-052", name: "Park Hall", address: "пр. Республики, 44", city: "Казань", capacity: 1500, eventsCount: 5, createdAt: "2024-08-01", sources: ["manual"], trust: 88 },
      { id: "VEN-053", name: "Park Hall", address: "пр. Достык, 12",     city: "Санкт-Петербург",  capacity: 800,  eventsCount: 3, createdAt: "2024-09-12", sources: ["manual"], trust: 88 },
    ],
  },
];

export default function VenueDuplicates() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"open" | "merged" | "not_duplicate" | "all">("open");
  const [merging, setMerging] = useState<string | null>(null);
  const [primary, setPrimary] = useState<string>("");

  const filtered = mockClusters.filter(c => tab === "all" ? true : c.status === tab);
  const stats = {
    open: mockClusters.filter(c => c.status === "open").length,
    merged: mockClusters.filter(c => c.status === "merged").length,
    notDup: mockClusters.filter(c => c.status === "not_duplicate").length,
  };

  const cluster = mockClusters.find(c => c.id === merging);

  return (
    <AdminLayout title="Дубликаты площадок" breadcrumbs={[{ label: "Администратор" }, { label: "Площадки", href: "/admin/venues" }, { label: "Дубликаты" }]}>
      <PageHeader
        title="Дубликаты площадок"
        description="Кластеры с похожими записями уже в каталоге. Слияние объединяет события, заказы и SEO-историю."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/venues/candidates")}>Очередь кандидатов</Button>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/venues")}><ArrowLeft className="w-4 h-4 mr-1.5" /> К площадкам</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <KCell label="Открытых кластеров" value={String(stats.open)} accent={stats.open > 0 ? "warn" : undefined} hint="ждут разбора" />
        <KCell label="Слитых за 30 дн" value="42" hint="уменьшение каталога" accent="good" />
        <KCell label="Помечено «не дубликат»" value={String(stats.notDup)} hint="разные объекты" />
        <KCell label="Точность модели" value="89%" hint="precision за 90 дней" />
      </div>

      <Tabs
        items={[
          { key: "open",          label: "Открытые",          count: stats.open },
          { key: "merged",        label: "Слиты",              count: stats.merged },
          { key: "not_duplicate", label: "Не дубликаты",       count: stats.notDup },
          { key: "all",           label: "Все",                count: mockClusters.length },
        ]}
        active={tab}
        onChange={(v) => setTab(v as any)}
      />

      {filtered.length === 0 && (
        <div className="bg-card border border-card-border rounded-lg p-12 text-center text-sm text-muted-foreground">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
          В этой категории кластеров нет
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                <SimilarityBadge score={c.similarity} />
                {c.reasons.map(r => <span key={r} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{r}</span>)}
                <span className="text-[10px] text-muted-foreground">· {c.venues.length} записей</span>
              </div>
              {c.status === "open" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-xs h-7" data-testid={`button-not-dup-${c.id}`}>
                    <X className="w-3 h-3 mr-1" /> Не дубликат
                  </Button>
                  <Button size="sm" className="text-xs h-7" onClick={() => { setMerging(c.id); setPrimary(c.venues[0].id); }} data-testid={`button-merge-${c.id}`}>
                    <GitMerge className="w-3 h-3 mr-1" /> Объединить...
                  </Button>
                </div>
              )}
              {c.status === "merged" && <span className="text-xs text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Слит</span>}
              {c.status === "not_duplicate" && <span className="text-xs text-muted-foreground">Помечен как разные объекты</span>}
            </div>

            <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {c.venues.map((v) => (
                <div key={v.id} className="border border-border rounded-md p-3 hover:bg-accent/30">
                  <div className="flex items-center justify-between mb-1">
                    <button
                      onClick={() => window.open(`/admin/venues/${v.id}`, "_blank")}
                      className="font-medium text-sm hover:underline inline-flex items-center gap-1"
                    >
                      {v.name}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <span className="text-[10px] font-mono text-muted-foreground">{v.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.address}, {v.city}</p>
                  {v.phone && <p className="text-xs text-muted-foreground inline-flex items-center gap-1 font-mono"><Phone className="w-3 h-3" /> {v.phone}</p>}
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> создан {v.createdAt}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-[10px] text-muted-foreground">
                      {v.eventsCount} событ. · вместимость {v.capacity || "—"}
                    </span>
                    <span className={`text-[10px] tabular-nums ${v.trust >= 85 ? "text-emerald-600" : v.trust >= 65 ? "" : "text-amber-600"}`}>
                      trust {v.trust}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {v.sources.map(s => <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded font-mono">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Merge wizard modal */}
      {cluster && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setMerging(null)}>
          <div className="bg-card border border-card-border rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold inline-flex items-center gap-2"><GitMerge className="w-4 h-4" /> Объединение кластера {cluster.id}</h2>
              <button onClick={() => setMerging(null)} className="p-1"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 inline-flex items-start gap-2 w-full">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Это необратимая операция. События ({cluster.venues.reduce((s, v) => s + v.eventsCount, 0)}) и заказы будут переподвязаны на основную запись. Вторичные ID станут редиректами.</span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Основная запись (master)</label>
                <p className="text-[11px] text-muted-foreground mb-2">Все остальные сольются в неё. Выбирайте запись с самым высоким trust score.</p>
                <div className="space-y-1.5">
                  {cluster.venues.map((v) => (
                    <label key={v.id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${primary === v.id ? "border-primary bg-primary/5" : "border-border"}`}>
                      <input type="radio" name="primary" checked={primary === v.id} onChange={() => setPrimary(v.id)} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-[11px] text-muted-foreground">{v.address}, {v.city} · {v.id} · {v.eventsCount} событ. · trust {v.trust}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Конфликты полей</label>
                <p className="text-[11px] text-muted-foreground mb-2">Выберите значение для каждого расходящегося поля.</p>
                <div className="border border-border rounded overflow-hidden">
                  {[
                    { field: "name",     a: "ВТБ Арена",            b: "Alatau Arena" },
                    { field: "address",  a: "ул. Алтынсарина, 31",      b: "Алтынсарина 31" },
                    { field: "capacity", a: "12 000",                    b: "12 000" },
                    { field: "phone",    a: "+7 727 357-11-22",          b: "+7 727 357-11-22" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-[120px_1fr_1fr] gap-2 p-2 text-xs border-t border-border first:border-t-0">
                      <span className="font-mono text-muted-foreground">{row.field}</span>
                      <button className={`text-left p-1.5 rounded border ${row.a === row.b ? "border-emerald-200 bg-emerald-50" : "border-primary bg-primary/5"}`}>
                        ✓ {row.a}
                      </button>
                      <button className={`text-left p-1.5 rounded border ${row.a === row.b ? "border-emerald-200 bg-emerald-50" : "border-border hover:border-primary"}`}>
                        {row.b}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setMerging(null)}>Отмена</Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Dry-run</Button>
                <Button size="sm"><GitMerge className="w-3.5 h-3.5 mr-1" /> Объединить {cluster.venues.length} записей</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function SimilarityBadge({ score }: { score: number }) {
  const cls = score >= 90 ? "bg-emerald-100 text-emerald-700" : score >= 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums ${cls}`}>{score}%</span>;
}

function KCell({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: "good" | "warn" }) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-3">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      <p className={`text-xl font-semibold tabular-nums mt-1 ${accent === "good" ? "text-emerald-600" : accent === "warn" ? "text-amber-600" : ""}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}
