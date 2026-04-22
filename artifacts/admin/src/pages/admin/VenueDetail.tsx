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
import { ArrowLeft, Edit2, Eye, Image as ImageIcon, FileText, Map, ListOrdered, Ticket, Plus, Clock, Calendar, Sparkles, Building2, CalendarRange } from "lucide-react";
import { formatNumber, formatCurrency, formatPhone } from "@/lib/utils";
import { SalesModelBadge, salesModelMeta, type SalesModel } from "./VenuesList";
import { HubGraph } from "@/components/shared/HubGraph";

const venue = {
  id: "VEN-007",
  name: "Третьяковская галерея",
  slug: "kasteev-museum",
  city: "Москва", citySlug: "moscow",
  address: "мкр. Коктем-3, 22",
  lat: "43.2120", lng: "76.9020",
  capacity: 600,
  status: "active",
  category: "Музей",
  isContentHub: true,
  salesModel: "hybrid" as SalesModel,
  phone: "+7 727 247-82-46",
  website: "https://gmirk.kz",
  importedSource: null as string | null,
  sourceId: null as string | null,
  // hub content
  h1: "Государственный музей искусств им. А. Кастеева",
  intro: "Крупнейший художественный музей России. Постоянная экспозиция, временные выставки, экскурсии и мастер-классы. Купите билет онлайн без очереди.",
  description: "Основан в 1976 году, коллекция насчитывает более 25 000 произведений. Залы российского, российского и западноевропейского искусства, прикладное искусство Востока.",
  hasSeatingMap: false,
  // standalone admission settings
  admissionPolicy: {
    syncEnabled: true,
    workingHours: "Вт–Вс, 10:00–18:00 (понедельник — выходной)",
    dailyCapacity: 1200,
    soldToday: 248,
    advanceBookingDays: 30,
    refundPolicy: "За 24 часа до посещения",
    timedEntry: false, // если true — слоты на конкретное время
  },
  admissionTypes: [
    { id: "ADM-1", name: "Взрослый",        price: 1500, status: "active",   description: "Граждане РК и иностранные гости",                  soldToday: 142, sold30d: 3420 },
    { id: "ADM-2", name: "Студенческий",    price:  500, status: "active",   description: "При предъявлении студенческого билета",            soldToday: 48,  sold30d: 1180 },
    { id: "ADM-3", name: "Школьный",        price:  300, status: "active",   description: "Дети с 7 до 17 лет",                                soldToday: 32,  sold30d: 980 },
    { id: "ADM-4", name: "Семейный",        price: 3000, status: "active",   description: "2 взрослых + до 3 детей",                          soldToday: 18,  sold30d: 540 },
    { id: "ADM-5", name: "Льготный",        price:    0, status: "active",   description: "Пенсионеры, ветераны, инвалиды (бесплатно по ID)", soldToday: 8,   sold30d: 240 },
  ],
  upcomingEvents: [
    { id: "EVT-101", title: "Выставка «Степь и небо»", date: "2026-05-01", type: "exhibition" },
    { id: "EVT-102", title: "Лекция: российский авангард", date: "2026-05-08", type: "lecture" },
    { id: "EVT-103", title: "Ночь музеев 2026", date: "2026-05-18", type: "special" },
  ],
  // SEO
  metaTitle: "Третьяковская галерея в Москве — билеты онлайн | Daibilet",
  metaDescription: "Купите билет в Государственный музей искусств им. А. Кастеева онлайн. Цены, расписание, выставки. Без очереди.",
  ogImage: true,
  canonical: "https://daibilet.ru/moscow/venues/kasteev-museum/",
  blocks: [
    { type: "intro", title: "Описание музея" },
    { type: "admission_pricing", title: "Стоимость билетов" },
    { type: "events_grid", title: "Временные выставки и события" },
    { type: "working_hours", title: "Режим работы" },
    { type: "map", title: "Как добраться" },
    { type: "faq", title: "Вопросы и ответы" },
  ],
  faqs: [
    { q: "Как купить билет в музей?", a: "Выберите тип билета, оплатите онлайн, получите электронный билет на e-mail. Покажите QR-код на входе." },
    { q: "Можно ли вернуть билет?", a: "Да, не позднее чем за 24 часа до посещения." },
    { q: "Есть ли льготы?", a: "Пенсионеры, ветераны и люди с ОВЗ — бесплатно по предъявлении документа." },
  ],
  traffic: {
    visits30d: 12_800,
    organicShare: 84,
    avgPosition: 4.4,
    ctr: 7.2,
    delta: 14.2,
    topKeywords: [
      { kw: "музей кастеева",         pos: 1, visits: 4_600 },
      { kw: "музей искусств алматы",  pos: 3, visits: 2_400 },
      { kw: "музей кастеева билеты",  pos: 2, visits: 1_900 },
      { kw: "выставки алматы",        pos: 6, visits: 1_400 },
      { kw: "куда сходить алматы",    pos: 8, visits: 980 },
    ],
  },
  seoIssues: [
    { id: "1", severity: "info" as const, title: "Можно добавить разметку Museum + OpeningHoursSpecification", description: "Это улучшит сниппет в Google, особенно для запросов «режим работы»." },
  ],
};

