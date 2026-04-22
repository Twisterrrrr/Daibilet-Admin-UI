import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SourceBadge, SalesModeBadge } from "@/components/shared/SourceBadge";
import { Tabs } from "@/components/shared/Tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowLeft, AlertTriangle, UserCheck, UserX } from "lucide-react";

const mockOrder = {
  id: "ORD-1041",
  buyer: "Алия Бекова",
  buyerEmail: "aliya@gmail.com",
  buyerPhone: "+7 701 555-12-34",
  buyerUserId: "USR-1182",
  buyerLinked: true,
  event: "Ночь музыки 2025",
  eventId: "EVT-001",
  venue: "Алатау Арена",
  eventDate: "2025-05-15T20:00:00Z",
  supplier: "ArtPro Kazakhstan",
  supplierId: "SUP-01",
  channel: "internal_checkout" as const,
  channelLabel: "Internal checkout",
  inventoryOwner: "imported" as const,
  salesMode: "internal_checkout" as const,
  externalSource: "ticketon.kz",
  externalOrderId: "TKT-ORD-554211",
  amount: 18000,
  serviceFee: 1800,
  ticketsCount: 2,
  status: "completed",
  paymentStatus: "paid",
  paymentProvider: "ЮKassa",
  paymentId: "KP-482112233",
  checkoutSessionId: "cs_2x9F8K1jhA92",
  visibleInBuyerAccount: true,
  visibleInSupplierCabinet: true,
  internalNote: "VIP покупатель — ускоренная обработка возвратов.",
  createdAt: "2025-04-20T14:22:00Z",
  updatedAt: "2025-04-20T14:25:00Z",
};

const mockTickets = [
  { id: "TKT-88211", seat: "Сектор A, ряд 5, место 12", type: "Стандарт", price: 9000, status: "active" },
  { id: "TKT-88212", seat: "Сектор A, ряд 5, место 13", type: "Стандарт", price: 9000, status: "active" },
];

const mockRefundRequests = [
  { id: "REF-22", reason: "Не смогу посетить мероприятие", amount: 18000, status: "pending", createdAt: "2025-04-21T10:00:00Z" },
];

const auditLog = [
  { ts: "2025-04-21T10:00:00Z", actor: "buyer:USR-1182", action: "создан запрос на возврат REF-22" },
  { ts: "2025-04-20T14:25:00Z", actor: "system/payment", action: "платёж подтверждён ЮKassa" },
  { ts: "2025-04-20T14:22:00Z", actor: "buyer:USR-1182", action: "checkout session создана" },
];

