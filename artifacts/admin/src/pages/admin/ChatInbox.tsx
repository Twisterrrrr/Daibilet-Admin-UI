import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, User, Bot, Clock, AlertCircle, ShoppingCart, Globe2, Smartphone, Monitor } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type ChatStatus = "open" | "waiting" | "resolved" | "bot";
type Channel = "web" | "mobile" | "telegram" | "whatsapp";

interface Conversation {
  id: string;
  visitor: string;
  isAuth: boolean;
  channel: Channel;
  page: string;
  status: ChatStatus;
  assignedTo: string | null;
  lastMessage: string;
  lastMessageBy: "visitor" | "operator" | "bot";
  unreadCount: number;
  startedAt: string;
  lastActivityAt: string;
  city: string;
  tags: string[];
  relatedOrderId?: string;
  waitTimeSec: number;
}

const mockChats: Conversation[] = [
  { id: "CHT-1024", visitor: "Айгерим Касымова",  isAuth: true,  channel: "web",      page: "/moscow/events/forum-on-arena", status: "waiting",  assignedTo: null,        lastMessage: "Добрый день! Можно ли вернуть билет, если событие перенесли?",          lastMessageBy: "visitor",  unreadCount: 1, startedAt: "2026-04-21T19:42:00Z", lastActivityAt: "2026-04-21T19:43:00Z", city: "Москва", tags: ["возврат"],          relatedOrderId: "ORD-58234", waitTimeSec: 92  },
  { id: "CHT-1023", visitor: "Гость #842",         isAuth: false, channel: "web",      page: "/astana",                       status: "open",     assignedTo: "Динара О.",  lastMessage: "Подскажите, есть ли скидки для студентов?",                              lastMessageBy: "operator", unreadCount: 0, startedAt: "2026-04-21T19:38:00Z", lastActivityAt: "2026-04-21T19:41:00Z", city: "Санкт-Петербург", tags: ["скидки"],            waitTimeSec: 0   },
  { id: "CHT-1022", visitor: "Темирлан Ж.",       isAuth: true,  channel: "mobile",   page: "—",                              status: "waiting",  assignedTo: null,        lastMessage: "Билет не пришёл на почту, заказ ORD-58119",                              lastMessageBy: "visitor",  unreadCount: 2, startedAt: "2026-04-21T19:30:00Z", lastActivityAt: "2026-04-21T19:39:00Z", city: "Москва", tags: ["билет не пришёл"],   relatedOrderId: "ORD-58119", waitTimeSec: 264 },
  { id: "CHT-1021", visitor: "Гость #841",         isAuth: false, channel: "telegram", page: "—",                              status: "bot",      assignedTo: null,        lastMessage: "Бот: расскажите подробнее о событии, чтобы я мог помочь.",                lastMessageBy: "bot",      unreadCount: 0, startedAt: "2026-04-21T19:25:00Z", lastActivityAt: "2026-04-21T19:25:00Z", city: "Казань", tags: ["навигация"],         waitTimeSec: 0   },
  { id: "CHT-1020", visitor: "Мария П.",          isAuth: true,  channel: "web",      page: "/moscow/venues/kasteev-museum", status: "open",     assignedTo: "Динара О.",  lastMessage: "Спасибо, разобралась!",                                                  lastMessageBy: "visitor",  unreadCount: 0, startedAt: "2026-04-21T19:10:00Z", lastActivityAt: "2026-04-21T19:18:00Z", city: "Москва", tags: ["цены"],              waitTimeSec: 0   },
  { id: "CHT-1019", visitor: "Арман Д.",          isAuth: true,  channel: "whatsapp", page: "—",                              status: "resolved", assignedTo: "Аскар Б.",   lastMessage: "Возврат оформлен. Деньги придут в течение 5 рабочих дней.",              lastMessageBy: "operator", unreadCount: 0, startedAt: "2026-04-21T18:42:00Z", lastActivityAt: "2026-04-21T19:01:00Z", city: "Москва", tags: ["возврат"],          relatedOrderId: "ORD-58092", waitTimeSec: 0   },
];

const channelMeta: Record<Channel, { label: string; icon: typeof Globe2; className: string }> = {
  web:      { label: "Веб",       icon: Globe2,     className: "text-blue-600" },
  mobile:   { label: "Мобайл",    icon: Smartphone, className: "text-violet-600" },
  telegram: { label: "Telegram",  icon: MessageCircle, className: "text-sky-600" },
  whatsapp: { label: "WhatsApp",  icon: MessageCircle, className: "text-emerald-600" },
};

const statusMeta: Record<ChatStatus, { label: string; className: string }> = {
  open:     { label: "Активен",         className: "bg-blue-100 text-blue-700" },
  waiting:  { label: "Ждёт оператора",  className: "bg-amber-100 text-amber-700" },
  resolved: { label: "Закрыт",          className: "bg-emerald-100 text-emerald-700" },
  bot:      { label: "Бот",             className: "bg-violet-100 text-violet-700" },
};

function fmtWait(sec: number): string {
  if (sec === 0) return "—";
  const m = Math.floor(sec / 60);
  return m === 0 ? `${sec}с` : `${m}м ${sec % 60}с`;
}

