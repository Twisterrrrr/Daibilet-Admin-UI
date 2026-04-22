import { useLocation, useRoute } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { HubLink } from "@/components/shared/HubLink";
import { Button } from "@/components/ui/button";
import { mockSlots } from "./PromoPlacementsList";
import {
  ArrowLeft, Trophy, Eye, Pause, Pin, Beaker, Calendar, Filter,
  TrendingUp, Info, CheckCircle2, XCircle, Clock, Sparkles, Target, Layers, History,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Candidate {
  id: string;
  title: string;
  type: "promo_block" | "collection" | "event" | "landing_pin";
  status: "winner" | "queued" | "ineligible" | "scheduled" | "abtest";
  score: number;
  scoreBreakdown: { label: string; value: number; weight: number; reason?: string }[];
  segments: string[];
  schedule?: string;
  override?: { kind: "pin" | "exclude"; by: string; until: string };
  ineligibleReason?: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "PRB-002", title: "Главные концерты весны", type: "promo_block", status: "winner", score: 92,
    scoreBreakdown: [
      { label: "Базовый приоритет",       value: 30, weight: 30 },
      { label: "Попадание в сегмент",      value: 20, weight: 20, reason: "RU · крупные города · муз. интересы" },
      { label: "Свежесть кампании",         value: 15, weight: 15, reason: "запущена 5 дней назад" },
      { label: "Историческая CTR",          value: 18, weight: 20, reason: "5.4% за прошлые 7 показов слота" },
      { label: "A/B-тест бонус",            value:  9, weight: 10, reason: "вариант B победил" },
      { label: "Штраф за частоту",          value:  0, weight:  5, reason: "fatigue не превышен" },
    ],
    segments: ["RU", "muzyka", "premium"],
    schedule: "До 30.04.2026",
  },
  {
    id: "PRB-006", title: "Театр и балет — выбор редакции", type: "promo_block", status: "queued", score: 84,
    scoreBreakdown: [
      { label: "Базовый приоритет",       value: 28, weight: 30 },
      { label: "Попадание в сегмент",      value: 18, weight: 20 },
      { label: "Свежесть",                  value: 12, weight: 15 },
      { label: "CTR",                       value: 16, weight: 20 },
      { label: "A/B-тест",                  value:  7, weight: 10 },
      { label: "Штраф за частоту",          value:  3, weight:  5, reason: "показывалась 3 раза за день" },
    ],
    segments: ["RU", "teatr"],
  },
  {
    id: "PRB-009", title: "Фестивали лета 2026 (preview)", type: "promo_block", status: "scheduled", score: 78,
    scoreBreakdown: [
      { label: "Базовый приоритет",       value: 30, weight: 30 },
      { label: "Сегмент",                   value: 20, weight: 20 },
      { label: "Свежесть",                  value: 15, weight: 15 },
      { label: "CTR (нет данных)",          value: 10, weight: 20, reason: "нет истории" },
      { label: "A/B",                       value:  3, weight: 10 },
    ],
    segments: ["RU", "festivali"],
    schedule: "Старт 25.04.2026 в 09:00",
  },
  {
    id: "COL-014", title: "Подборка «Топ-10 концертов»", type: "collection", status: "queued", score: 70,
    scoreBreakdown: [
      { label: "Приоритет (collection)",   value: 22, weight: 30 },
      { label: "Сегмент",                   value: 16, weight: 20 },
      { label: "Свежесть",                  value: 10, weight: 15 },
      { label: "CTR",                       value: 14, weight: 20 },
      { label: "A/B",                       value:  8, weight: 10 },
    ],
    segments: ["RU"],
  },
  {
    id: "EVT-042", title: "Закреплено: «Ленинград в Лужниках»", type: "event", status: "queued", score: 88,
    scoreBreakdown: [
      { label: "Pin от менеджера",         value: 50, weight: 50, reason: "ручное закрепление" },
      { label: "Сегмент",                   value: 18, weight: 20 },
      { label: "Свежесть/CTR",              value: 20, weight: 30 },
    ],
    segments: ["RU"],
    override: { kind: "pin", by: "Анна Петрова", until: "2026-04-25T00:00:00Z" },
  },
  {
    id: "PRB-011", title: "Турне Басты — гастроли 2026", type: "promo_block", status: "ineligible", score: 0,
    scoreBreakdown: [],
    segments: ["RU", "rep"],
    ineligibleReason: "Сегмент 'rep' исключён ограничением слота (whitelist: muzyka/teatr/festivali)",
  },
  {
    id: "PRB-013", title: "Промо партнёра X (paid)", type: "promo_block", status: "abtest", score: 90,
    scoreBreakdown: [
      { label: "Базовый приоритет (paid)", value: 35, weight: 35 },
      { label: "Сегмент",                   value: 20, weight: 20 },
      { label: "Гарантия показов (SLA)",    value: 15, weight: 15, reason: "недобор 28% — буст" },
      { label: "CTR",                       value: 12, weight: 20 },
      { label: "A/B",                       value:  8, weight: 10 },
    ],
    segments: ["RU", "moskva"],
    schedule: "A/B 50/50 с PRB-002, до набора 10k показов",
  },
];

