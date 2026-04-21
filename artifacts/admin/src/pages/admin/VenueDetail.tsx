import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { ContentHubBadge, TrafficStatsCards, TopKeywordsTable } from "@/components/shared/TrafficStats";
import { IssueList } from "@/components/shared/IssueList";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Edit2, Eye, Image as ImageIcon, FileText, Map, ListOrdered } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const venue = {
  id: "VEN-001",
  name: "Алатау Арена",
  slug: "alatau-arena",
  city: "Алматы", citySlug: "almaty",
  address: "ул. Алтынсарина, 31",
  lat: "43.2364", lng: "76.8978",
  capacity: 12000,
  status: "active",
  isContentHub: true,
  phone: "+7 727 222-33-44",
  website: "https://alatauarena.kz",
  importedSource: "ticketon.kz", sourceId: "VEN-KZT-44",
  // hub content
  h1: "Алатау Арена — расписание событий",
  intro: "Многофункциональный спортивно-концертный комплекс в Алматы. Вместимость 12 000 человек. Здесь проходят крупнейшие концерты, спортивные матчи и шоу.",
  description: "Алатау Арена — современный спортивно-концертный комплекс, открыт в 2016 году. Используется для хоккейных матчей, концертов, выставок и крупных корпоративных мероприятий.",
  hasSeatingMap: true,
  faqs: [
    { q: "Где находится Алатау Арена?", a: "ул. Алтынсарина, 31, Алматы. Парковка для гостей бесплатная." },
    { q: "Сколько мест в зале?", a: "Вместимость зависит от конфигурации: до 12 000 для концертов, 9 600 для хоккея." },
    { q: "Можно ли пройти со своей едой?", a: "Нет, на территории работают официальные точки питания." },
  ],
  blocks: [
    { type: "events_grid", title: "Ближайшие события на площадке" },
    { type: "seating_map", title: "Схема зала" },
    { type: "description", title: "Об арене" },
    { type: "map", title: "Как добраться" },
    { type: "faq", title: "Вопросы и ответы" },
  ],
  // SEO
  metaTitle: "Алатау Арена — афиша концертов и событий | Daibilet",
  metaDescription: "Все события на Алатау Арене в Алматы. Купите билеты онлайн. Схема зала, расписание, цены.",
  ogImage: true,
  canonical: "https://daibilet.kz/almaty/venues/alatau-arena/",
  traffic: {
    visits30d: 24_800,
    organicShare: 78,
    avgPosition: 4.1,
    ctr: 5.4,
    delta: 18.2,
    topKeywords: [
      { kw: "алатау арена", pos: 1, visits: 9_400 },
      { kw: "алатау арена афиша", pos: 2, visits: 5_100 },
      { kw: "концерт алатау арена", pos: 3, visits: 3_800 },
      { kw: "алатау арена схема зала", pos: 5, visits: 2_400 },
      { kw: "алатау арена билеты", pos: 4, visits: 1_900 },
    ],
  },
  upcomingEvents: [
    { id: "EVT-002", title: "Forum на Arena", date: "2026-05-12" },
    { id: "EVT-014", title: "Spring Showcase", date: "2026-05-20" },
  ],
  seoIssues: [
    { id: "1", severity: "info" as const, title: "Можно добавить разметку Place + Event", description: "Это улучшит отображение в поиске и Google Maps." },
  ],
};

