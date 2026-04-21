import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Ban } from "lucide-react";

const mockUser = {
  id: "USR-1182",
  name: "Алия Бекова",
  email: "aliya@gmail.com",
  phone: "+7 701 555-12-34",
  status: "active",
  ordersCount: 7,
  totalSpent: 142000,
  createdAt: "2024-09-12T10:00:00Z",
  lastLogin: "2025-04-21T08:14:00Z",
  emailVerified: true,
  phoneVerified: true,
  marketingOptIn: false,
};

const recentOrders = [
  { id: "ORD-1041", event: "Ночь музыки 2025", amount: 18000, status: "completed", date: "2025-04-20T14:22:00Z" },
  { id: "ORD-0992", event: "Astana Jazz", amount: 31000, status: "completed", date: "2025-03-12T18:00:00Z" },
  { id: "ORD-0944", event: "Stand Up Night", amount: 9000, status: "cancelled", date: "2025-02-08T19:00:00Z" },
];

const orderColumns: Column<typeof recentOrders[number]>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
  { key: "event", header: "Событие", cell: (r) => r.event },
  { key: "amount", header: "Сумма", cell: (r) => formatCurrency(r.amount) },
  { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
  { key: "date", header: "Дата", cell: (r) => formatDateTime(r.date) },
];

export default function UserDetail({ params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const userId = params?.id ?? mockUser.id;

  return (
    <AdminLayout
      title={mockUser.name}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Покупатели", href: "/admin/users" },
        { label: mockUser.name },
      ]}
    >
      <PageHeader
        title={mockUser.name}
        description={`${userId} · ${mockUser.email}`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/users")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button variant="outline" size="sm" data-testid="button-block-user">
              <Ban className="w-4 h-4 mr-1.5" /> Заблокировать
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <DetailSection title="Профиль">
          <DetailField label="ID" value={userId} readOnly />
          <DetailField label="Статус" value={<StatusBadge status={mockUser.status} />} />
          <DetailField label="Имя" value={mockUser.name} readOnly />
          <DetailField label="E-mail" value={
            <span className="inline-flex items-center gap-2">
              {mockUser.email}
              {mockUser.emailVerified && <span className="text-[10px] text-green-600">✓ verified</span>}
            </span>
          } readOnly />
          <DetailField label="Телефон" value={
            <span className="inline-flex items-center gap-2">
              {mockUser.phone}
              {mockUser.phoneVerified && <span className="text-[10px] text-green-600">✓ verified</span>}
            </span>
          } readOnly />
          <DetailField label="Marketing opt-in" value={mockUser.marketingOptIn ? "Да" : "Нет"} readOnly />
          <DetailField label="Создан" value={formatDateTime(mockUser.createdAt)} readOnly />
          <DetailField label="Последний вход" value={formatDateTime(mockUser.lastLogin)} readOnly />
        </DetailSection>

        <DetailSection title="Покупки">
          <DetailField label="Заказов" value={mockUser.ordersCount} readOnly />
          <DetailField label="Сумма всех покупок" value={formatCurrency(mockUser.totalSpent)} readOnly />
        </DetailSection>

        <div className="bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Заказы покупателя ({recentOrders.length})</h3>
          </div>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            onRowClick={(r) => setLocation(`/admin/orders/${r.id}`)}
            emptyMessage="Нет заказов"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