const auditLog = [
  { at: "2026-04-22T08:14:00Z", who: "system",          action: "Победитель сменился: PRB-006 → PRB-002 (свежесть кампании +5)" },
  { at: "2026-04-22T07:00:00Z", who: "system",          action: "A/B-тест PRB-013 vs PRB-002 запущен (50/50)" },
  { at: "2026-04-21T15:42:00Z", who: "Анна Петрова",   action: "Pin EVT-042 на 3 дня до 25.04" },
  { at: "2026-04-20T10:11:00Z", who: "system",          action: "PRB-011 исключён: сегмент 'rep' не в whitelist слота" },
  { at: "2026-04-19T09:00:00Z", who: "Иван Соколов",   action: "Изменён приоритет PRB-002: 60 → 80" },
];

const statusMeta: Record<Candidate["status"], { label: string; cls: string; icon: React.ElementType }> = {
  winner:     { label: "Победитель",     cls: "bg-emerald-100 text-emerald-700 border-emerald-200",  icon: Trophy },
  queued:     { label: "В очереди",      cls: "bg-blue-100 text-blue-700 border-blue-200",            icon: Clock },
  scheduled:  { label: "В расписании",    cls: "bg-violet-100 text-violet-700 border-violet-200",      icon: Calendar },
  abtest:     { label: "A/B-тест",        cls: "bg-amber-100 text-amber-700 border-amber-200",         icon: Beaker },
  ineligible: { label: "Не подходит",     cls: "bg-slate-100 text-slate-600 border-slate-200",         icon: XCircle },
};

