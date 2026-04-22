import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Bot, User, Globe2, Tag, ShoppingCart, MapPin, Clock, Smartphone, CheckCircle2, Paperclip, Sparkles } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const conv = {
  id: "CHT-1024",
  visitor: { name: "Айгерим Касымова", isAuth: true, email: "aigerim.k@example.kz", phone: "+7 707 *** ** 21", city: "Алматы", device: "iPhone 14 · Safari", since: "2025-08-12" },
  channel: "web",
  status: "waiting",
  assignedTo: null as string | null,
  page: "/almaty/events/forum-on-arena",
  relatedOrderId: "ORD-58234",
  tags: ["возврат"],
  startedAt: "2026-04-21T19:42:00Z",
  messages: [
    { id: "M1", by: "system",   text: "Посетитель открыл страницу /almaty/events/forum-on-arena", at: "2026-04-21T19:41:30Z" },
    { id: "M2", by: "bot",      text: "Здравствуйте! Я бот Daibilet. Чем могу помочь?", at: "2026-04-21T19:41:32Z" },
    { id: "M3", by: "visitor",  text: "Добрый день!", at: "2026-04-21T19:42:00Z" },
    { id: "M4", by: "visitor",  text: "Можно ли вернуть билет, если событие перенесли на 2 недели?", at: "2026-04-21T19:42:10Z" },
    { id: "M5", by: "bot",      text: "Передаю диалог оператору. Среднее время ответа — около 2 минут.", at: "2026-04-21T19:42:12Z" },
  ],
};

const cannedReplies = [
  "Здравствуйте! Сейчас уточню информацию.",
  "При переносе события вы можете оформить возврат полной стоимости в течение 14 дней.",
  "Пожалуйста, сообщите номер заказа.",
  "Возврат успешно оформлен, деньги вернутся в течение 5 рабочих дней.",
];

export default function ChatConversation({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [draft, setDraft] = useState("");
  const [assigned, setAssigned] = useState(conv.assignedTo ?? "unassigned");

  return (
    <AdminLayout
      title={`Чат ${conv.id}`}
      breadcrumbs={[{ label: "Администратор" }, { label: "Чат с сайта", href: "/admin/chat" }, { label: conv.id }]}
    >
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2 flex-wrap">
            {conv.visitor.name}
            <span className="text-xs font-normal font-mono text-muted-foreground">{conv.id}</span>
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">Ждёт оператора</span>
          </span>
        }
        description={
          <span className="inline-flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><Globe2 className="w-3 h-3" /> Веб</span>
            <span>·</span>
            <span className="font-mono">{conv.page}</span>
            {conv.relatedOrderId && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-blue-600"><ShoppingCart className="w-3 h-3" /> {conv.relatedOrderId}</span>
              </>
            )}
          </span>
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/chat")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> К списку
            </Button>
            <Button variant="outline" size="sm" data-testid="button-resolve">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Закрыть диалог
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Chat area */}
        <div className="bg-card border border-card-border rounded-lg flex flex-col min-h-[60vh]">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Диалог начат {formatDateTime(conv.startedAt)}</span>
            <Select value={assigned} onValueChange={setAssigned}>
              <SelectTrigger className="w-44 h-8 text-xs" data-testid="select-chat-assign">
                <SelectValue placeholder="Назначить оператора" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Не назначен</SelectItem>
                <SelectItem value="Динара О.">Динара О. (вы)</SelectItem>
                <SelectItem value="Аскар Б.">Аскар Б.</SelectItem>
                <SelectItem value="Жанар К.">Жанар К.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {conv.messages.map((m) => {
              if (m.by === "system") {
                return (
                  <div key={m.id} className="flex justify-center">
                    <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-1 rounded">{m.text}</span>
                  </div>
                );
              }
              const isOp = m.by === "operator";
              const isBot = m.by === "bot";
              return (
                <div key={m.id} className={`flex gap-2 ${isOp ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${
                    isBot ? "bg-violet-100 text-violet-700" : isOp ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`max-w-[70%] flex flex-col ${isOp ? "items-end" : "items-start"}`}>
                    <div className={`rounded-lg px-3 py-2 text-sm ${
                      isBot ? "bg-violet-50 border border-violet-200" : isOp ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {isBot ? "Бот" : isOp ? "Вы" : conv.visitor.name} · {formatDateTime(m.at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border p-3 flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {cannedReplies.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setDraft(c)}
                  className="text-[11px] px-2 py-1 rounded bg-muted hover:bg-accent border border-border"
                  data-testid={`canned-${i}`}
                >
                  {c.slice(0, 36)}{c.length > 36 ? "…" : ""}
                </button>
              ))}
              <button className="text-[11px] px-2 py-1 rounded bg-violet-50 text-violet-700 border border-violet-200 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI-предложение
              </button>
            </div>

            <div className="flex gap-2 items-end">
              <button className="p-2 text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder="Введите ответ..."
                className="flex-1 text-sm bg-background border border-input rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-chat-message"
              />
              <Button size="sm" disabled={!draft.trim()} data-testid="button-send-chat">
                <Send className="w-4 h-4 mr-1.5" /> Отправить
              </Button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-3">
          <div className="bg-card border border-card-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Посетитель</h3>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{conv.visitor.name}</p>
                {conv.visitor.isAuth ? (
                  <p className="text-[11px] text-emerald-600">Авторизован · с {conv.visitor.since}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Гость</p>
                )}
              </div>
            </div>
            <ul className="space-y-1.5 text-xs">
              {conv.visitor.email && <li className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{conv.visitor.email}</span></li>}
              {conv.visitor.phone && <li className="flex justify-between"><span className="text-muted-foreground">Телефон</span><span className="font-mono">{conv.visitor.phone}</span></li>}
              <li className="flex justify-between"><span className="text-muted-foreground inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> Город</span><span>{conv.visitor.city}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground inline-flex items-center gap-1"><Smartphone className="w-3 h-3" /> Устройство</span><span className="text-right">{conv.visitor.device}</span></li>
            </ul>
          </div>

          {conv.relatedOrderId && (
            <div className="bg-card border border-card-border rounded-lg p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Связанный заказ</h3>
              <button
                onClick={() => setLocation(`/admin/orders/${conv.relatedOrderId}`)}
                className="w-full text-left p-3 rounded-md border border-border hover:bg-accent/40"
                data-testid="link-related-order"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="font-mono text-sm font-medium">{conv.relatedOrderId}</span>
                </div>
                <p className="text-xs text-muted-foreground">Forum на Arena · 2 билета · 4 800 ₽</p>
                <p className="text-xs text-primary mt-1">Открыть заказ →</p>
              </button>
            </div>
          )}

          <div className="bg-card border border-card-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Контекст страницы</h3>
            <p className="text-[11px] text-muted-foreground mb-1">Открыта страница</p>
            <p className="text-xs font-mono break-all">{conv.page}</p>
            <p className="text-[11px] text-muted-foreground mt-2 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> На сайте 4м 12с
            </p>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Теги</h3>
              <Button variant="ghost" size="sm" className="h-6 text-xs">+ Добавить</Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {conv.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded">
                  <Tag className="w-3 h-3" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
