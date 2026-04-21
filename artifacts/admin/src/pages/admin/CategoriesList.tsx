import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  eventsCount: number;
  children?: Category[];
}

const mockCategories: Category[] = [
  { id: "CAT-01", name: "Музыка", slug: "music", eventsCount: 87, children: [
    { id: "CAT-01-1", name: "Классическая", slug: "classical", eventsCount: 14 },
    { id: "CAT-01-2", name: "Рок и метал", slug: "rock", eventsCount: 23 },
    { id: "CAT-01-3", name: "Поп / эстрада", slug: "pop", eventsCount: 31 },
    { id: "CAT-01-4", name: "Джаз / блюз", slug: "jazz", eventsCount: 9 },
    { id: "CAT-01-5", name: "Хип-хоп / R&B", slug: "hiphop", eventsCount: 10 },
  ]},
  { id: "CAT-02", name: "Театр", slug: "theatre", eventsCount: 42, children: [
    { id: "CAT-02-1", name: "Драма", slug: "drama", eventsCount: 18 },
    { id: "CAT-02-2", name: "Комедия", slug: "comedy", eventsCount: 14 },
    { id: "CAT-02-3", name: "Балет / опера", slug: "ballet", eventsCount: 10 },
  ]},
  { id: "CAT-03", name: "Спорт", slug: "sport", eventsCount: 28, children: [
    { id: "CAT-03-1", name: "Хоккей", slug: "hockey", eventsCount: 9 },
    { id: "CAT-03-2", name: "Футбол", slug: "football", eventsCount: 12 },
    { id: "CAT-03-3", name: "Бокс / MMA", slug: "mma", eventsCount: 7 },
  ]},
  { id: "CAT-04", name: "Дети", slug: "kids", eventsCount: 19 },
  { id: "CAT-05", name: "Stand-up", slug: "standup", eventsCount: 12 },
  { id: "CAT-06", name: "Конференции", slug: "conferences", eventsCount: 7 },
];

function CategoryItem({ cat, depth = 0 }: { cat: Category; depth?: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!cat.children && cat.children.length > 0;
  return (
    <div>
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 transition-colors ${depth > 0 ? "ml-6" : ""}`}
        data-testid={`category-${cat.id}`}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button onClick={() => setOpen(!open)} className="p-0.5">
              <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
            </button>
          ) : <span className="w-4" />}
          <div>
            <p className="text-sm font-medium">{cat.name}</p>
            <p className="text-xs text-muted-foreground font-mono">/{cat.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{cat.eventsCount} событий</span>
          <Button size="sm" variant="ghost" className="text-xs" data-testid={`button-edit-cat-${cat.id}`}>Изменить</Button>
        </div>
      </div>
      {hasChildren && open && (
        <div className="border-l border-border ml-3 mt-1 mb-2">
          {cat.children!.map((c) => <CategoryItem key={c.id} cat={c} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function CategoriesList() {
  return (
    <AdminLayout title="Категории" breadcrumbs={[{ label: "Администратор" }, { label: "Категории" }]}>
      <PageHeader
        title="Категории и подкатегории"
        description={`${mockCategories.length} корневых категорий`}
        actions={
          <Button size="sm" data-testid="button-create-category">
            <Plus className="w-4 h-4 mr-1.5" /> Создать категорию
          </Button>
        }
      />
      <div className="bg-card border border-card-border rounded-lg p-3">
        {mockCategories.map((c) => <CategoryItem key={c.id} cat={c} />)}
      </div>
    </AdminLayout>
  );
}
