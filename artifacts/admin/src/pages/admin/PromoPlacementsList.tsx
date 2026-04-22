import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { HubLink } from "@/components/shared/HubLink";
import { Button } from "@/components/ui/button";
import { LayoutGrid, AlertTriangle, CheckCircle2, Clock, ArrowRight, Layers, Target, Trophy } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface Slot {
  id: string;
  page: "home" | "landing" | "category" | "city";
  pageRef: { label: string; href: string } | null;
  position: string;
  area: string;
  size: string;
  type: "single" | "carousel" | "grid";
  capacity: number;
  candidates: number;
  winnerId: string | null;
  winnerTitle: string | null;
  winnerScore?: number;
  conflict?: "competition" | "empty" | "scheduled" | "expired" | "ok";
  impressions24h?: number;
  ctr24h?: number;
  scheduledNext?: { startsAt: string; title: string };
}

export const mockSlots: Slot[] = [
  {
    id: "PLC-HOME-HERO", page: "home", pageRef: { label: "Главная (RU)", href: "/" }, position: "Hero (главный баннер)",
    area: "above-the-fold", size: "1440×500", type: "carousel", capacity: 3, candidates: 7,
    winnerId: "PRB-002", winnerTitle: "Главные концерты весны", winnerScore: 92,
    conflict: "competition", impressions24h: 184_200, ctr24h: 4.2,
    scheduledNext: { startsAt: "2026-04-25", title: "Майские праздники — открытие сезона" },
  },
  {
    id: "PLC-HOME-A1",   page: "home", pageRef: { label: "Главная (RU)", href: "/" }, position: "Слот A1 (после hero)",
    area: "fold-1", size: "1240×360", type: "single", capacity: 1, candidates: 4,
    winnerId: "PRB-001", winnerTitle: "Летние фестивали — главный баннер", winnerScore: 88,
    conflict: "ok", impressions24h: 148_400, ctr24h: 3.1,
  },
  {
    id: "PLC-HOME-B1",   page: "home", pageRef: { label: "Главная (RU)", href: "/" }, position: "Подборка B1",
    area: "fold-2", size: "1240×420", type: "grid", capacity: 6, candidates: 12,
    winnerId: "COL-001", winnerTitle: "Лучшее в Москве (подборка)", winnerScore: 76,
    conflict: "competition", impressions24h: 92_400, ctr24h: 5.8,
  },
  {
    id: "PLC-HOME-SIDE", page: "home", pageRef: { label: "Главная (RU)", href: "/" }, position: "Sidebar (правая колонка)",
    area: "right", size: "320×600", type: "single", capacity: 1, candidates: 0,
    winnerId: null, winnerTitle: null, conflict: "empty", impressions24h: 0,
  },
  {
    id: "PLC-HOME-STRIP", page: "home", pageRef: { label: "Главная (RU)", href: "/" }, position: "Header strip (промо-полоса)",
    area: "header", size: "1440×48", type: "single", capacity: 1, candidates: 2,
    winnerId: "PRB-004", winnerTitle: "Скидка 15% на weekend", winnerScore: 64,
    conflict: "expired", impressions24h: 184_200, ctr24h: 0.8,
  },

  {
    id: "PLC-MOSC-HERO", page: "city", pageRef: { label: "Москва", href: "/admin/cities/CTY-001" }, position: "Hero города",
    area: "above-the-fold", size: "1440×360", type: "single", capacity: 1, candidates: 3,
    winnerId: "PRB-005", winnerTitle: "Афиша Москвы — апрель", winnerScore: 84,
    conflict: "ok", impressions24h: 42_100, ctr24h: 3.6,
  },
  {
    id: "PLC-LND001-HOTS", page: "landing", pageRef: { label: "Главная Москвы (LND-001)", href: "/admin/landings/LND-001" },
    position: "Блок «Хиты» (события-чемпионы)", area: "fold-1", size: "1240×420", type: "carousel", capacity: 8, candidates: 18,
    winnerId: "EVT-001", winnerTitle: "Ночь музыки 2025 + ещё 7", winnerScore: 81,
    conflict: "competition", impressions24h: 52_400, ctr24h: 6.2,
  },
  {
    id: "PLC-LND007-FEAT", page: "landing", pageRef: { label: "Stand Up афиша по КЗ (LND-007)", href: "/admin/landings/LND-007" },
    position: "Featured (вверху подборки)", area: "fold-1", size: "1240×320", type: "single", capacity: 1, candidates: 0,
    winnerId: null, winnerTitle: null, conflict: "scheduled",
    scheduledNext: { startsAt: "2026-05-01", title: "Большой Stand Up — Москва" },
  },
];

const pageLabels: Record<Slot["page"], string> = {
  home: "Главная", landing: "Лендинги", city: "Города", category: "Категории",
};

