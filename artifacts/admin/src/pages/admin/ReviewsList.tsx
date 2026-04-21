import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { Star } from "lucide-react";

interface Review {
  id: string;
  buyer: string;
  event: string;
  supplier: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const mockReviews: Review[] = [
  { id: "REV-101", buyer: "Алия Бекова", event: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", rating: 5, text: "Отличное мероприятие, всё прошло на высоте!", status: "approved", createdAt: "2025-04-21T09:00:00Z" },
  { id: "REV-100", buyer: "Темирлан Жумабаев", event: "Astana Jazz", supplier: "JazzMedia", rating: 4, text: "Хороший концерт, но звук в центре зала был средний.", status: "pending", createdAt: "2025-04-20T22:00:00Z" },
  { id: "REV-099", buyer: "Мария Петрова", event: "Stand Up Night", supplier: "Comedy House", rating: 1, text: "Шутки были слабые. Жалею о потраченном времени.", status: "pending", createdAt: "2025-04-20T23:00:00Z" },
  { id: "REV-098", buyer: "Арман Дюсенов", event: "Детский фестиваль", supplier: "KidsFest LLP", rating: 5, text: "Дети в восторге, очень рекомендую!", status: "approved", createdAt: "2025-04-18T20:00:00Z" },
  { id: "REV-097", buyer: "Сания Нурланова", event: "Ночь музыки 2025", supplier: "ArtPro Kazakhstan", rating: 2, text: "Спам спам спам spam.com купите дешевле здесь...", status: "rejected", createdAt: "2025-04-19T11:00:00Z" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`}
        />
      ))}
    </span>
  );
}

export default function ReviewsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const filtered = mockReviews.filter((r) => {
    const matchSearch =
      !search ||
      r.buyer.toLowerCase().includes(search.toLowerCase()) ||
      r.event.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Review>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "buyer", header: "Покупатель", cell: (r) => r.buyer },
    { key: "event", header: "Событие", cell: (r) => (
      <div className="flex flex-col">
        <span className="text-sm">{r.event}</span>
        <span className="text-xs text-muted-foreground">{r.supplier}</span>
      </div>
    )},
    { key: "rating", header: "Оценка", cell: (r) => <Stars rating={r.rating} /> },
    { key: "text", header: "Отзыв", cell: (r) => <span className="text-sm line-clamp-2 max-w-xs block">{r.text}</span> },
    { key: "status", header: "Модерация", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "date", header: "Дата", cell: (r) => formatDateTime(r.createdAt) },
  ];

  const pending = mockReviews.filter((r) => r.status === "pending").length;

  return (
    <AdminLayout title="Отзывы" breadcrumbs={[{ label: "Администратор" }, { label: "Отзывы" }]}>
      <PageHeader
        title="Отзывы"
        description={`${mockReviews.length} отзывов · ${pending} ожидает модерации`}
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Поиск по тексту, покупателю..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44" data-testid="select-review-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="pending">На модерации</SelectItem>
              <SelectItem value="approved">Одобрены</SelectItem>
              <SelectItem value="rejected">Отклонены</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable columns={columns} data={filtered} emptyMessage="Отзывы не найдены" data-testid="table-reviews" />
    </AdminLayout>
  );
}
