import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertTriangle, CheckCircle2, X, GitMerge, Plus, ExternalLink, Sparkles, Plug, FileUp, Info } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type CandidateStatus = "new" | "auto_matched" | "needs_review" | "merged" | "rejected" | "kept_separate";
type Source = "ticketon" | "sxodim" | "kassir_api" | "csv_import" | "supplier_form";

interface MatchSuggestion {
  venueId: string;
  venueName: string;
  city: string;
  similarity: number; // 0-100
  reasons: string[];
}

interface Candidate {
  id: string;
  source: Source;
  sourceRef: string;
  rawName: string;
  rawAddress: string;
  rawCity: string;
  rawPhone?: string;
  rawCoords?: { lat: number; lng: number };
  importedAt: string;
  status: CandidateStatus;
  trustScore: number; // 0-100 from source
  suggestions: MatchSuggestion[];
  eventsAttached: number;
  reviewedBy?: string;
}

const sourceMeta: Record<Source, { label: string; className: string }> = {
  ticketon:      { label: "Kassir.ru",       className: "bg-blue-100 text-blue-700" },
  sxodim:        { label: "Sxodim",         className: "bg-violet-100 text-violet-700" },
  kassir_api:    { label: "Kassir API",     className: "bg-emerald-100 text-emerald-700" },
  csv_import:    { label: "CSV-импорт",     className: "bg-slate-100 text-slate-700" },
  supplier_form: { label: "Форма поставщика", className: "bg-amber-100 text-amber-700" },
};

const statusMeta: Record<CandidateStatus, { label: string; className: string }> = {
  new:           { label: "Новый",            className: "bg-blue-100 text-blue-700" },
  auto_matched:  { label: "Авто-сопоставлен", className: "bg-emerald-100 text-emerald-700" },
  needs_review:  { label: "Требует разбора",  className: "bg-amber-100 text-amber-700" },
  merged:        { label: "Слит",              className: "bg-emerald-100 text-emerald-700" },
  rejected:      { label: "Отклонён",          className: "bg-red-100 text-red-700" },
  kept_separate: { label: "Оставлен отдельно", className: "bg-slate-100 text-slate-700" },
};

const mockCandidates: Candidate[] = [
  {
    id: "VCN-1042", source: "ticketon", sourceRef: "tk_v_19284",
    rawName: "ВТБ Арена", rawAddress: "Москва, ул. Алтынсарина 31", rawCity: "Москва",
    rawPhone: "+7 727 357 11 22", rawCoords: { lat: 43.2333, lng: 76.8919 },
    importedAt: "2026-04-21T14:22:00Z", status: "auto_matched", trustScore: 92, eventsAttached: 4,
    suggestions: [
      { venueId: "VEN-001", venueName: "ВТБ Арена", city: "Москва", similarity: 98, reasons: ["имя 100%", "адрес 95%", "координаты в 50м", "телефон совпадает"] },
    ],
  },
  {
    id: "VCN-1041", source: "sxodim", sourceRef: "sx_place_8821",
    rawName: "ALATAY ARENA", rawAddress: "г. Москва, Алтынсарина", rawCity: "Москва",
    importedAt: "2026-04-21T14:18:00Z", status: "needs_review", trustScore: 64, eventsAttached: 2,
    suggestions: [
      { venueId: "VEN-001", venueName: "ВТБ Арена",     city: "Москва", similarity: 84, reasons: ["имя 82% (транслит)", "адрес 70% (без номера дома)"] },
      { venueId: "VEN-099", venueName: "Алатау Resort",     city: "Москва", similarity: 41, reasons: ["имя содержит «Алатау»"] },
    ],
  },
  {
    id: "VCN-1040", source: "kassir_api", sourceRef: "ka_2026_4448",
    rawName: "Concert Hall Saint Petersburg", rawAddress: "пр. Туран 49", rawCity: "Saint Petersburg",
    rawCoords: { lat: 51.0907, lng: 71.4187 },
    importedAt: "2026-04-21T13:55:00Z", status: "needs_review", trustScore: 71, eventsAttached: 1,
    suggestions: [
      { venueId: "VEN-002", venueName: "Barys Arena", city: "Санкт-Петербург", similarity: 56, reasons: ["адрес совпадает", "имя не совпадает"] },
    ],
  },
  {
    id: "VCN-1039", source: "supplier_form", sourceRef: "SUP-024 / form",
    rawName: "ARENA PRO Moscow",  rawAddress: "ул. Сатпаева 18Б", rawCity: "Москва",
    rawPhone: "+7 707 111 22 33",
    importedAt: "2026-04-21T13:30:00Z", status: "new", trustScore: 50, eventsAttached: 0,
    suggestions: [],
  },
  {
    id: "VCN-1038", source: "csv_import", sourceRef: "import_2026-04-21.csv #14",
    rawName: "Третьяковская галерея — Главное здание", rawAddress: "мкр. Коктем-3, д.22", rawCity: "Москва",
    importedAt: "2026-04-21T11:00:00Z", status: "auto_matched", trustScore: 88, eventsAttached: 0,
    suggestions: [
      { venueId: "VEN-007", venueName: "Третьяковская галерея", city: "Москва", similarity: 91, reasons: ["имя 88%", "адрес 100%", "город совпадает"] },
    ],
  },
  {
    id: "VCN-1037", source: "ticketon", sourceRef: "tk_v_19101",
    rawName: "Old Square Open Air", rawAddress: "—", rawCity: "Казань",
    importedAt: "2026-04-21T10:42:00Z", status: "rejected", trustScore: 28, eventsAttached: 0,
    suggestions: [], reviewedBy: "Динара О.",
  },
  {
    id: "VCN-1036", source: "sxodim", sourceRef: "sx_place_8801",
    rawName: "DUMAN — океанариум", rawAddress: "пр. Кабанбай батыра 6", rawCity: "Санкт-Петербург",
    importedAt: "2026-04-21T10:14:00Z", status: "merged", trustScore: 86, eventsAttached: 0,
    suggestions: [
      { venueId: "VEN-008", venueName: "Океанариум Думан", city: "Санкт-Петербург", similarity: 89, reasons: ["адрес 100%", "имя 75%"] },
    ], reviewedBy: "Аскар Б.",
  },
];