interface TicketRow { id: string; seat: string; type: string; price: number; status: string; }
const ticketColumns: Column<TicketRow>[] = [
  { key: "id", header: "ID билета", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
  { key: "seat", header: "Место", cell: (r) => r.seat },
  { key: "type", header: "Тип", cell: (r) => r.type },
  { key: "price", header: "Цена", cell: (r) => formatCurrency(r.price) },
  { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
];

interface RefundRow { id: string; reason: string; amount: number; status: string; createdAt: string; }
const refundColumns: Column<RefundRow>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
  { key: "reason", header: "Причина", cell: (r) => r.reason },
  { key: "amount", header: "Сумма", cell: (r) => formatCurrency(r.amount) },
  { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  { key: "date", header: "Дата", cell: (r) => formatDateTime(r.createdAt) },
];

export default function OrderDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [refundDecision, setRefundDecision] = useState("");
  const [refundNote, setRefundNote] = useState("");

  return (
    <AdminLayout
      title={mockOrder.id}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Заказы", href: "/admin/orders" },
        { label: mockOrder.id },
      ]}
    >
      <PageHeader
        title={`Заказ ${mockOrder.id}`}
        description={
          <span className="inline-flex items-center gap-2 flex-wrap">
            <SourceBadge source={mockOrder.inventoryOwner} />
            <SalesModeBadge mode={mockOrder.salesMode} />
            <StatusBadge status={mockOrder.status} />
            <StatusBadge status={mockOrder.paymentStatus} />
          </span>
        }
        actions={
          <Button variant="outline" size="sm" onClick={() => setLocation("/admin/orders")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
          </Button>
        }
      />

      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { key: "overview", label: "Обзор" },
          { key: "provenance", label: "Канал / провайдер" },
          { key: "tickets", label: "Билеты", count: mockTickets.length },
          { key: "refunds", label: "Возвраты", count: mockRefundRequests.length },
          { key: "audit", label: "Аудит" },
        ]}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Информация о заказе">
            <DetailField label="ID" value={mockOrder.id} readOnly />
            <DetailField label="Статус" value={<StatusBadge status={mockOrder.status} />} />
            <DetailField label="Статус оплаты" value={<StatusBadge status={mockOrder.paymentStatus} />} />
            <DetailField label="Создан" value={formatDateTime(mockOrder.createdAt)} readOnly />
            <DetailField label="Обновлён" value={formatDateTime(mockOrder.updatedAt)} readOnly />
            <DetailField label="Inventory owner" value={<SourceBadge source={mockOrder.inventoryOwner} />} />
          </DetailSection>

          <DetailSection title="Покупатель">
            <DetailField
              label="Имя"
              value={
                <span className="inline-flex items-center gap-2">
                  {mockOrder.buyer}
                  {mockOrder.buyerLinked ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <UserCheck className="w-3 h-3" /> привязан USR-{mockOrder.buyerUserId}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <UserX className="w-3 h-3" /> не привязан
                    </span>
                  )}
                </span>
              }
              readOnly
            />
            <DetailField label="E-mail" value={mockOrder.buyerEmail} readOnly />
            <DetailField label="Телефон" value={mockOrder.buyerPhone} readOnly />
          </DetailSection>

          <DetailSection title="Событие и поставщик">
            <DetailField label="Событие" value={
              <button className="text-primary hover:underline text-sm" onClick={() => setLocation(`/admin/events/${mockOrder.eventId}`)}>
                {mockOrder.event}
              </button>
            } />
            <DetailField label="Площадка" value={mockOrder.venue} readOnly />
            <DetailField label="Дата события" value={formatDateTime(mockOrder.eventDate)} readOnly />
            <DetailField label="Поставщик" value={
              <button className="text-primary hover:underline text-sm" onClick={() => setLocation(`/admin/suppliers/${mockOrder.supplierId}`)}>
                {mockOrder.supplier}
              </button>
            } />
          </DetailSection>

          <DetailSection title="Финансы">
            <DetailField label="Сумма заказа" value={formatCurrency(mockOrder.amount)} readOnly />
            <DetailField label="Сервисный сбор" value={formatCurrency(mockOrder.serviceFee)} readOnly />
            <DetailField label="Билетов" value={mockOrder.ticketsCount} readOnly />
          </DetailSection>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-2">Внутренняя заметка</h3>
            <p className="text-sm text-muted-foreground italic">{mockOrder.internalNote}</p>
          </div>
        </div>
      )}

      {tab === "provenance" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Канал и происхождение">
            <DetailField label="Канал" value={mockOrder.channelLabel} readOnly />
            <DetailField label="Inventory owner" value={<SourceBadge source={mockOrder.inventoryOwner} />} />
            <DetailField label="Sales mode" value={<SalesModeBadge mode={mockOrder.salesMode} />} />
            <DetailField label="External source" value={mockOrder.externalSource} readOnly />
            <DetailField label="External order ID" value={<span className="font-mono text-xs">{mockOrder.externalOrderId}</span>} readOnly />
          </DetailSection>

          <DetailSection title="Платёжный провайдер">
            <DetailField label="Способ оплаты" value={mockOrder.paymentProvider} readOnly />
            <DetailField label="ID платежа" value={<span className="font-mono text-xs">{mockOrder.paymentId}</span>} readOnly />
            <DetailField label="Checkout session" value={<span className="font-mono text-xs">{mockOrder.checkoutSessionId}</span>} readOnly />
          </DetailSection>

          <DetailSection title="Видимость в кабинетах">
            <DetailField
              label="ЛК покупателя"
              value={mockOrder.visibleInBuyerAccount ? (
                <span className="text-green-600 text-sm">Виден (привязан к USR-{mockOrder.buyerUserId})</span>
              ) : (
                <span className="text-muted-foreground text-sm">Скрыт — нет привязки</span>
              )}
              readOnly
            />
            <DetailField
              label="Кабинет поставщика"
              value={mockOrder.visibleInSupplierCabinet ? (
                <span className="text-green-600 text-sm">Виден поставщику {mockOrder.supplier}</span>
              ) : (
                <span className="text-muted-foreground text-sm">Скрыт</span>
              )}
              readOnly
            />
          </DetailSection>
        </div>
      )}

      {tab === "tickets" && (
        <div className="bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Билеты ({mockTickets.length})</h3>
          </div>
          <DataTable columns={ticketColumns} data={mockTickets} emptyMessage="Нет билетов" />
        </div>
      )}

      {tab === "refunds" && (
        <div className="bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-semibold">Запросы на возврат ({mockRefundRequests.length})</h3>
          </div>
          <DataTable columns={refundColumns} data={mockRefundRequests} emptyMessage="Нет запросов на возврат" />

          {mockRefundRequests.some((r) => r.status === "pending") && (
            <div className="p-5 border-t border-border">
              <p className="text-sm font-medium mb-3">Обработать запрос на возврат</p>
              <div className="flex flex-col gap-3 max-w-sm">
                <Select value={refundDecision} onValueChange={setRefundDecision}>
                  <SelectTrigger data-testid="select-refund-decision">
                    <SelectValue placeholder="Выберите решение..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Одобрить возврат</SelectItem>
                    <SelectItem value="reject">Отклонить</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Комментарий (необязательно)"
                  value={refundNote}
                  onChange={(e) => setRefundNote(e.target.value)}
                  rows={3}
                  data-testid="textarea-refund-note"
                />
                <Button
                  size="sm"
                  disabled={!refundDecision}
                  data-testid="button-submit-refund-decision"
                >
                  Применить решение
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "audit" && (
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">История событий</h3>
          <ul className="flex flex-col gap-3">
            {auditLog.map((entry, i) => (
              <li key={i} className="text-sm border-l-2 border-border pl-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDateTime(entry.ts)}</span>
                  <span>·</span>
                  <span className="font-mono">{entry.actor}</span>
                </div>
                <p>{entry.action}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
}
