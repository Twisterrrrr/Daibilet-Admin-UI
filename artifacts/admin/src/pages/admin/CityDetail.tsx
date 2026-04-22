import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { ContentHubBadge, TrafficStatsCards, TopKeywordsTable } from "@/components/shared/TrafficStats";
import { IssueList } from "@/components/shared/IssueList";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Edit2, Eye, ExternalLink, Image as ImageIcon, FileText, ListOrdered } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { HubGraph } from "@/components/shared/HubGraph";

const city = {
  id: "CTY-001",
  name: "Almaty", nameRu: "Алматы", nameKk: "Алматы",
  slug: "almaty",
  country: "Kazakhstan", countryCode: "KZ",
  timezone: "Asia/Almaty",
  status: "active",
  isContentHub: true,
  lat: "43.2220", lng: "76.8512",
  importedSource: "geonames", sourceId: "1526273",
  // hub content
  h1: "Афиша событий в Алматы",
  intro: "Купите билеты на концерты, театр, фестивали, спорт и шоу в Алматы. Обновляемая ежедневно афиша, гарантия подлинности и возможность возврата.",
  heroImage: "/images/hero-almaty.jpg",
  faqs: [
    { q: "Как купить билет на событие в Алматы?", a: "Выберите событие, забронируйте места и оплатите онлайн любым удобным способом." },
    { q: "Можно ли вернуть билет?", a: "Да, возврат возможен в соответствии с правилами организатора, как правило не позднее чем за 3 дня до события." },
    { q: "Где забрать билет?", a: "Электронные билеты приходят на e-mail сразу после оплаты. Бумажный билет не нужен." },
  ],
  blocks: [
    { type: "events_grid", title: "Ближайшие события" },
    { type: "promo_block", title: "Главные концерты весны" },
    { type: "venues_grid", title: "Популярные площадки" },
    { type: "categories_grid", title: "По категориям" },
    { type: "articles_list", title: "Статьи об Алматы" },
    { type: "faq", title: "Вопросы и ответы" },
  ],
  // SEO
  metaTitle: "Афиша Алматы — концерты, театр, события | Daibilet",
  metaDescription: "Купите билеты на лучшие события Алматы онлайн. Концерты, фестивали, театр, спорт.",
  ogImage: true,
  canonical: "https://daibilet.kz/almaty/",
  // traffic
  traffic: {
    visits30d: 184_200,
    organicShare: 81,
    avgPosition: 3.2,
    ctr: 6.8,
    delta: 12.4,
    topKeywords: [
      { kw: "концерты алматы", pos: 2, visits: 31_200 },
      { kw: "афиша алматы", pos: 3, visits: 24_800 },
      { kw: "купить билет алматы", pos: 4, visits: 18_400 },
      { kw: "театр алматы", pos: 6, visits: 11_900 },
      { kw: "куда сходить в алматы", pos: 5, visits: 9_400 },
    ],
  },
  relatedLandings: [
    { id: "LND-001", title: "Главная Алматы", slug: "almaty", scope: "single_city" },
    { id: "LND-002", title: "Концерты Алматы — весна 2025", slug: "concerts-almaty-spring-2025", scope: "single_city" },
    { id: "LND-007", title: "Stand Up афиша по Казахстану", slug: "standup", scope: "multi_city" },
  ],
  topVenues: [
    { id: "VEN-001", name: "Алатау Арена", events: 8 },
    { id: "VEN-003", name: "Мега Silk Way", events: 12 },
  ],
  seoIssues: [
    { id: "1", severity: "warning" as const, title: "Description короче 120 символов", description: "Текущая длина — 88 символов. Рекомендуется 120–160." },
    { id: "2", severity: "info" as const,    title: "Можно добавить FAQ-разметку Schema.org",   description: "Это улучшит сниппет в поисковой выдаче." },
  ],
};

