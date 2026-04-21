import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs } from "@/components/shared/Tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { Star, Check, X, Flag, MessageSquare, ShieldAlert, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";

type Status = "pending" | "approved" | "rejected";
type Sentiment = "positive" | "neutral" | "negative";
type Subject = "event" | "venue" | "supplier";

interface Review {
  id: string;
  buyer: string;
  buyerVerified: boolean;
  subjectType: Subject;
  subjectName: string;
  supplier: string;
  rating: number;
  text: string;
  status: Status;
  sentiment: Sentiment;
  flags: string[];
  hasReply: boolean;
  createdAt: string;
}

const mockReviews: Review[] = [
  { id: "REV-101", buyer: "Алия Бекова",       buyerVerified: true,  subjectType: "event",    subjectName: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", rating: 5, text: "Отличное мероприятие, всё прошло на высоте! Очень понравилась организация и звук.",                  status: "approved", sentiment: "positive", flags: [],                          hasReply: true,  createdAt: "2026-04-21T09:00:00Z" },
  { id: "REV-100", buyer: "Темирлан Жумабаев", buyerVerified: true,  subjectType: "event",    subjectName: "Astana Jazz",       supplier: "JazzMedia",         rating: 4, text: "Хороший концерт, но звук в центре зала был средний.",                                                  status: "pending",  sentiment: "neutral",  flags: [],                          hasReply: false, createdAt: "2026-04-20T22:00:00Z" },
  { id: "REV-099", buyer: "Мария Петрова",     buyerVerified: false, subjectType: "venue",    subjectName: "Алатау Арена",      supplier: "—",                 rating: 1, text: "Шутки были слабые. Жалею о потраченном времени. Билеты завышены.",                                     status: "pending",  sentiment: "negative", flags: ["низкая оценка"],          hasReply: false, createdAt: "2026-04-20T23:00:00Z" },
  { id: "REV-098", buyer: "Арман Дюсенов",     buyerVerified: true,  subjectType: "event",    subjectName: "Детский фестиваль", supplier: "KidsFest LLP",      rating: 5, text: "Дети в восторге, очень рекомендую!",                                                                   status: "approved", sentiment: "positive", flags: [],                          hasReply: false, createdAt: "2026-04-18T20:00:00Z" },
  { id: "REV-097", buyer: "Сания Нурланова",   buyerVerified: false, subjectType: "event",    subjectName: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", rating: 2, text: "Спам спам спам spam.com купите дешевле здесь...",                                                       status: "rejected", sentiment: "negative", flags: ["спам", "ссылки"],         hasReply: false, createdAt: "2026-04-19T11:00:00Z" },
  { id: "REV-096", buyer: "Дамир Касенов",     buyerVerified: true,  subjectType: "supplier", subjectName: "Star Events",       supplier: "Star Events",       rating: 3, text: "Покупка прошла нормально, но возврат заняло 2 недели — это слишком долго.",                            status: "pending",  sentiment: "neutral",  flags: ["упоминает возврат"],      hasReply: false, createdAt: "2026-04-21T11:30:00Z" },
  { id: "REV-095", buyer: "Гость",              buyerVerified: false, subjectType: "venue",    subjectName: "Музей Кастеева",   supplier: "—",                 rating: 1, text: "Хамство персонала! Не рекомендую никому, лучше идите в другой музей!!!",                              status: "pending",  sentiment: "negative", flags: ["низкая оценка", "капс"], hasReply: false, createdAt: "2026-04-21T08:15:00Z" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`} />
      ))}
    </span>
  );
}

function SentimentChip({ s }: { s: Sentiment }) {
  const map = {
    positive: { label: "Позитив",  className: "bg-emerald-100 text-emerald-700", icon: ThumbsUp },
    neutral:  { label: "Нейтрал",  className: "bg-slate-100 text-slate-700",     icon: Sparkles },
    negative: { label: "Негатив",  className: "bg-red-100 text-red-700",         icon: ThumbsDown },
  }[s];
  const Icon = map.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${map.className}`}>
      <Icon className="w-2.5 h-2.5" /> {map.label}
    </span>
  );
}

const subjectLabel: Record<Subject, string> = { event: "Событие", venue: "Площадка", supplier: "Поставщик" };

export default function ReviewsList() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Status | "all" | "flagged">("pending");
  const [subject, setSubject] = useState<string>("all");
  const [rating, setRating] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = mockReviews.filter((r) => {
    const matchSearch = !search || r.buyer.toLowerCase().includes(search.toLowerCase()) || r.subjectName.toLowerCase().includes(search.toLowerCase()) || r.text.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" ? true : tab === "flagged" ? r.flags.length > 0 : r.status === tab;
    return matchSearch && matchTab && (subject === "all" || r.subjectType === subject) && (rating === "all" || String(r.rating) === rating);
  });

  const stats = {
    total: mockReviews.length,
    pending: mockReviews.filter(r => r.status === "pending").length,
    approved: mockReviews.filter(r => r.status === "approved").length,
    rejected: mockReviews.filter(r => r.status === "rejected").length,
    flagged: mockReviews.filter(r => r.flags.length > 0).length,
    avgRating: (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1),
  };

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: mockReviews.filter((r) => r.rating === star).length,
    pct: (mockReviews.filter((r) => r.rating === star).length / mockReviews.length) * 100,
  }));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const toggleAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(r => r.id)));

  const columns: Column<Review>[] = [
    { key: "select", header: (
      <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
    ) as any, cell: (r) => (
      <input type="checkbox" checked={selected.has(r.id)} onChange={(e) => { e.stopPropagation(); toggle(r.id); }} onClick={(e) => e.stopPropagation()} className="rounded" />
    )},
    { key: "buyer", header: "Автор", cell: (r) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium inline-flex items-center gap-1">
          {r.buyer}
          {r.buyerVerified && <span title="Верифицированный покупатель" className="text-emerald-600 text-[10px]">●</span>}
        </span>
        <span className="text-[10px] text-muted-foreground">{r.id}</span>
      </div>
    )},
    { key: "subject", header: "Объект отзыва", cell: (r) => (
      <div className="flex flex-col">
        <span className="text-sm">{r.subjectName}</span>
        <span className="text-xs text-muted-foreground">{subjectLabel[r.subjectType]} · {r.supplier}</span>
      </div>
    )},
    { key: "rating", header: "Оценка", cell: (r) => <Stars rating={r.rating} /> },
    { key: "sentiment", header: "Тон", cell: (r) => <SentimentChip s={r.sentiment} /> },
    { key: "text", header: "Текст", cell: (r) => (
      <div className="max-w-xs">
        <p className="text-sm line-clamp-2">{r.text}</p>
        {r.flags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {r.flags.map((f) => (
              <span key={f} className="inline-flex items-center gap-0.5 text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                <Flag className="w-2.5 h-2.5" /> {f}
              </span>
            ))}
          </div>
        )}
      </div>
    )},
    { key: "status", header: "Статус", cell: (r) => (
      <div className="flex flex-col gap-1 items-start">
        <StatusBadge status={r.status} />
        {r.hasReply && <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground"><MessageSquare className="w-2.5 h-2.5" /> с ответом</span>}
      </div>
    )},
    { key: "date", header: "Дата", cell: (r) => <span className="text-xs">{formatDateTime(r.createdAt)}</span> },
    { key: "actions", header: "", cell: (r) => (
      r.status === "pending" ? (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button className="p-1 rounded hover:bg-emerald-50 text-emerald-600" title="Одобрить" data-testid={`button-approve-${r.id}`}><Check className="w-3.5 h-3.5" /></button>
          <button className="p-1 rounded hover:bg-red-50 text-red-600" title="Отклонить" data-testid={`button-reject-${r.id}`}><X className="w-3.5 h-3.5" /></button>
        </div>
      ) : null
    )},
  ];

  return (
    <AdminLayout title="Отзывы" breadcrumbs={[{ label: "Администратор" }, { label: "Поддержка" }, { label: "Отзывы" }]}>
      <PageHeader
        title="Отзывы"
        description={`${stats.total} отзывов · средняя оценка ${stats.avgRating} · ${stats.pending} ожидают модерации · ${stats.flagged} с флагами`}
        actions={selected.size > 0 ? (
          <>
            <span className="text-xs text-muted-foreground self-center mr-2">Выбрано: {selected.size}</span>
            <Button variant="outline" size="sm" data-testid="button-bulk-approve"><Check className="w-3.5 h-3.5 mr-1" /> Одобрить</Button>
            <Button variant="outline" size="sm" data-testid="button-bulk-reject"><X className="w-3.5 h-3.5 mr-1" /> Отклонить</Button>
          </>
        ) : undefined}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <KCell label="Средняя оценка" value={stats.avgRating} hint={<Stars rating={Math.round(Number(stats.avgRating))} />} />
        <KCell label="На модерации" value={String(stats.pending)} hint={`${stats.approved} одобрено, ${stats.rejected} отклонено`} accent="warn" />
        <KCell label="С флагами" value={String(stats.flagged)} hint="спам, негатив, капс" accent={stats.flagged > 0 ? "warn" : undefined} />
        <div className="bg-card border border-card-border rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Распределение оценок</span>
          <div className="mt-1.5 space-y-1">
            {ratingDist.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="w-3 tabular-nums">{d.star}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-yellow-400 h-full" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-6 text-right tabular-nums text-muted-foreground">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs
        items={[
          { key: "pending",  label: "На модерации", count: stats.pending },
          { key: "flagged",  label: "С флагами",     count: stats.flagged },
          { key: "approved", label: "Одобрены",      count: stats.approved },
          { key: "rejected", label: "Отклонены",     count: stats.rejected },
          { key: "all",      label: "Все",            count: stats.total },
        ]}
        active={tab}
        onChange={(v) => setTab(v as Status | "all" | "flagged")}
      />

      <FilterBar
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Поиск по тексту, автору, объекту..."
        filters={
          <>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-40" data-testid="select-review-subject"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все объекты</SelectItem>
                <SelectItem value="event">События</SelectItem>
                <SelectItem value="venue">Площадки</SelectItem>
                <SelectItem value="supplier">Поставщики</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger className="w-36" data-testid="select-review-rating"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все оценки</SelectItem>
                <SelectItem value="5">5 звёзд</SelectItem>
                <SelectItem value="4">4 звезды</SelectItem>
                <SelectItem value="3">3 звезды</SelectItem>
                <SelectItem value="2">2 звезды</SelectItem>
                <SelectItem value="1">1 звезда</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {stats.flagged > 0 && tab === "pending" && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 mb-3 flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{stats.flagged} отзывов помечены автомодерацией. Перейдите на вкладку <strong>«С флагами»</strong> для приоритетного разбора.</span>
        </div>
      )}

      <DataTable columns={columns} data={filtered} emptyMessage="Отзывы не найдены" data-testid="table-reviews" />
    </AdminLayout>
  );
}

function KCell({ label, value, hint, accent }: { label: string; value: string; hint?: React.ReactNode; accent?: "warn" }) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-4">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      <p className={`text-xl font-semibold tabular-nums mt-1 ${accent === "warn" ? "text-amber-600" : ""}`}>{value}</p>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}
