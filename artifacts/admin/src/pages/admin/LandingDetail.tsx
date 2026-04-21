import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { TrafficStatsCards, TopKeywordsTable } from "@/components/shared/TrafficStats";
import { IssueList } from "@/components/shared/IssueList";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit2, Eye, Globe2, MapPin, Layers, ListOrdered, Plus, X, Image as ImageIcon, FileText } from "lucide-react";

type Scope = "global" | "single_city" | "multi_city";

const initial = {
  id: "LND-007",
  title: "Stand Up афиша по Казахстану",
  slug: "standup",
  type: "category",
  status: "published",
  scope: "multi_city" as Scope,
  cities: [
    { slug: "almaty",   name: "Алматы",  visits30d: 12_400, position: 4.2, lastDeployed: "2026-04-15" },
    { slug: "astana",   name: "Астана",  visits30d: 9_800,  position: 5.1, lastDeployed: "2026-04-15" },
    { slug: "shymkent", name: "Шымкент", visits30d: 4_200,  position: 8.4, lastDeployed: "2026-04-15" },
  ],
  availableCities: [
    { slug: "karaganda", name: "Караганда" },
    { slug: "aktobe",    name: "Актобе" },
  ],
  metaTitleTemplate: "Stand Up в {city_loc} — афиша 2025 | Daibilet",
  metaDescriptionTemplate: "Купите билеты на лучшие Stand Up шоу в {city_loc}. Расписание, цены, гарантия подлинности.",
  h1Template: "Stand Up афиша — {city_nom}",
  introTemplate: "Все ближайшие Stand Up концерты и комедийные вечера в {city_loc}. Покупайте билеты онлайн с моментальной доставкой на e-mail.",
  blocks: [
    { type: "intro", title: "Intro {city}" },
    { type: "events_grid", title: "Ближайшие шоу" },
    { type: "promo_block", title: "Главные Stand Up события" },
    { type: "venues_list", title: "Где смотреть Stand Up в городе" },
    { type: "faq", title: "Вопросы и ответы" },
  ],
  faqs: [
    { q: "Сколько стоит билет на Stand Up?", a: "Цены зависят от исполнителя и площадки, обычно от 4 000 до 15 000 ₸." },
    { q: "Можно ли вернуть билет?", a: "Да, согласно правилам организатора. Уточните на странице события." },
  ],
  ogImageTemplate: "/og/standup-{city}.jpg",
  canonicalTemplate: "https://daibilet.kz/{city}/standup/",
  traffic: {
    visits30d: 26_400,
    organicShare: 88,
    avgPosition: 6.2,
    ctr: 4.1,
    delta: 14.0,
    topKeywords: [
      { kw: "stand up алматы",   pos: 3, visits: 6_800 },
      { kw: "стендап астана",     pos: 5, visits: 4_200 },
      { kw: "стендап билеты",     pos: 7, visits: 3_900 },
      { kw: "комедия алматы",     pos: 6, visits: 2_400 },
      { kw: "стендап концерт",    pos: 8, visits: 1_800 },
    ],
  },
  seoIssues: [
    { id: "1", severity: "warning" as const, title: "Шаблон H1 не использует {city_loc}", description: "Сейчас в H1 используется {city_nom}. Рекомендуется добавить локативную форму." },
    { id: "2", severity: "info" as const,    title: "Не настроена гиперлокализация в Шымкенте", description: "Для города visits30d ниже среднего на 60%." },
  ],
  createdAt: "2026-01-10",
  updatedAt: "2026-04-10",
};

