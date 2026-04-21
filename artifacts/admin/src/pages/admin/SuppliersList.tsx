import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { Plus, Download } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  legalName: string;
  city: string;
  contactEmail: string;
  status: string;
  eventsCount: number;
  createdAt: string;
}

const mockSuppliers: Supplier[] = [
  { id: "SUP-01", name: "ArtPro Kazakhstan", legalName: 'ТОО "АртПро Казахстан"', city: "Алматы", contactEmail: "info@artpro.kz", status: "active", eventsCount: 14, createdAt: "2024-01-15" },
  { id: "SUP-02", name: "Star Events", legalName: 'ТОО "Стар Эвентс"', city: "Астана", contactEmail: "events@star.kz", status: "active", eventsCount: 8, createdAt: "2024-03-20" },
  { id: "SUP-03", name: "Comedy House", legalName: 'ИП Ахметов А.К.', city: "Алматы", contactEmail: "comedy@house.kz", status: "active", eventsCount: 5, createdAt: "2024-06-01" },
  { id: "SUP-04", name: "JazzMedia", legalName: 'ТОО "ДжазМедиа"', city: "Астана", contactEmail: "jazzmedia@kz.com", status: "active", eventsCount: 3, createdAt: "2024-07-11" },
  { id: "SUP-05", name: "KidsFest LLP", legalName: 'ТОО "КидсФест"', city: "Шымкент", contactEmail: "hello@kidsfest.kz", status: "inactive", eventsCount: 0, createdAt: "2024-09-05" },
  { id: "SUP-06", name: "NewTalent Studio", legalName: 'ИП Сейткали Д.М.', city: "Алматы", contactEmail: "nt@studio.kz", status: "pending", eventsCount: 0, createdAt: "2025-02-01" },
];

export default function SuppliersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const filtered = mockSuppliers.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.legalName.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.contactEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Supplier>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Название", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "legalName", header: "Юр. название", cell: (r) => <span className="text-muted-foreground text-xs">{r.legalName}</span> },
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
        description={`${mockSuppliers.length} поставщиков в системе`}
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