export default function VenueCandidates() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<CandidateStatus | "all" | "queue">("queue");
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = mockCandidates.filter((c) => {
    const m = !search || c.rawName.toLowerCase().includes(search.toLowerCase()) || c.rawAddress.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === "all"   ? true :
      tab === "queue" ? c.status === "new" || c.status === "needs_review" :
      c.status === tab;
    return m && matchTab && (source === "all" || c.source === source);
  });

  const stats = {
    queue:        mockCandidates.filter(c => c.status === "new" || c.status === "needs_review").length,
    auto:         mockCandidates.filter(c => c.status === "auto_matched").length,
    new:          mockCandidates.filter(c => c.status === "new").length,
    review:       mockCandidates.filter(c => c.status === "needs_review").length,
    merged:       mockCandidates.filter(c => c.status === "merged").length,
    rejected:     mockCandidates.filter(c => c.status === "rejected").length,
    kept:         mockCandidates.filter(c => c.status === "kept_separate").length,
    avgTrust:     Math.round(mockCandidates.reduce((s, c) => s + c.trustScore, 0) / mockCandidates.length),
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <AdminLayout title="Кандидаты площадок" breadcrumbs={[{ label: "Администратор" }, { label: "Площадки", href: "/admin/venues" }, { label: "Кандидаты" }]}>
      <PageHeader
        title="Кандидаты площадок"
        description="Очередь сырых записей из импортов, API и форм поставщиков. Каждый кандидат проверяется на совпадение с уже существующими площадками."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/venues/duplicates")}>Кластеры дублей</Button>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/venues")}><ArrowLeft className="w-4 h-4 mr-1.5" /> К площадкам</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <KCell label="В очереди" value={String(stats.queue)} hint={`${stats.new} новых · ${stats.review} ручной разбор`} accent={stats.queue > 0 ? "warn" : undefined} />
        <KCell label="Авто-сопоставлено" value={String(stats.auto)} hint="ждут подтверждения" />
        <KCell label="Слито за 30 дн" value="142" hint="merge → существующая" accent="good" />
        <KCell label="Отклонено за 30 дн" value="38" hint="не валидные" />
        <KCell label="Доверие источников" value={`${stats.avgTrust}/100`} hint="среднее по кандидатам" />
      </div>

      <Tabs
        items={[
          { key: "queue",        label: "Очередь",          count: stats.queue },
          { key: "auto_matched", label: "Авто-сопоставлено", count: stats.auto },
          { key: "merged",       label: "Слиты",             count: stats.merged },
          { key: "rejected",     label: "Отклонены",         count: stats.rejected },
          { key: "kept_separate",label: "Оставлены отдельно", count: stats.kept },
          { key: "all",          label: "Все",                count: mockCandidates.length },
        ]}
        active={tab}
        onChange={(v) => setTab(v as any)}
      />

      <FilterBar
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Поиск по имени, адресу, ID кандидата..."
        filters={
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-44" data-testid="select-candidate-source"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все источники</SelectItem>
              {Object.entries(sourceMeta).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      {selected.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex items-center justify-between">
          <span className="text-sm text-blue-900">Выбрано: {selected.size}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Dry-run merge</Button>
            <Button size="sm" variant="outline"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Подтвердить совпадение</Button>
            <Button size="sm" variant="outline" className="text-red-600"><X className="w-3.5 h-3.5 mr-1" /> Отклонить пакетно</Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="bg-card border border-card-border rounded-lg p-12 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            Очередь пуста — все кандидаты разобраны
          </div>
        )}
        {filtered.map((c) => {
          const src = sourceMeta[c.source];
          const st = statusMeta[c.status];
          const top = c.suggestions[0];
          return (
            <div key={c.id} className="bg-card border border-card-border rounded-lg p-4" data-testid={`candidate-${c.id}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggle(c.id)}
                  className="mt-1 rounded"
                />

                {/* Raw side */}
                <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${src.className}`}>{src.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${st.className}`}>{st.label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                      <span className="text-[10px] text-muted-foreground">trust {c.trustScore}</span>
                      {c.eventsAttached > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600">
                          <AlertTriangle className="w-3 h-3" /> {c.eventsAttached} событ. ждут привязки
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-sm">{c.rawName}</p>
                    <p className="text-xs text-muted-foreground">{c.rawAddress || "адрес не указан"}, {c.rawCity}</p>
                    {c.rawPhone && <p className="text-xs text-muted-foreground font-mono">{c.rawPhone}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                      {src.label} · {c.sourceRef} · {formatDateTime(c.importedAt)}
                      {c.reviewedBy && <> · разобрал {c.reviewedBy}</>}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex items-center justify-center text-muted-foreground pt-3">
                    <GitMerge className="w-5 h-5" />
                  </div>

                  {/* Suggestion side */}
                  <div>
                    {top ? (
                      <button
                        onClick={() => setLocation(`/admin/venues/${top.venueId}`)}
                        className="text-left w-full p-3 rounded-md border border-border hover:bg-accent/40"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Лучшее совпадение</span>
                          <SimilarityBadge score={top.similarity} />
                        </div>
                        <p className="font-medium text-sm inline-flex items-center gap-1">
                          {top.venueName}
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </p>
                        <p className="text-xs text-muted-foreground">{top.city} · {top.venueId}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {top.reasons.map((r) => (
                            <span key={r} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{r}</span>
                          ))}
                        </div>
                        {c.suggestions.length > 1 && (
                          <p className="text-[10px] text-muted-foreground mt-1.5">+ ещё {c.suggestions.length - 1} вариант (similarity {c.suggestions[1].similarity}%)</p>
                        )}
                      </button>
                    ) : (
                      <div className="p-3 rounded-md border border-dashed border-border bg-muted/20">
                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Совпадений не найдено — будет создана новая площадка
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 shrink-0 w-36">
                  {(c.status === "new" || c.status === "needs_review" || c.status === "auto_matched") && (
                    <>
                      {top && (
                        <Button size="sm" className="h-8 text-xs" data-testid={`button-merge-${c.id}`}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Подтвердить merge
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-8 text-xs" data-testid={`button-keep-${c.id}`}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Создать как новую
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-red-600" data-testid={`button-reject-${c.id}`}>
                        <X className="w-3.5 h-3.5 mr-1" /> Отклонить
                      </Button>
                    </>
                  )}
                  {(c.status === "merged" || c.status === "rejected" || c.status === "kept_separate") && (
                    <Button size="sm" variant="ghost" className="h-8 text-xs">Отменить решение</Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-card-border rounded-lg p-5 mt-6">
        <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
          <Plug className="w-4 h-4" /> Доверие источников за 30 дней
        </h3>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="text-left py-1 font-medium">Источник</th>
              <th className="text-right py-1 font-medium">Кандидатов</th>
              <th className="text-right py-1 font-medium">Авто-merge</th>
              <th className="text-right py-1 font-medium">Отклонено</th>
              <th className="text-right py-1 font-medium">Trust</th>
              <th className="text-right py-1 font-medium">Свежесть</th>
            </tr>
          </thead>
          <tbody>
            {[
              { s: "ticketon",      n: 482, am: 88, rej: 4,  trust: 92, fresh: "12 мин" },
              { s: "sxodim",        n: 318, am: 71, rej: 11, trust: 76, fresh: "1 ч" },
              { s: "kassir_api",    n: 204, am: 92, rej: 2,  trust: 95, fresh: "5 мин" },
              { s: "csv_import",    n: 142, am: 64, rej: 8,  trust: 70, fresh: "ручной" },
              { s: "supplier_form", n:  87, am: 12, rej: 22, trust: 48, fresh: "ручной" },
            ].map((r) => (
              <tr key={r.s} className="border-t border-border">
                <td className="py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sourceMeta[r.s as Source].className}`}>{sourceMeta[r.s as Source].label}</span></td>
                <td className="py-2 text-right tabular-nums">{r.n}</td>
                <td className="py-2 text-right tabular-nums text-emerald-600">{r.am}%</td>
                <td className="py-2 text-right tabular-nums text-red-600">{r.rej}%</td>
                <td className="py-2 text-right">
                  <span className={`tabular-nums ${r.trust >= 85 ? "text-emerald-600" : r.trust >= 65 ? "" : "text-amber-600"}`}>{r.trust}/100</span>
                </td>
                <td className="py-2 text-right text-xs text-muted-foreground">{r.fresh}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[11px] text-muted-foreground mt-2 inline-flex items-center gap-1">
          <Info className="w-3 h-3" /> Trust score влияет на порог авто-merge: при ≥85 совпадение от 90% сливается без ручного подтверждения.
        </p>
      </div>
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