export default function LandingDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [scope, setScope] = useState<Scope>(initial.scope);
  const [cities, setCities] = useState(initial.cities);

  const previewUrl = (() => {
    if (scope === "global") return initial.slug ? `daibilet.kz/${initial.slug}/` : `daibilet.kz/`;
    if (scope === "multi_city") return `daibilet.kz/{city}/${initial.slug}/`;
    return `daibilet.kz/${cities[0]?.slug ?? "{city}"}/${initial.slug}/`;
  })();

  const totalCityVisits = cities.reduce((s, c) => s + c.visits30d, 0);

  return (
    <AdminLayout
      title={initial.title}
      breadcrumbs={[{ label: "Администратор" }, { label: "Лендинги", href: "/admin/landings" }, { label: initial.title }]}
    >
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2 flex-wrap">
            {initial.title}
            <ScopeBadge scope={scope} />
            <StatusBadge status={initial.status} />
          </span>
        }
        description={
          <span className="font-mono text-sm">{previewUrl}</span>
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/landings")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button variant="outline" size="sm" data-testid="button-preview-landing"><Eye className="w-4 h-4 mr-1.5" /> Просмотр</Button>
            <Button size="sm" data-testid="button-edit-landing"><Edit2 className="w-4 h-4 mr-1.5" /> Редактировать</Button>
          </>
        }
      />

      <Tabs
        items={[
          { key: "overview", label: "Обзор" },
          { key: "scope", label: "Scope & города", count: scope === "multi_city" ? cities.length : undefined },
          { key: "content", label: "Контент" },
          { key: "seo", label: "SEO & трафик" },
          { key: "audit", label: "Служебные" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <TrafficStatsCards t={initial.traffic} />

          {scope === "multi_city" && (
            <div className="bg-card border border-card-border rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold">Развёрнут в городах</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Один шаблон, {cities.length} городовых страниц · итого {totalCityVisits.toLocaleString("ru-RU")} визитов / 30 дн
                </p>
              </div>
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Город</th>
                    <th className="text-left px-4 py-2 font-medium">URL</th>
                    <th className="text-right px-4 py-2 font-medium">Визиты / 30 дн</th>
                    <th className="text-right px-4 py-2 font-medium">Сред. позиция</th>
                    <th className="text-left px-4 py-2 font-medium">Развёрнут</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((c) => (
                    <tr key={c.slug} className="border-t border-border">
                      <td className="px-4 py-2 font-medium">{c.name}</td>
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">/{c.slug}/{initial.slug}/</td>
                      <td className="px-4 py-2 text-right tabular-nums">{c.visits30d.toLocaleString("ru-RU")}</td>
                      <td className={`px-4 py-2 text-right tabular-nums ${c.position <= 5 ? "text-emerald-600 font-medium" : c.position <= 10 ? "" : "text-amber-600"}`}>
                        {c.position.toFixed(1)}
                      </td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{formatDate(c.lastDeployed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "scope" && (
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Тип развёртывания</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <ScopeOption value="global"      current={scope} onSelect={setScope} icon={Globe2} title="Глобальный"        desc="Одна страница на весь сайт" example={initial.slug ? `/${initial.slug}/` : "/"} />
              <ScopeOption value="single_city" current={scope} onSelect={setScope} icon={MapPin} title="Один город"         desc="Жёсткая привязка к одному городу" example={`/${cities[0]?.slug ?? "almaty"}/${initial.slug}/`} />
              <ScopeOption value="multi_city"  current={scope} onSelect={setScope} icon={Layers} title="Мульти-городовой"  desc="Один шаблон, развёрнутый на N городов"   example={`/{city}/${initial.slug}/`} />
            </div>
          </div>

          {scope !== "global" && (
            <div className="bg-card border border-card-border rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Города ({cities.length})</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {scope === "single_city" ? "Лендинг доступен только в выбранном городе." : "Шаблон будет развёрнут отдельной страницей в каждом городе."}
                  </p>
                </div>
                {scope === "multi_city" && initial.availableCities.length > 0 && (
                  <Select onValueChange={(v) => {
                    const found = initial.availableCities.find((c) => c.slug === v);
                    if (found) setCities([...cities, { ...found, visits30d: 0, position: 0, lastDeployed: new Date().toISOString() }]);
                  }}>
                    <SelectTrigger className="w-48" data-testid="select-add-city"><SelectValue placeholder="Добавить город..." /></SelectTrigger>
                    <SelectContent>
                      {initial.availableCities.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <ul>
                {cities.map((c) => (
                  <li key={c.slug} className="flex items-center gap-3 px-5 py-2.5 border-t border-border first:border-t-0">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm">{c.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">/{c.slug}/{initial.slug}/</span>
                    <span className="flex-1" />
                    {scope === "multi_city" && cities.length > 1 && (
                      <button
                        onClick={() => setCities(cities.filter((x) => x.slug !== c.slug))}
                        className="text-muted-foreground hover:text-red-600 p-1"
                        data-testid={`button-remove-city-${c.slug}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scope === "multi_city" && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200">
              <strong>Подсказка по гиперлокализации:</strong> в шаблонах H1, intro, meta-тегов и FAQ доступны переменные:
              <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded mx-1">{"{city_nom}"}</code>(Алматы),
              <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded mx-1">{"{city_loc}"}</code>(Алматы),
              <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded mx-1">{"{city_gen}"}</code>(Алматы).
              При деплое значения подставляются автоматически.
            </div>
          )}
        </div>
      )}

      {tab === "content" && (
        <div className="flex flex-col gap-4">
          <DetailSection title={scope === "multi_city" ? "Шаблоны (с переменными {city_*})" : "Контент"}>
            <DetailField label="H1" value={scope === "multi_city" ? initial.h1Template : initial.h1Template.replace("{city_nom}", cities[0]?.name ?? "")} className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="Intro" value={scope === "multi_city" ? initial.introTemplate : initial.introTemplate.replace("{city_loc}", cities[0]?.name ?? "")} className="sm:col-span-2 lg:col-span-3" />
          </DetailSection>

          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><ListOrdered className="w-4 h-4" /> Блоки страницы</h3>
              <Button variant="outline" size="sm"><Plus className="w-3.5 h-3.5 mr-1" /> Добавить блок</Button>
            </div>
            <ul>
              {initial.blocks.map((b, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-2.5 border-t border-border first:border-t-0 hover:bg-accent/40">
                  <span className="text-xs font-mono text-muted-foreground w-6">#{i + 1}</span>
                  <span className="flex-1 text-sm">{b.title}</span>
                  <span className="text-xs text-muted-foreground font-mono">{b.type}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> OG-изображение</h3>
              <Button variant="outline" size="sm">Заменить</Button>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{initial.ogImageTemplate}</p>
          </div>

          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> FAQ</h3>
              <Button variant="outline" size="sm">Добавить</Button>
            </div>
            <ul>
              {initial.faqs.map((f, i) => (
                <li key={i} className="px-5 py-3 border-t border-border first:border-t-0">
                  <p className="text-sm font-medium mb-1">{f.q}</p>
                  <p className="text-xs text-muted-foreground">{f.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "seo" && (
        <div className="flex flex-col gap-4">
          <TrafficStatsCards t={initial.traffic} />
          <DetailSection title={scope === "multi_city" ? "Meta-шаблоны" : "Meta-теги"}>
            <DetailField label="Meta Title" value={initial.metaTitleTemplate} className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="Meta Description" value={initial.metaDescriptionTemplate} className="sm:col-span-2 lg:col-span-3" />
            <DetailField label="Canonical" value={initial.canonicalTemplate} readOnly className="sm:col-span-2 lg:col-span-2" />
          </DetailSection>
          <TopKeywordsTable keywords={initial.traffic.topKeywords} />
          <IssueList title="SEO замечания" issues={initial.seoIssues} />
        </div>
      )}

      {tab === "audit" && (
        <DetailSection title="Служебные поля">
          <DetailField label="ID" value={initial.id} readOnly />
          <DetailField label="Тип" value={initial.type} readOnly />
          <DetailField label="Slug" value={initial.slug} />
          <DetailField label="Создан" value={formatDate(initial.createdAt)} readOnly />
          <DetailField label="Обновлён" value={formatDate(initial.updatedAt)} readOnly />
        </DetailSection>
      )}
    </AdminLayout>
  );
}

function ScopeBadge({ scope }: { scope: Scope }) {
  const m = {
    global: { label: "Глобальный", className: "bg-slate-100 text-slate-700", Icon: Globe2 },
    single_city: { label: "Один город", className: "bg-emerald-100 text-emerald-700", Icon: MapPin },
    multi_city: { label: "Мульти-городовой", className: "bg-blue-100 text-blue-700", Icon: Layers },
  }[scope];
  const Icon = m.Icon;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.className}`}><Icon className="w-3 h-3" /> {m.label}</span>;
}

function ScopeOption({ value, current, onSelect, icon: Icon, title, desc, example }: {
  value: Scope; current: Scope; onSelect: (v: Scope) => void; icon: typeof Globe2; title: string; desc: string; example: string;
}) {
  const active = value === current;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`text-left rounded-lg p-4 border-2 transition-colors ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
      data-testid={`scope-option-${value}`}
    >
      <Icon className={`w-4 h-4 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-sm font-medium mb-0.5">{title}</p>
      <p className="text-xs text-muted-foreground mb-2">{desc}</p>
      <p className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded inline-block">{example}</p>
    </button>
  );
}