const conflictMeta: Record<NonNullable<Slot["conflict"]>, { label: string; cls: string; icon: React.ElementType }> = {
  competition: { label: "Конкуренция", cls: "bg-amber-100 text-amber-700 border-amber-200",  icon: Trophy },
  empty:       { label: "Пусто",        cls: "bg-rose-100 text-rose-700 border-rose-200",     icon: AlertTriangle },
  scheduled:   { label: "В расписании",  cls: "bg-blue-100 text-blue-700 border-blue-200",     icon: Clock },
  expired:     { label: "Истекает",      cls: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertTriangle },
  ok:          { label: "ОК",            cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
};

export default function PromoPlacementsList() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Slot["page"] | "all">("all");

  const filtered = tab === "all" ? mockSlots : mockSlots.filter((s) => s.page === tab);

  const stats = {
    total: mockSlots.length,
    competition: mockSlots.filter((s) => s.conflict === "competition").length,
    empty: mockSlots.filter((s) => s.conflict === "empty").length,
    expired: mockSlots.filter((s) => s.conflict === "expired").length,
  };

  return (
    <AdminLayout
      title="Промо-размещения"
      breadcrumbs={[{ label: "Администратор" }, { label: "Промо-размещения" }]}
    >
      <PageHeader
        title="Промо-размещения (Placements)"
        description="Слоты на сайте, в которых соревнуются промо-блоки. Здесь видно, кто победил, кто на скамейке запасных, и почему именно так."
        actions={
          <Button size="sm" variant="outline" onClick={() => setLocation("/admin/promo-blocks")}>
            <Layers className="w-4 h-4 mr-1.5" /> К промо-блокам
          </Button>
        }
      />

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-4 text-sm text-blue-900 dark:text-blue-200">
        <p>
          <strong>Размещение ≠ блок.</strong> Размещение — это <em>физический слот</em> на странице (hero главной, sidebar, блок «Хиты» лендинга).
          В каждом слоте за показ конкурирует несколько промо-блоков; на витрине показывается победитель по скорингу
          (приоритет × сегмент × расписание × A/B). Зайдите в любой слот, чтобы посмотреть «почему показано».
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<LayoutGrid className="w-4 h-4" />}    label="Слотов всего"    value={stats.total} />
        <StatCard icon={<Trophy className="w-4 h-4" />}        label="Конкуренция"     value={stats.competition} accent="amber" />
        <StatCard icon={<AlertTriangle className="w-4 h-4" />}  label="Пустых слотов"  value={stats.empty}       accent="rose" />
        <StatCard icon={<Clock className="w-4 h-4" />}          label="Истекают <24ч" value={stats.expired}     accent="orange" />
      </div>

      <Tabs
        items={[
          { key: "all",      label: `Все (${mockSlots.length})` },
          { key: "home",     label: `Главная (${mockSlots.filter(s => s.page === "home").length})` },
          { key: "landing",  label: `Лендинги (${mockSlots.filter(s => s.page === "landing").length})` },
          { key: "city",     label: `Города (${mockSlots.filter(s => s.page === "city").length})` },
        ]}
        active={tab}
        onChange={(k) => setTab(k as Slot["page"] | "all")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((slot) => {
          const cm = conflictMeta[slot.conflict ?? "ok"];
          const Icon = cm.icon;
          return (
            <div
              key={slot.id}
              onClick={() => setLocation(`/admin/promo-placements/${slot.id}`)}
              className="bg-card border border-card-border rounded-lg p-4 hover:border-primary cursor-pointer transition"
              data-testid={`row-placement-${slot.id}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                    {pageLabels[slot.page]} · {slot.id}
                  </div>
                  <h3 className="text-sm font-semibold truncate">{slot.position}</h3>
                  {slot.pageRef && (
                    <div className="mt-0.5 text-[11px]">
                      <HubLink href={slot.pageRef.href} className="text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                        {slot.pageRef.label}
                      </HubLink>
                    </div>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${cm.cls}`}>
                  <Icon className="w-3 h-3" /> {cm.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] mb-3">
                <Metric label="Размер"   value={slot.size} mono />
                <Metric label="Тип"      value={slot.type === "single" ? "1 слот" : slot.type === "carousel" ? `Карусель ×${slot.capacity}` : `Сетка ×${slot.capacity}`} />
                <Metric label="Кандидатов" value={slot.candidates}  accent={slot.candidates === 0 ? "muted" : slot.candidates > slot.capacity ? "amber" : undefined} />
              </div>

              {slot.winnerId ? (
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Сейчас на витрине
                      </div>
                      <div className="text-sm font-medium truncate">{slot.winnerTitle}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{slot.winnerId}</div>
                    </div>
                    {slot.winnerScore != null && (
                      <div className="shrink-0 text-right">
                        <div className="text-lg font-semibold tabular-nums">{slot.winnerScore}</div>
                        <div className="text-[10px] text-muted-foreground">скор</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-2 rounded border border-dashed border-rose-300 text-xs text-rose-700">
                  {slot.conflict === "scheduled" && slot.scheduledNext
                    ? <>Сейчас пусто. Следующий: <span className="font-medium">{slot.scheduledNext.title}</span> с {formatDate(slot.scheduledNext.startsAt)}</>
                    : "Слот пуст — нет активных кандидатов"}
                </div>
              )}

              {slot.impressions24h != null && (
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                  <span>Показы 24ч: <span className="text-foreground font-medium tabular-nums">{slot.impressions24h.toLocaleString("ru-RU")}</span></span>
                  {slot.ctr24h != null && <span>CTR: <span className="text-foreground font-medium tabular-nums">{slot.ctr24h}%</span></span>}
                  <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: "amber" | "rose" | "orange" }) {
  const cls = accent === "amber" ? "text-amber-600" : accent === "rose" ? "text-rose-600" : accent === "orange" ? "text-orange-600" : "text-foreground";
  return (
    <div className="bg-card border border-card-border rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold inline-flex items-center gap-1.5">{icon} {label}</div>
      <div className={`text-2xl font-semibold tabular-nums mt-1 ${cls}`}>{value}</div>
    </div>
  );
}

function Metric({ label, value, mono, accent }: { label: string; value: React.ReactNode; mono?: boolean; accent?: "muted" | "amber" }) {
  const cls = accent === "muted" ? "text-muted-foreground" : accent === "amber" ? "text-amber-600" : "text-foreground";
  return (
    <div className="rounded border border-border p-1.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`${mono ? "font-mono" : ""} ${cls} text-xs font-medium`}>{value}</div>
    </div>
  );
}