export default function VenueDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [hubEnabled, setHubEnabled] = useState(venue.isContentHub);
  const [salesModel, setSalesModel] = useState<SalesModel>(venue.salesModel);

  const isStandalone = salesModel !== "event_only";
  const isHybrid = salesModel === "hybrid";

  const totalAdmissionRevenue30d = venue.admissionTypes.reduce((s, a) => s + a.price * a.sold30d, 0);
  const totalSold30d = venue.admissionTypes.reduce((s, a) => s + a.sold30d, 0);

  return (
    <AdminLayout
      title={venue.name}
      breadcrumbs={[{ label: "Администратор" }, { label: "Площадки", href: "/admin/venues" }, { label: venue.name }]}
    >
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2 flex-wrap">
            {venue.name}
            <SalesModelBadge model={salesModel} />
            <ContentHubBadge isHub={hubEnabled} />
            <StatusBadge status={venue.status} />
            <span className="text-sm text-muted-foreground font-normal font-mono">daibilet.ru/{venue.citySlug}/venues/{venue.slug}/</span>
          </span>
        }
        description={`${venue.category} · ${venue.city} · ${venue.capacity.toLocaleString()} мест · ${formatNumber(venue.traffic.visits30d)} визитов / 30 дн`}
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
          { key: "model", label: "Модель продаж" },
          ...(isStandalone ? [{ key: "admission", label: "Прямые продажи", count: venue.admissionTypes.length }] : []),
          { key: "hub", label: "Контент-хаб" },
          { key: "seo", label: "SEO & трафик" },
          ...(salesModel !== "standalone" ? [{ key: "events", label: "События", count: venue.upcomingEvents.length }] : []),
          { key: "audit", label: "Справочник" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <TrafficStatsCards t={venue.traffic} />

          {isStandalone && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Cell label="Продано сегодня" value={formatNumber(venue.admissionPolicy.soldToday)} hint={`из ${formatNumber(venue.admissionPolicy.dailyCapacity)} лимит`} />
              <Cell label="Продано / 30 дн" value={formatNumber(totalSold30d)} hint="по всем тарифам" />
              <Cell label="Выручка / 30 дн" value={formatCurrency(totalAdmissionRevenue30d)} hint="прямые продажи" accent="good" />
              <Cell label="Активных тарифов" value={String(venue.admissionTypes.filter(a => a.status === "active").length)} hint={`из ${venue.admissionTypes.length}`} />
            </div>
          )}

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Статус «Контент-хаб»</h3>
                <p className="text-xs text-muted-foreground max-w-lg">
                  Включает SEO-описание, FAQ, блоки и hero-галерею. Без него площадка отображается только как краткая карточка в событии.
                </p>
              </div>
              <Switch checked={hubEnabled} onCheckedChange={setHubEnabled} data-testid="switch-venue-hub" />
            </div>
          </div>
        </div>
      )}

      {tab === "model" && (
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-1">Модель продаж</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Определяет, как площадка зарабатывает на Daibilet: только через события, через прямые продажи входа, или комбинировано.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <ModelOption value="event_only" current={salesModel} onSelect={setSalesModel}
                icon={CalendarRange} title="Только события"
                desc="Концертные залы, арены, театры — продаются только билеты на конкретные события."
                example="ВТБ Арена, Barys Arena" />
              <ModelOption value="standalone" current={salesModel} onSelect={setSalesModel}
                icon={Building2} title="Прямые продажи"
                desc="Музеи, зоопарки, океанариумы — посетители покупают билет «на вход» по открытой цене, без привязки к событию."
                example="Алматинский зоопарк, Думан" />
              <ModelOption value="hybrid" current={salesModel} onSelect={setSalesModel}
                icon={Sparkles} title="Гибрид"
                desc="Постоянная экспозиция (открытая цена) + временные выставки и события."
                example="Третьяковская галерея, центр современного искусства" />
            </div>
          </div>

          {isStandalone && (
            <DetailSection title="Параметры прямых продаж">
              <DetailField label="Часы работы" value={venue.admissionPolicy.workingHours} />
              <DetailField label="Дневной лимит посетителей" value={venue.admissionPolicy.dailyCapacity.toLocaleString()} />
              <DetailField label="Продажа заранее (дней)" value={String(venue.admissionPolicy.advanceBookingDays)} />
              <DetailField label="Политика возврата" value={venue.admissionPolicy.refundPolicy} />
              <DetailField label="Билет на конкретное время (timed entry)" value={venue.admissionPolicy.timedEntry ? "Да — слоты по 30 мин" : "Нет — открытый вход в часы работы"} />
              <DetailField label="Синхронизация лимитов с кассой" value={venue.admissionPolicy.syncEnabled ? "Включена" : "Выключена"} />
            </DetailSection>
          )}

          {isHybrid && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 text-sm text-amber-900 dark:text-amber-200">
              <strong className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Гибридная модель</strong>
              <p className="mt-1">
                Покупатель видит на странице площадки <strong>две зоны</strong>: «Билет на вход» (постоянная экспозиция, открытая цена) и «Афиша» (временные события). Дневной лимит площадки делится между ними автоматически.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "admission" && isStandalone && (
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Лимит посетителей и часы работы
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{venue.admissionPolicy.workingHours}</p>
              </div>
              <Button variant="outline" size="sm">Изменить</Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${(venue.admissionPolicy.soldToday / venue.admissionPolicy.dailyCapacity) * 100}%` }} />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                {venue.admissionPolicy.soldToday} / {venue.admissionPolicy.dailyCapacity}
              </span>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2"><Ticket className="w-4 h-4" /> Тарифы входа</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Открытая цена, продаётся независимо от событий</p>
              </div>
              <Button size="sm" data-testid="button-add-admission"><Plus className="w-3.5 h-3.5 mr-1" /> Добавить тариф</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Тариф</th>
                  <th className="text-left px-4 py-2 font-medium">Условия</th>
                  <th className="text-right px-4 py-2 font-medium">Цена</th>
                  <th className="text-right px-4 py-2 font-medium">Сегодня</th>
                  <th className="text-right px-4 py-2 font-medium">/ 30 дн</th>
                  <th className="text-right px-4 py-2 font-medium">Выручка / 30 дн</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {venue.admissionTypes.map((a) => (
                  <tr key={a.id} className="border-t border-border hover:bg-accent/40">
                    <td className="px-4 py-2 font-medium">{a.name}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{a.description}</td>
                    <td className="px-4 py-2 text-right tabular-nums font-medium">{a.price === 0 ? <span className="text-emerald-600">Бесплатно</span> : formatCurrency(a.price)}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{a.soldToday}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{formatNumber(a.sold30d)}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">{a.price === 0 ? "—" : formatCurrency(a.price * a.sold30d)}</td>
                    <td className="px-4 py-2 text-right">
                      <button className="text-primary hover:underline text-xs">Изменить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30 font-medium">
                  <td className="px-4 py-2.5" colSpan={4}>Итого по тарифам</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(totalSold30d)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{formatCurrency(totalAdmissionRevenue30d)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {isHybrid && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200">
              <strong className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Конфликт с временными событиями</strong>
              <p className="mt-1 text-xs">
                Когда на площадке проходит закрытое событие, прямые продажи на этот день автоматически блокируются (или ограничиваются часами события — настраивается).
              </p>
            </div>
          )}
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

          {salesModel !== "standalone" && (
            <div className="bg-card border border-card-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Map className="w-4 h-4" /> Схема зала</h3>
                <Button variant="outline" size="sm">{venue.hasSeatingMap ? "Заменить" : "Добавить"}</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {venue.hasSeatingMap ? `SVG-схема загружена · ${venue.capacity.toLocaleString()} мест` : "Схема зала не загружена"}
              </p>
            </div>
          )}

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

      {tab === "events" && salesModel !== "standalone" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Событие</th>
                <th className="text-left px-4 py-2 font-medium">Тип</th>
                <th className="text-left px-4 py-2 font-medium">Дата</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {venue.upcomingEvents.map((e) => (
                <tr key={e.id} className="border-t border-border hover:bg-accent/40 cursor-pointer" onClick={() => setLocation(`/admin/events/${e.id}`)}>
                  <td className="px-4 py-2 font-medium">{e.title}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{e.type}</td>
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
            <DetailField label="Категория" value={venue.category} />
            <DetailField label="Вместимость" value={venue.capacity.toLocaleString()} readOnly />
            <DetailField label="Модель продаж" value={salesModelMeta[salesModel].label} readOnly />
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
          {venue.importedSource && (
            <DetailSection title="Источник импорта">
              <DetailField label="Источник" value={venue.importedSource} readOnly />
              <DetailField label="ID в источнике" value={venue.sourceId ?? "—"} readOnly />
            </DetailSection>
          )}
        </div>
      )}

      <div className="mt-4">
        <HubGraph
          subject={`${venue.name} (${venue.id})`}
          links={[
            { group: "Город",               label: venue.city,                                  href: `/admin/cities/CTY-001`,                          hint: venue.citySlug },
            { group: "Поставщик / куратор",  label: "Daibilet (внутренний)",                      href: "/admin/suppliers/SUP-01",                         hint: "internal" },
            { group: "События на площадке", label: "Выставка «Степь и небо»",                    href: "/admin/events/EVT-101",                            hint: "01.05" },
            { group: "События на площадке", label: "Лекция: российский авангард",              href: "/admin/events/EVT-102",                            hint: "08.05" },
            { group: "События на площадке", label: "Ночь музеев 2026",                            href: "/admin/events/EVT-103",                            hint: "18.05" },
            { group: "События на площадке", label: "Все события Музея Кастеева",                  href: `/admin/events?venue=${venue.id}`, count: 14 },
            { group: "Лендинги с площадкой", label: "Главная Москвы",                              href: "/admin/landings/LND-001",                          hint: "блок «Площадки»" },
            { group: "Лендинги с площадкой", label: "Музеи Москвы",                                 href: "/admin/landings/LND-014",                          hint: "single_city" },
            { group: "Заказы",                label: "Билеты на площадку",                          href: `/admin/orders?venue=${venue.id}`, count: 1248, hint: "30 дн" },
            { group: "Финансы",                label: "Выплаты по площадке",                          href: `/admin/finance/payouts?venue=${venue.id}`, count: 4 },
            { group: "Дубли / качество",      label: "Записей-кандидатов",                            href: "/admin/venues/candidates", count: 0, hint: "ok" },
          ]}
          warning={venue.isContentHub === false ? "Контент-хаб выключен — страница не индексируется" : undefined}
        />
      </div>
    </AdminLayout>
  );
}

function Cell({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: "good" }) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-4">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      <p className={`text-xl font-semibold tabular-nums mt-1 ${accent === "good" ? "text-emerald-600" : ""}`}>{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

function ModelOption({ value, current, onSelect, icon: Icon, title, desc, example }: {
  value: SalesModel; current: SalesModel; onSelect: (v: SalesModel) => void;
  icon: typeof Building2; title: string; desc: string; example: string;
}) {
  const active = value === current;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`text-left rounded-lg p-4 border-2 transition-colors ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
      data-testid={`model-option-${value}`}
    >
      <Icon className={`w-4 h-4 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{desc}</p>
      <p className="text-[10px] text-muted-foreground italic">пример: {example}</p>
    </button>
  );
}
