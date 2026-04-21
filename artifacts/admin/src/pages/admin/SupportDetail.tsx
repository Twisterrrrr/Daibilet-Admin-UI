import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const mockTicket = {
  id: "SUP-301",
  subject: "Не пришёл билет на e-mail",
  fromType: "buyer" as const,
  fromName: "Алия Бекова",
  fromEmail: "aliya@gmail.com",
  category: "Заказы",
  priority: "high",
  status: "new",
  orderId: "ORD-1041",
  createdAt: "2025-04-21T10:00:00Z",
  description: "Здравствуйте! Я оплатила билет 20 апреля, но на e-mail ничего не пришло. Помогите, пожалуйста.",
};

const messages = [
  { from: "Алия Бекова", at: "2025-04-21T10:00:00Z", text: mockTicket.description, isStaff: false },
];

export default function SupportDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [reply, setReply] = useState("");
  const ticketId = params?.id ?? mockTicket.id;

  return (
    <AdminLayout
      title={ticketId}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Обращения", href: "/admin/support" },
        { label: ticketId },
      ]}
    >
      <PageHeader
        title={mockTicket.subject}
        description={`${ticketId} · ${mockTicket.fromName}`}
        actions={
          <Button variant="outline" size="sm" onClick={() => setLocation("/admin/support")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Обращение">
          <DetailField label="ID" value={ticketId} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockTicket.status} />} />
          <DetailField label="Приоритет" value={mockTicket.priority} />
          <DetailField label="Категория" value={mockTicket.category} />
          <DetailField label="От кого" value={`${mockTicket.fromName} (${mockTicket.fromEmail})`} readOnly />
          <DetailField label="Связанный заказ" value={
            mockTicket.orderId ? (
              <button className="text-primary hover:underline text-sm font-mono" onClick={() => setLocation(`/admin/orders/${mockTicket.orderId}`)}>
                {mockTicket.orderId}
              </button>
            ) : "—"
          } />
          <DetailField label="Создан" value={formatDateTime(mockTicket.createdAt)} readOnly />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-3">Переписка</h3>
          <div className="flex flex-col gap-3 mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded-md ${m.isStaff ? "bg-primary/5 border border-primary/20" : "bg-muted"}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">{m.from}</span>
                  <span>·</span>
                  <span>{formatDateTime(m.at)}</span>
                </div>
                <p className="text-sm whitespace-pre-line">{m.text}</p>
              </div>
            ))}
          </div>
          <Textarea
            placeholder="Ответ покупателю..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            data-testid="textarea-support-reply"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" data-testid="button-close-ticket">Закрыть обращение</Button>
            <Button size="sm" disabled={!reply} data-testid="button-send-reply">Отправить ответ</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