export default function VenueDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [hubEnabled, setHubEnabled] = useState(venue.isContentHub);

  return (
    <AdminLayout
      title={venue.name}
      breadcrumbs={[{ label: "Администратор" }, { label: "Площадки", href: "/admin/venues" }, { label: venue.name }]}
    >
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2 flex-wrap">
            {venue.name}
            <ContentHubBadge isHub={hubEnabled} />
            <StatusBadge status={venue.status} />
            <span className="text-sm text-muted-foreground font-normal font-mono">daibilet.kz/{venue.citySlug}/venues/{venue.slug}/</span>
          </span>
        }
        description={`${venue.city} · ${venue.capacity.toLocaleString()} мест · ${formatNumber(venue.traffic.visits30d)} визитов / 30 дн`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/venues")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button variant="outline" size="sm" data-testid="button-preview-venue"><Eye className="w-4 h-4 mr-1.5" /> Посмотреть на сайте</Button>
            <Button size="sm" data-testid="button-edit-venue"><Edit2 className="w-4 h-4 mr-1.5" /> Редактировать</Button>
          </>
        }
      />

      <Tabs
        items={[
          { key: "overview", label: "Обзор" },
          { key: "hub", label: "Контент-хаб" },
          { key: "seo", label: "SEO & трафик" },
          { key: "events", label: "События", count: venue.upcomingEvents.length },
          { key: "audit", label: "Справочник" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <TrafficStatsCards t={venue.traffic} />

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Статус «Контент-хаб»</h3>
                <p className="text-xs text-muted-foreground max-w-lg">
                  Включает SEO-описание, схему зала, FAQ и блоки. Без этого площадка отображается только как краткая карточка в событии.
                </p>
              </div>
              <Switch checked={hubEnabled} onCheckedChange={setHubEnabled} data-testid="switch-venue-hub" />
            </div>
          </div>
        </div>
      )}

      {tab === "hub" && (
        <div className="flex flex-col gap-4">
          {!hubEnabled && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 text-sm">
              Контент-хаб выключен. Включите тумблер на вкладке «Обзор», чтобы редактировать наполнение.
            </div>
          )}

          <DetailSection title="Заголовок и описание">
            <DetailField label="H1" value={venue.h1} className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="Intro" value={venue.intro} className="sm:col-span-2 lg:col-span-3" />
            <DetailField label="Полное описание" value={venue.description} className="sm:col-span-2 lg:col-span-3" />
          </DetailSection>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Hero / галерея</h3>
              <Button variant="outline" size="sm">Загрузить</Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-violet-200 rounded-md" />
              ))}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Map className="w-4 h-4" /> Схема зала</h3>
              <Button variant="outline" size="sm">{venue.hasSeatingMap ? "Заменить" : "Добавить"}</Button>
            </div>
            {venue.hasSeatingMap ? (
              <p className="text-xs text-muted-foreground">SVG-схема загружена · {venue.capacity.toLocaleString()} мест в стандартной конфигурации</p>
            ) : (
              <p className="text-xs text-muted-foreground">Схема зала не загружена</p>
            )}
          </div>

          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><ListOrdered className="w-4 h-4" /> Блоки страницы</h3>
              <Button variant="outline" size="sm">Добавить блок</Button>
            </div>
            <ul>
              {venue.blocks.map((b, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-2.5 border-t border-border first:border-t-0 hover:bg-accent/40">
                  <span className="text-xs font-mono text-muted-foreground w-6">#{i + 1}</span>
                  <span className="flex-1 text-sm">{b.title}</span>
                  <span className="text-xs text-muted-foreground font-mono">{b.type}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> FAQ</h3>
              <Button variant="outline" size="sm">Добавить вопрос</Button>
            </div>
            <ul>
              {venue.faqs.map((f, i) => (
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
          <TrafficStatsCards t={venue.traffic} />
          <DetailSection title="Meta-теги">
            <DetailField label="Meta Title" value={venue.metaTitle} className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="Meta Description" value={venue.metaDescription} className="sm:col-span-2 lg:col-span-3" />
            <DetailField label="Canonical" value={venue.canonical} readOnly className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="OG-изображение" value={venue.ogImage ? "Загружено" : "Не задано"} />
          </DetailSection>
          <TopKeywordsTable keywords={venue.traffic.topKeywords} />
          <IssueList title="SEO замечания" issues={venue.seoIssues} />
        </div>
      )}

      {tab === "events" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Событие</th>
                <th className="text-left px-4 py-2 font-medium">Дата</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {venue.upcomingEvents.map((e) => (
                <tr key={e.id} className="border-t border-border hover:bg-accent/40 cursor-pointer" onClick={() => setLocation(`/admin/events/${e.id}`)}>
                  <td className="px-4 py-2 font-medium">{e.title}</td>
                  <td className="px-4 py-2">{e.date}</td>
                  <td className="px-4 py-2 text-right text-xs text-primary">Открыть →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "audit" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Основная информация">
            <DetailField label="ID" value={venue.id} readOnly />
            <DetailField label="Slug" value={venue.slug} />
            <DetailField label="Название" value={venue.name} readOnly />
            <DetailField label="Вместимость" value={venue.capacity.toLocaleString()} readOnly />
          </DetailSection>
          <DetailSection title="Расположение">
            <DetailField label="Город" value={venue.city} readOnly />
            <DetailField label="Адрес" value={venue.address} readOnly />
            <DetailField label="Широта" value={venue.lat} readOnly />
            <DetailField label="Долгота" value={venue.lng} readOnly />
          </DetailSection>
          <DetailSection title="Контакты">
            <DetailField label="Телефон" value={venue.phone} readOnly />
            <DetailField label="Веб-сайт" value={
              <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{venue.website}</a>
            } readOnly />
          </DetailSection>
          <DetailSection title="Источник импорта">
            <DetailField label="Источник" value={venue.importedSource} readOnly />
            <DetailField label="ID в источнике" value={venue.sourceId} readOnly />
          </DetailSection>
        </div>
      )}
    </AdminLayout>
  );
}