export default function ChatInbox() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<ChatStatus | "all" | "mine">("waiting");
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<string>("all");
  const [assignee, setAssignee] = useState<string>("all");

  const filtered = mockChats.filter((c) => {
    const matchSearch = !search || c.visitor.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" ? true : tab === "mine" ? c.assignedTo === "Динара О." : c.status === tab;
    return matchSearch && matchTab && (channel === "all" || c.channel === channel) && (assignee === "all" || (assignee === "unassigned" ? !c.assignedTo : c.assignedTo === assignee));
  });

  const stats = {
    open:     mockChats.filter(c => c.status === "open").length,
    waiting:  mockChats.filter(c => c.status === "waiting").length,
    resolved: mockChats.filter(c => c.status === "resolved").length,
    bot:      mockChats.filter(c => c.status === "bot").length,
    mine:     mockChats.filter(c => c.assignedTo === "Динара О.").length,
    avgWait:  Math.round(mockChats.filter(c => c.waitTimeSec > 0).reduce((s, c) => s + c.waitTimeSec, 0) / Math.max(1, mockChats.filter(c => c.waitTimeSec > 0).length)),
  };

  return (
    <AdminLayout title="Чат с сайта" breadcrumbs={[{ label: "Администратор" }, { label: "Поддержка" }, { label: "Чат с сайта" }]}>
      <PageHeader
        title="Чат с сайта"
        description={`${stats.waiting + stats.open} активных диалогов · ${stats.waiting} ждут оператора · среднее ожидание ${fmtWait(stats.avgWait)}`}
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-chat-settings">Настройки бота</Button>
            <Button size="sm" data-testid="button-chat-canned">Шаблоны ответов</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <KCell icon={AlertCircle} label="Ждут оператора" value={String(stats.waiting)} hint={fmtWait(stats.avgWait) + " среднее"} accent={stats.waiting > 0 ? "warn" : undefined} />
        <KCell icon={MessageCircle} label="В работе" value={String(stats.open)} hint="ответ ожидается" />
        <KCell icon={Bot} label="Обрабатывает бот" value={String(stats.bot)} hint="без оператора" />
        <KCell icon={Clock} label="Закрыто сегодня" value={String(stats.resolved)} hint="резолвед" />
        <KCell icon={User} label="Мои диалоги" value={String(stats.mine)} hint="назначены вам" />
      </div>

      <Tabs
        items={[
          { key: "waiting",  label: "Ждут оператора", count: stats.waiting },
          { key: "mine",     label: "Мои",            count: stats.mine },
          { key: "open",     label: "Активные",       count: stats.open },
          { key: "bot",      label: "Бот",            count: stats.bot },
          { key: "resolved", label: "Закрытые",       count: stats.resolved },
          { key: "all",      label: "Все" },
        ]}
        active={tab}
        onChange={(v) => setTab(v as ChatStatus | "all" | "mine")}
      />

      <FilterBar
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Поиск по тексту, посетителю, ID..."
        filters={
          <>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="w-36" data-testid="select-chat-channel"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все каналы</SelectItem>
                <SelectItem value="web">Веб</SelectItem>
                <SelectItem value="mobile">Мобайл</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger className="w-44" data-testid="select-chat-assignee"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любой оператор</SelectItem>
                <SelectItem value="unassigned">Не назначен</SelectItem>
                <SelectItem value="Динара О.">Динара О.</SelectItem>
                <SelectItem value="Аскар Б.">Аскар Б.</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        <ul>
          {filtered.map((c) => {
            const ch = channelMeta[c.channel]; const Icon = ch.icon;
            const st = statusMeta[c.status];
            return (
              <li
                key={c.id}
                className="flex items-start gap-3 px-4 py-3 border-t border-border first:border-t-0 hover:bg-accent/40 cursor-pointer"
                onClick={() => setLocation(`/admin/chat/${c.id}`)}
                data-testid={`chat-row-${c.id}`}
              >
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${c.isAuth ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    <User className="w-4 h-4" />
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="text-[10px] font-semibold bg-red-500 text-white rounded-full px-1.5 mt-1 min-w-[18px] text-center">{c.unreadCount}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-medium text-sm">{c.visitor}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] ${ch.className}`}>
                      <Icon className="w-3 h-3" /> {ch.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">· {c.city}</span>
                    {c.relatedOrderId && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600">
                        <ShoppingCart className="w-2.5 h-2.5" /> {c.relatedOrderId}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    <span className="text-foreground/60 mr-1">
                      {c.lastMessageBy === "visitor" ? "→" : c.lastMessageBy === "operator" ? "←" : <Bot className="w-3 h-3 inline" />}
                    </span>
                    {c.lastMessage}
                  </p>
                  {c.page !== "—" && (
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">страница: {c.page}</p>
                  )}
                  {c.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {c.tags.map((t) => (
                        <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${st.className}`}>{st.label}</span>
                  {c.assignedTo ? (
                    <span className="text-[10px] text-muted-foreground">{c.assignedTo}</span>
                  ) : (
                    <span className="text-[10px] text-amber-600">не назначен</span>
                  )}
                  {c.waitTimeSec > 0 && (
                    <span className={`text-[10px] tabular-nums ${c.waitTimeSec > 180 ? "text-red-600 font-medium" : "text-amber-600"}`}>
                      ждёт {fmtWait(c.waitTimeSec)}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{formatDateTime(c.lastActivityAt)}</span>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground">Нет диалогов в этой категории</li>
          )}
        </ul>
      </div>
    </AdminLayout>
  );
}

function KCell({ icon: Icon, label, value, hint, accent }: { icon: typeof MessageCircle; label: string; value: string; hint?: string; accent?: "warn" }) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <p className={`text-xl font-semibold tabular-nums ${accent === "warn" ? "text-amber-600" : ""}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}
