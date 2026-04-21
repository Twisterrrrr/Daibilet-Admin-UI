import { useState } from "react";
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { Plus, MessageSquare } from "lucide-react";

interface Request {
  id: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const myRequests: Request[] = [
  { id: "REQ-041", subject: "Ошибка в описании события EVT-001", category: "event", status: "completed", createdAt: "2025-04-10T10:00:00Z", updatedAt: "2025-04-12T14:00:00Z" },
  { id: "REQ-038", subject: "Запрос на изменение категории", category: "moderation", status: "pending", createdAt: "2025-04-18T09:00:00Z", updatedAt: "2025-04-18T09:00:00Z" },
];

const columns: Column<Request>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
  { key: "subject", header: "Тема", cell: (r) => <span className="font-medium">{r.subject}</span> },
  { key: "category", header: "Категория", cell: (r) => r.category },
  { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  { key: "created", header: "Создан", cell: (r) => formatDateTime(r.createdAt) },
  { key: "updated", header: "Обновлён", cell: (r) => formatDateTime(r.updatedAt) },
];

export default function SupplierSupport() {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <SupplierLayout
      title="Обращения"
      breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Обращения" }]}
    >
      <PageHeader
        title="Обращения в поддержку"
        description="Отправьте запрос или вопрос команде Daibilet"
        actions={
          <Button size="sm" onClick={() => setShowForm(!showForm)} data-testid="button-new-request">
            <Plus className="w-4 h-4 mr-1.5" />
            {showForm ? "Скрыть форму" : "Новое обращение"}
          </Button>
        }
      />

      {showForm && (
        <div className="bg-card border border-card-border rounded-lg p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Новое обращение</h3>
          </div>
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="flex flex-col gap-1.5">
              <Label>Категория</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-request-category">
                  <SelectValue placeholder="Выберите категорию..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Вопрос по событию</SelectItem>
                  <SelectItem value="moderation">Модерация</SelectItem>
                  <SelectItem value="technical">Технический вопрос</SelectItem>
                  <SelectItem value="financial">Финансы</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject">Тема</Label>
              <Input
                id="subject"
                placeholder="Кратко опишите проблему"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-testid="input-request-subject"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                placeholder="Подробное описание..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                data-testid="textarea-request-message"
              />
            </div>
            <div className="flex gap-2">
              <Button
                disabled={!category || !subject || !message}
                data-testid="button-submit-request"
              >
                Отправить обращение
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-card-border rounded-lg">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Мои обращения ({myRequests.length})</h3>
        </div>
        <DataTable
          columns={columns}
          data={myRequests}
          emptyMessage="Обращений нет"
          data-testid="supplier-table-requests"
        />
      </div>
    </SupplierLayout>
  );
}
