import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const mockRefund = {
  id: "REF-22",
  orderId: "ORD-1041",
  buyer: "Алия Бекова",
  buyerEmail: "aliya@gmail.com",
  event: "Ночь музыки 2025",
  eventId: "EVT-001",
  supplier: "ArtPro Kazakhstan",
  supplierId: "SUP-01",
  amount: 18000,
  serviceFee: 1800,
  reason: "Не смогу посетить мероприятие — командировка",
  comment: "Прошу одобрить, билет покупался заранее.",
  status: "pending",
  paymentMethod: "ЮKassa",
  paymentRef: "KP-482112233",
  createdAt: "2025-04-21T10:00:00Z",
};

export default function RefundDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [decision, setDecision] = useState("");
  const [note, setNote] = useState("");
  const refundId = params?.id ?? mockRefund.id;

  return (
    <AdminLayout
      title={refundId}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Возвраты", href: "/admin/refunds" },
        { label: refundId },
      ]}
    >
      <PageHeader
        title={`Запрос на возврат ${refundId}`}
        description={<StatusBadge status={mockRefund.status} />}
        actions={
          <Button variant="outline" size="sm" onClick={() => setLocation("/admin/refunds")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Запрос">
          <DetailField label="ID" value={refundId} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockRefund.status} />} />
          <DetailField label="Создан" value={formatDateTime(mockRefund.createdAt)} readOnly />
          <DetailField label="Сумма к возврату" value={formatCurrency(mockRefund.amount)} readOnly />
          <DetailField label="Сервисный сбор" value={formatCurrency(mockRefund.serviceFee)} readOnly />
        </DetailSection>

        <DetailSection title="Заказ и покупатель">
          <DetailField label="Заказ" value={
            <button className="text-primary hover:underline text-sm font-mono" onClick={() => setLocation(`/admin/orders/${mockRefund.orderId}`)}>
              {mockRefund.orderId}
            </button>
          } />
          <DetailField label="Покупатель" value={mockRefund.buyer} readOnly />
          <DetailField label="E-mail" value={mockRefund.buyerEmail} readOnly />
          <DetailField label="Событие" value={
            <button className="text-primary hover:underline text-sm" onClick={() => setLocation(`/admin/events/${mockRefund.eventId}`)}>
              {mockRefund.event}
            </button>
          } />
          <DetailField label="Поставщик" value={
            <button className="text-primary hover:underline text-sm" onClick={() => setLocation(`/admin/suppliers/${mockRefund.supplierId}`)}>
              {mockRefund.supplier}
            </button>
          } />
        </DetailSection>

        <DetailSection title="Платёж">
          <DetailField label="Способ оплаты" value={mockRefund.paymentMethod} readOnly />
          <DetailField label="Ref платежа" value={<span className="font-mono text-xs">{mockRefund.paymentRef}</span>} readOnly />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">Причина и комментарий покупателя</h3>
          <p className="text-sm font-medium mb-1">{mockRefund.reason}</p>
          <p className="text-sm text-muted-foreground italic">{mockRefund.comment}</p>
        </div>

        {mockRefund.status === "pending" && (
          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Решение</h3>
            <div className="flex flex-col gap-3 max-w-sm">
              <Select value={decision} onValueChange={setDecision}>
                <SelectTrigger data-testid="select-refund-decision">
                  <SelectValue placeholder="Выберите решение..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Одобрить полностью</SelectItem>
                  <SelectItem value="approve_partial">Одобрить частично</SelectItem>
                  <SelectItem value="reject">Отклонить</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Комментарий для покупателя"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                data-testid="textarea-refund-note"
              />
              <Button size="sm" disabled={!decision} data-testid="button-submit-refund-decision">
                Применить решение
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