export default function PromoPlacementDetail() {
  const [, params] = useRoute("/admin/promo-placements/:id");
  const [, setLocation] = useLocation();
  const slot = mockSlots.find((s) => s.id === params?.id) ?? mockSlots[0];

  return (
    <AdminLayout
      title={slot.position}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Promo-размещения", href: "/admin/promo-placements" },
        { label: slot.id },
      ]}
    >
      <PageHeader
        title={slot.position}
        description={
          <span className="inline-flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-muted-foreground">{slot.id}</span>
            <span>·</span>
            <span>{slot.size}</span>
            <span>·</span>
            <span>Тип: {slot.type === "single" ? "1 слот" : slot.type === "carousel" ? `Карусель × ${slot.capacity}` : `Сетка × ${slot.capacity}`}</span>
            {slot.pageRef && (
              <>
                <span>·</span>
                <HubLink href={slot.pageRef.href}>{slot.pageRef.label}</HubLink>
              </>
            )}
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setLocation("/admin/promo-placements")}>
              <ArrowLeft className="w-4 h-4 mr-1.5" /> К размещениям
            </Button>
            <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1.5" /> Посмотреть на сайте</Button>
            <Button size="sm" variant="outline"><Pin className="w-4 h-4 mr-1.5" /> Закрепить блок</Button>
            <Button size="sm" variant="outline"><Pause className="w-4 h-4 mr-1.5" /> Пауза слота</Button>
          </div>
        }
      />

      {/* Why-shown summary */}
      <div className="bg-card border border-card-border rounded-lg p-5 mb-4">
        <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Почему сейчас показано: «{mockCandidates[0].title}»
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Скор победителя — <strong className="text-foreground">{mockCandidates[0].score}</strong>. Ниже — разбивка по факторам и сравнение с ближайшим преследователем
          ({mockCandidates[1].title} · {mockCandidates[1].score}).
        </p>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-2">Фактор</th>
              <th className="py-2 text-right">Победитель</th>
              <th className="py-2 text-right">Преследователь</th>
              <th className="py-2 text-right">Δ</th>
              <th className="py-2 pl-3">Объяснение</th>
            </tr>
          </thead>
          <tbody>
            {mockCandidates[0].scoreBreakdown.map((row, i) => {
              const next = mockCandidates[1].scoreBreakdown[i];
              const delta = row.value - (next?.value ?? 0);
              return (
                <tr key={i} className="border-b border-border/40">
                  <td className="py-2 font-medium">{row.label}</td>
                  <td className="py-2 text-right tabular-nums">{row.value} / {row.weight}</td>
                  <td className="py-2 text-right tabular-nums text-muted-foreground">{next ? `${next.value} / ${next.weight}` : "—"}</td>
                  <td className={`py-2 text-right tabular-nums font-medium ${delta > 0 ? "text-emerald-600" : delta < 0 ? "text-rose-600" : "text-muted-foreground"}`}>
                    {delta > 0 ? `+${delta}` : delta}
                  </td>
                  <td className="py-2 pl-3 text-muted-foreground">{row.reason ?? "—"}</td>
                </tr>
              );
            })}
            <tr>
              <td className="pt-3 font-semibold">Итого</td>
              <td className="pt-3 text-right tabular-nums font-semibold text-emerald-600">{mockCandidates[0].score}</td>
              <td className="pt-3 text-right tabular-nums font-semibold text-muted-foreground">{mockCandidates[1].score}</td>
              <td className="pt-3 text-right tabular-nums font-semibold text-emerald-600">+{mockCandidates[0].score - mockCandidates[1].score}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Slot constraints */}
      <div className="bg-card border border-card-border rounded-lg p-5 mb-4">
        <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
          <Filter className="w-4 h-4" /> Правила слота (фильтры участия)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <Rule label="Whitelist сегментов"  value="muzyka, teatr, festivali" />
          <Rule label="Гео"                    value="RU (вся страна)" />
          <Rule label="Устройства"             value="Desktop + Mobile" />
          <Rule label="Минимальный приоритет" value="≥ 50" />
          <Rule label="Расписание показа"     value="Круглосуточно" />
          <Rule label="Лимит частоты"          value="≤ 3 показа / 24ч / user" />
          <Rule label="Скоринговая формула"    value="prio + segment + freshness + ctr + ab − fatigue" mono />
          <Rule label="Win-strategy"           value="Highest score (carousel: top-{slot.capacity})" />
        </div>
      </div>

      {/* Candidates queue */}
      <div className="bg-card border border-card-border rounded-lg p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold inline-flex items-center gap-2">
            <Layers className="w-4 h-4" /> Очередь кандидатов ({mockCandidates.length})
          </h3>
          <span className="text-[11px] text-muted-foreground">Сортировка по скору</span>
        </div>

        <div className="flex flex-col gap-2">
          {mockCandidates.map((c) => {
            const sm = statusMeta[c.status];
            const Icon = sm.icon;
            return (
              <div key={c.id} className={`p-3 rounded border ${c.status === "winner" ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/10" : "border-border"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${sm.cls}`}>
                        <Icon className="w-3 h-3" /> {sm.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.type.replace("_", " ")}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                    </div>
                    <div className="text-sm font-medium mt-1">{c.title}</div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.segments.map((s) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                      ))}
                    </div>

                    {c.override && (
                      <div className="mt-2 text-[11px] inline-flex items-center gap-1 text-amber-700">
                        <Pin className="w-3 h-3" /> Закреплено вручную: {c.override.by} до {formatDateTime(c.override.until)}
                      </div>
                    )}
                    {c.schedule && !c.override && (
                      <div className="mt-2 text-[11px] inline-flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" /> {c.schedule}
                      </div>
                    )}
                    {c.ineligibleReason && (
                      <div className="mt-2 text-[11px] inline-flex items-center gap-1 text-rose-700">
                        <Info className="w-3 h-3" /> {c.ineligibleReason}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <div className={`text-2xl font-semibold tabular-nums ${c.status === "winner" ? "text-emerald-600" : c.status === "ineligible" ? "text-muted-foreground" : ""}`}>
                      {c.status === "ineligible" ? "—" : c.score}
                    </div>
                    <div className="text-[10px] text-muted-foreground">скор</div>
                    <HubLink
                      href={c.type === "promo_block" ? `/admin/promo-blocks/${c.id}` : c.type === "event" ? `/admin/events/${c.id}` : `/admin/collections/${c.id}`}
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-2"
                    >
                      Открыть
                    </HubLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit */}
      <div className="bg-card border border-card-border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
          <History className="w-4 h-4" /> История изменений слота
        </h3>
        <ul className="flex flex-col gap-1.5">
          {auditLog.map((e, i) => (
            <li key={i} className="text-xs flex items-start gap-3 p-2 rounded hover:bg-accent">
              <span className="text-muted-foreground tabular-nums shrink-0 w-32">{formatDateTime(e.at)}</span>
              <span className="text-muted-foreground shrink-0 w-32 truncate">{e.who}</span>
              <span>{e.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}

function Rule({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded border border-border p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={`text-xs mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
