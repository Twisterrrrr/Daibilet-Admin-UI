import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "blocked";
  createdAt: string;
  lastLogin: string;
}

const mockUsers: UserRow[] = [
  { id: "USR-1182", name: "Алия Бекова", email: "aliya@gmail.com", phone: "+7 701 555-12-34", ordersCount: 7, totalSpent: 142000, status: "active", createdAt: "2024-09-12T10:00:00Z", lastLogin: "2025-04-21T08:14:00Z" },
  { id: "USR-1181", name: "Данияр Сейткали", email: "d.seitkali@mail.ru", phone: "+7 700 222-11-09", ordersCount: 3, totalSpent: 81000, status: "active", createdAt: "2024-11-03T11:00:00Z", lastLogin: "2025-04-20T13:10:00Z" },
  { id: "USR-1175", name: "Мария Петрова", email: "petrova@yandex.ru", phone: "+7 778 432-89-12", ordersCount: 2, totalSpent: 18000, status: "blocked", createdAt: "2024-12-21T16:00:00Z", lastLogin: "2025-04-15T09:00:00Z" },
  { id: "USR-1170", name: "Темирлан Жумабаев", email: "t.zhu@mail.ru", phone: "+7 701 778-90-12", ordersCount: 5, totalSpent: 95500, status: "active", createdAt: "2025-01-04T18:30:00Z", lastLogin: "2025-04-19T20:00:00Z" },
];

export default function UsersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<UserRow>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Имя", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "email", header: "E-mail", cell: (r) => r.email },
    { key: "phone", header: "Телефон", cell: (r) => r.phone },
    { key: "orders", header: "Заказов", cell: (r) => r.ordersCount },
    { key: "total", header: "Сумма покупок", cell: (r) => <span className="font-medium">{formatCurrency(r.totalSpent)}</span> },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "lastLogin", header: "Последний вход", cell: (r) => formatDateTime(r.lastLogin) },
  ];

  return (
    <AdminLayout title="Покупатели" breadcrumbs={[{ label: "Администратор" }, { label: "Покупатели" }]}>
      <PageHeader
        title="Покупатели"
        description={`${mockUsers.length} зарегистрированных пользователей`}
        actions={
          <Button variant="outline" size="sm" data-testid="button-export-users">
            <Download className="w-4 h-4 mr-1.5" /> Экспорт
          </Button>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Имя, e-mail, телефон..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-user-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="blocked">Заблокированы</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/users/${r.id}`)}
        emptyMessage="Покупатели не найдены"
        data-testid="table-users"
      />
    </AdminLayout>
  );
}
