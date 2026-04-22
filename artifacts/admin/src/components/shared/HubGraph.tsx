import { HubLink } from "./HubLink";
import { Network, ArrowUpRight } from "lucide-react";

export interface HubGraphLink {
  /** Logical group, e.g. "Город", "Площадка", "Лендинги". */
  group: string;
  /** Top-level node id like "VEN-001" or "Алматы". */
  label: string;
  /** Total count when group is a list (e.g. 12 событий). */
  count?: number;
  /** Internal href to navigate to. Cmd/Ctrl-click opens new tab. */
  href: string;
  /** Lightweight badge text (e.g. role/status). */
  hint?: string;
}

interface HubGraphProps {
  /** Subject of this graph (e.g. "Алматы (CTY-001)"). */
  subject: string;
  /** All connected entities organised by group. */
  links: HubGraphLink[];
  /** Optional health note (broken refs, missing fields). */
  warning?: string;
}

/**
 * Reusable cross-link panel for hub pages (City, Venue, Landing, Event, Supplier).
 * Renders a compact connectivity graph with real ids and "open in new tab" support.
 */
export function HubGraph({ subject, links, warning }: HubGraphProps) {
  const groups = Array.from(new Set(links.map((l) => l.group)));

  return (
    <div className="bg-card border border-card-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold inline-flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" /> Граф связей
        </h3>
        <span className="text-[10px] text-muted-foreground">⌘/Ctrl+клик — в новой вкладке</span>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Реальные перекрёстные ссылки для <span className="font-medium text-foreground">{subject}</span>.
        Все id живые: можно открыть в новой вкладке для параллельной работы.
      </p>

      {warning && (
        <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded text-[11px] text-amber-900 dark:text-amber-200">
          ⚠ {warning}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {groups.map((group) => {
          const items = links.filter((l) => l.group === group);
          return (
            <div key={group} className="border border-border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{group}</span>
                <span className="text-[10px] tabular-nums text-muted-foreground">{items.length}</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {items.map((l, i) => (
                  <li key={i} className="text-xs flex items-center justify-between gap-2 group">
                    <HubLink href={l.href} className="inline-flex items-center gap-1 text-foreground hover:text-primary truncate" showExternal={false}>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                      <span className="truncate">{l.label}</span>
                      {l.count != null && <span className="text-[10px] text-muted-foreground tabular-nums">· {l.count}</span>}
                    </HubLink>
                    {l.hint && <span className="text-[10px] text-muted-foreground shrink-0">{l.hint}</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