export default function CityDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [hubEnabled, setHubEnabled] = useState(city.isContentHub);

  return (
    <AdminLayout
      title={city.nameRu}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Города", href: "/admin/cities" },
        { label: city.nameRu },
      ]}
    >
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2 flex-wrap">
            {city.nameRu}
            <ContentHubBadge isHub={hubEnabled} />
            <StatusBadge status={city.status} />
            <span className="text-sm text-muted-foreground font-normal font-mono">daibilet.kz/{city.slug}/</span>
          </span>
        }
        description={`${formatNumber(city.traffic.visits30d)} визитов / 30 дн · средняя позиция ${city.traffic.avgPosition.toFixed(1)} · ${city.traffic.organicShare}% organic`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/cities")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button variant="outline" size="sm" data-testid="button-preview-city">
              <Eye className="w-4 h-4 mr-1.5" /> Посмотреть на сайте
            </Button>
            <Button size="sm" data-testid="button-edit-city"><Edit2 className="w-4 h-4 mr-1.5" /> Редактировать</Button>
          </>
        }
      />

      <Tabs
        items={[
          { key: "overview", label: "Обзор" },
          { key: "hub", label: "Контент-хаб" },
          { key: "seo", label: "SEO & трафик" },
          { key: "landings", label: "Связанные лендинги", count: city.relatedLandings.length },
          { key: "audit", label: "Справочник" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <TrafficStatsCards t={city.traffic} />

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-sm font-semibold mb-1">Статус «Контент-хаб»</h3>
                <p className="text-xs text-muted-foreground max-w-lg">
                  Если включён, страница города получает расширенный SEO-контент: H1, intro, FAQ, блоки афиши и связанные лендинги.
                  Если выключен — отображается только базовый список событий.
                </p>
              </div>
              <Switch checked={hubEnabled} onCheckedChange={setHubEnabled} data-testid="switch-content-hub" />
            </div>
          </div>

          <DetailSection title="Краткая сводка">
            <DetailField label="Площадки" value={`${city.topVenues.length}+`} readOnly />
            <DetailField label="Активных событий" value={"54"} readOnly />
            <DetailField label="Лендинги" value={String(city.relatedLandings.length)} readOnly />
            <DetailField label="GMV / 30 дн" value="22 410 000 ₽" readOnly />
          </DetailSection>
        </div>
      )}

      {tab === "hub" && (
        <div className="flex flex-col gap-4">
          {!hubEnabled && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 text-sm">
              Контент-хаб выключен. Включите тумблер на вкладке «Обзор», чтобы редактировать наполнение.
            </div>
          )}

          <DetailSection title="Заголовок и intro">
            <DetailField label="H1" value={city.h1} className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="Intro-текст" value={city.intro} className="sm:col-span-2 lg:col-span-3" />
          </DetailSection>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Hero-изображение</h3>
              <Button variant="outline" size="sm">Заменить</Button>
            </div>
            <div className="aspect-[3/1] bg-gradient-to-br from-violet-200 to-blue-200 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              {city.heroImage}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><ListOrdered className="w-4 h-4" /> Блоки страницы</h3>
              <Button variant="outline" size="sm">Добавить блок</Button>
            </div>
            <ul>
              {city.blocks.map((b, i) => (
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
              {city.faqs.map((f, i) => (
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
          <TrafficStatsCards t={city.traffic} />
          <DetailSection title="Meta-теги">
            <DetailField label="Meta Title" value={city.metaTitle} className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="Meta Description" value={city.metaDescription} className="sm:col-span-2 lg:col-span-3" />
            <DetailField label="Canonical" value={city.canonical} readOnly className="sm:col-span-2 lg:col-span-2" />
            <DetailField label="OG-изображение" value={city.ogImage ? "Загружено" : "Не задано"} />
          </DetailSection>
          <TopKeywordsTable keywords={city.traffic.topKeywords} />
          <IssueList title="SEO замечания" issues={city.seoIssues} />
        </div>
      )}

      {tab === "landings" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Лендинг</th>
                <th className="text-left px-4 py-2 font-medium">URL</th>
                <th className="text-left px-4 py-2 font-medium">Scope</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {city.relatedLandings.map((l) => (
                <tr key={l.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-2 font-medium">{l.title}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    {l.scope === "multi_city" ? `/{city}/${l.slug}` : `/${city.slug}/${l.slug}`}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {l.scope === "multi_city" ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Мульти-городовой</span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Один город</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/admin/landings/${l.id}`}>
                      <span className="text-primary hover:underline text-xs cursor-pointer inline-flex items-center gap-1">
                        Открыть <ExternalLink className="w-3 h-3" />
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "audit" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Основная информация">
            <DetailField label="ID" value={city.id} readOnly />
            <DetailField label="Slug" value={city.slug} />
            <DetailField label="Название (EN)" value={city.name} readOnly />
            <DetailField label="Название (RU)" value={city.nameRu} />
            <DetailField label="Название (KK)" value={city.nameKk} />
            <DetailField label="Страна" value={`${city.country} (${city.countryCode})`} readOnly />
            <DetailField label="Часовой пояс" value={city.timezone} readOnly />
          </DetailSection>
          <DetailSection title="Геолокация">
            <DetailField label="Широта" value={city.lat} readOnly />
            <DetailField label="Долгота" value={city.lng} readOnly />
          </DetailSection>
          <DetailSection title="Источник импорта">
            <DetailField label="Источник" value={city.importedSource} readOnly />
            <DetailField label="ID в источнике" value={city.sourceId} readOnly />
          </DetailSection>
        </div>
      )}

      <div className="mt-4">
        <HubGraph
          subject={`${city.nameRu} (${city.id})`}
          links={[
            { group: "Площадки города",  label: "Алатау Арена",                href: "/admin/venues/VEN-001", count: 8,  hint: "ивент-only" },
            { group: "Площадки города",  label: "Музей Кастеева",               href: "/admin/venues/VEN-007", count: 3,  hint: "hybrid" },
            { group: "Площадки города",  label: "Мега Silk Way",                href: "/admin/venues/VEN-003", count: 12 },
            { group: "Площадки города",  label: "Все площадки в Алматы",        href: "/admin/venues?city=almaty", count: 47 },
            { group: "Лендинги",          label: "Главная Алматы",               href: "/admin/landings/LND-001", hint: "single_city" },
            { group: "Лендинги",          label: "Концерты Алматы — весна 2025", href: "/admin/landings/LND-002", hint: "single_city" },
            { group: "Лендинги",          label: "Stand Up афиша по Казахстану", href: "/admin/landings/LND-007", hint: "multi_city" },
            { group: "События",           label: "Ближайшие в Алматы",           href: "/admin/events?city=almaty", count: 184, hint: "30 дн" },
            { group: "События",           label: "Ночь музыки 2025",             href: "/admin/events/EVT-001",     hint: "VEN-12 · 15.05" },
            { group: "Контент",           label: "Подборка «Лучшее в Алматы»",    href: "/admin/collections/COL-001" },
            { group: "Контент",           label: "Статьи о городе",               href: "/admin/articles?city=almaty", count: 12 },
            { group: "Заказы",             label: "Заказы по городу",              href: "/admin/orders?city=almaty",   count: 4214, hint: "30 дн" },
          ]}
          warning={!city.isContentHub ? "Контент-хаб выключен — кросс-страницы не индексируются" : undefined}
        />
      </div>
    </AdminLayout>
  );
}
