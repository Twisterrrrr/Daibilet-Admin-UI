import { ArrowUp, ArrowDown, MousePointerClick, Search, Eye, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export interface TrafficData {
  visits30d: number;
  organicShare: number;
  avgPosition: number;
  ctr: number;
  delta: number;
  topKeywords: { kw: string; pos: number; visits: number }[];
}

export function TrafficStatsCards({ t }: { t: TrafficData }) {
  const positive = t.delta >= 0;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Cell icon={Eye} label="Визиты / 30 дн" value={formatNumber(t.visits30d)} hint={
        <span className={positive ? "text-emerald-600" : "text-red-600"}>
          {positive ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />}
          {Math.abs(t.delta).toFixed(1)}%
        </span>
      } />
      <Cell icon={Search} label="Доля organic" value={`${t.organicShare}%`} hint="из поисковых систем" />
      <Cell icon={TrendingUp} label="Сред. позиция" value={t.avgPosition.toFixed(1)}
        hint={t.avgPosition <= 5 ? "топ-5" : t.avgPosition <= 10 ? "топ-10" : "ниже топ-10"}
        accent={t.avgPosition <= 5 ? "good" : t.avgPosition <= 10 ? "ok" : "warn"} />
      <Cell icon={MousePointerClick} label="CTR" value={`${t.ctr.toFixed(1)}%`} hint="по показам в SERP" />
    </div>
  );
}

function Cell({ icon: Icon, label, value, hint, accent }: {
  icon: typeof Eye; label: string; value: string; hint?: React.ReactNode; accent?: "good" | "ok" | "warn";
}) {
  const valueClass = accent === "good" ? "text-emerald-600" : accent === "warn" ? "text-amber-600" : "";
  return (
    <div className="bg-card border border-card-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <p className={`text-xl font-semibold tabular-nums ${valueClass}`}>{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

export function TopKeywordsTable({ keywords }: { keywords: TrafficData["topKeywords"] }) {
  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold">Топ ключевых запросов</h3>
        <span className="text-xs text-muted-foreground">за 30 дней</span>
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground bg-muted/50">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Запрос</th>
            <th className="text-right px-4 py-2 font-medium w-20">Позиция</th>
            <th className="text-right px-4 py-2 font-medium w-24">Визиты</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((k) => (
            <tr key={k.kw} className="border-t border-border">
              <td className="px-4 py-2">{k.kw}</td>
              <td className="px-4 py-2 text-right tabular-nums">
                <span className={k.pos <= 5 ? "text-emerald-600 font-medium" : k.pos <= 10 ? "text-foreground" : "text-amber-600"}>
                  {k.pos}
                </span>
              </td>
              <td className="px-4 py-2 text-right tabular-nums">{formatNumber(k.visits)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ContentHubBadge({ isHub }: { isHub: boolean }) {
  return isHub ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
      Контент-хаб
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
      Только справочник
    </span>
  );
}
