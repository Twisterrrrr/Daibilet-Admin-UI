import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SupplierRoleBadge, type SupplierRole } from "@/components/shared/SupplierRoleBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { Plus, Download, CheckCircle2, XCircle } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  legalName: string;
  city: string;
  contactEmail: string;
  status: string;
  role: SupplierRole;
  cabinetActive: boolean;
  eventsCount: number;
  createdAt: string;
}

const mockSuppliers: Supplier[] = [
  { id: "SUP-01", name: "АртПро Концерты", legalName: 'ТОО "АртПро Россия"', city: "Москва", contactEmail: "info@artpro.kz", status: "active", role: "import_only", cabinetActive: false, eventsCount: 14, createdAt: "2024-01-15" },
  { id: "SUP-02", name: "Стар Ивентс", legalName: 'ТОО "Стар Эвентс"', city: "Санкт-Петербург", contactEmail: "events@star.kz", status: "active", role: "api", cabinetActive: true, eventsCount: 8, createdAt: "2024-03-20" },
  { id: "SUP-03", name: "Комеди Хаус", legalName: 'ИП Ахметов А.К.', city: "Москва", contactEmail: "comedy@house.kz", status: "active", role: "internal", cabinetActive: true, eventsCount: 5, createdAt: "2024-06-01" },
  { id: "SUP-04", name: "ДжазМедиа", legalName: 'ТОО "ДжазМедиа"', city: "Санкт-Петербург", contactEmail: "jazzmedia@mail.ru", status: "active", role: "api", cabinetActive: false, eventsCount: 3, createdAt: "2024-07-11" },
  { id: "SUP-05", name: "КидсФест ООО", legalName: 'ТОО "КидсФест"', city: "Казань", contactEmail: "hello@kidsfest.kz", status: "inactive", role: "internal", cabinetActive: true, eventsCount: 0, createdAt: "2024-09-05" },
  { id: "SUP-06", name: "NewTalent Studio", legalName: 'ИП Сейткали Д.М.', city: "Москва", contactEmail: "nt@studio.kz", status: "pending", role: "internal", cabinetActive: true, eventsCount: 0, createdAt: "2025-02-01" },
];

export default function SuppliersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockSuppliers.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.legalName.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.contactEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchRole = roleFilter === "all" || s.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const columns: Column<Supplier>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Название", cell: (r) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{r.name}</span>
        <span className="text-xs text-muted-foreground">{r.legalName}</span>
      </div>
    )},
    { key: "role", header: "Тип / Роль", cell: (r) => <SupplierRoleBadge role={r.role} /> },
    { key: "cabinet", header: "ЛК", cell: (r) => (
      <span className={`inline-flex items-center gap-1 text-xs ${r.cabinetActive ? "text-green-600" : "text-muted-foreground"}`}>
        {r.cabinetActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {r.cabinetActive ? "Активен" : "Не активен"}
      </span>
    )},
    { key: "city", header: "Город", cell: (r) => r.city },
    { key: "email", header: "E-mail", cell: (r) => r.contactEmail },
    { key: "events", header: "Событий", cell: (r) => r.eventsCount },
    { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "created", header: "Создан", cell: (r) => formatDate(r.createdAt) },
  ];

  return (
    <AdminLayout
      title="Поставщики"
      breadcrumbs={[{ label: "Администратор" }, { label: "Поставщики" }]}
    >
      <PageHeader
        title="Поставщики"
        description={`${mockSuppliers.length} поставщиков · ${mockSuppliers.filter((s) => s.cabinetActive).length} с активным ЛК`}
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-export-suppliers">
              <Download className="w-4 h-4 mr-1.5" /> Экспорт
            </Button>
            <Button size="sm" data-testid="button-invite-supplier">
              <Plus className="w-4 h-4 mr-1.5" /> Пригласить поставщика
            </Button>
          </>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по названию, e-mail, городу..."
        filters={
          <>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48" data-testid="select-supplier-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="import_only">Только импорт</SelectItem>
                <SelectItem value="internal">Внутренние + ЛК</SelectItem>
                <SelectItem value="api">Внешний API</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="select-supplier-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="inactive">Неактивные</SelectItem>
                <SelectItem value="pending">На рассмотрении</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(r) => setLocation(`/admin/suppliers/${r.id}`)}
        emptyMessage="Поставщики не найдены"
        data-testid="table-suppliers"
      />
    </AdminLayout>
  );
}
