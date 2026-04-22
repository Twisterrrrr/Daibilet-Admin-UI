import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  EmptyState,
  ErrorState,
  PartialErrorBanner,
  StatCardSkeleton,
  CardSkeleton,
} from "@/components/shared/SystemStates";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Inbox, ExternalLink } from "lucide-react";

interface DemoRow {
  id: string;
  name: string;
}

const cols: Column<DemoRow>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
  { key: "name", header: "Название", cell: (r) => r.name },
];

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function SystemStatesShowcase() {
  return (
    <AdminLayout
      title="Системные состояния"
      breadcrumbs={[{ label: "Администратор" }, { label: "Системные состояния" }]}
    >
      <PageHeader
        title="Системные состояния"
        description="Единые компоненты загрузки, пустых состояний, ошибок сети и частичных сбоев. Используйте на всех экранах для согласованного UX."
      />

      <div className="flex flex-col gap-8">
        <Section
          title="Скелетоны загрузки"
          description="Заполнители, повторяющие структуру контента. Используйте, пока данные ещё не пришли."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <CardSkeleton rows={4} />
            <CardSkeleton rows={4} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4 mt-3">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-3 w-full mb-1.5" />
            <Skeleton className="h-3 w-5/6" />
          </div>
          <div className="mt-3">
            <DataTable
              columns={cols}
              data={[] as DemoRow[]}
              isLoading
              data-testid="table-skeleton-demo"
            />
          </div>
        </Section>

        <Section
          title="Пустые состояния"
          description="Различайте «ничего не создано» (с CTA) и «ничего не найдено по фильтрам» (с подсказкой)."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EmptyState
              title="Пока нет ни одного события"
              description="Создайте первое событие вручную или подключите источник для автоматического импорта."
              action={
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Создать событие
                </Button>
              }
            />
            <EmptyState
              variant="no-results"
              title="Ничего не найдено"
              description="Попробуйте изменить фильтры или поисковый запрос."
            />
          </div>
        </Section>

        <Section
          title="Ошибки"
          description="Серверные, сетевые и ошибки прав. Каждая с явной кнопкой повтора, кодом и понятным текстом."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ErrorState
              variant="server"
              errorCode="HTTP 503"
              onRetry={() => {}}
            />
            <ErrorState
              variant="network"
              errorCode="ERR_NETWORK"
              onRetry={() => {}}
            />
            <ErrorState
              variant="permission"
              errorCode="403 FORBIDDEN"
            />
          </div>
        </Section>

        <Section
          title="Частичные сбои"
          description="Когда часть источников/провайдеров упала, но данные ещё показываемы. Используйте предупреждающий баннер сверху списка."
        >
          <PartialErrorBanner
            message="Не удалось получить свежие данные из части источников. Показаны последние успешные значения."
            failedSources={["ticketscloud", "kassir.ru"]}
            onRetry={() => {}}
          />
          <PartialErrorBanner
            message="Часть платёжных провайдеров вернула таймаут. Статусы оплаты могут быть неактуальны для отдельных заказов."
            failedSources={["Тинькофф Касса", "СБП"]}
            onRetry={() => {}}
          />
        </Section>

        <Section
          title="Демо в реальных списках"
          description="Передайте параметр ?state=loading|empty|error|partial в любой из списков, чтобы увидеть состояние без подмены данных."
        >
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: "События — загрузка", href: "/admin/events?state=loading" },
                { label: "События — пусто", href: "/admin/events?state=empty" },
                { label: "События — ошибка сервера", href: "/admin/events?state=error" },
                { label: "События — частичный сбой", href: "/admin/events?state=partial" },
                { label: "Заказы — загрузка", href: "/admin/orders?state=loading" },
                { label: "Заказы — пусто", href: "/admin/orders?state=empty" },
                { label: "Заказы — ошибка сервера", href: "/admin/orders?state=error" },
                { label: "Заказы — частичный сбой", href: "/admin/orders?state=partial" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 rounded-md border border-border hover:bg-muted/50 text-sm transition-colors"
                  data-testid={`demo-link-${item.href}`}
                >
                  <span>{item.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </Section>

        <Section
          title="Inline пустое состояние внутри таблицы"
          description="DataTable принимает emptyTitle / emptyDescription / emptyAction — рендерится прямо в строке таблицы вместо блёклого «Нет данных»."
        >
          <DataTable
            columns={cols}
            data={[] as DemoRow[]}
            emptyTitle="Пока нет записей"
            emptyDescription="Они появятся здесь сразу после первой синхронизации источника."
            emptyAction={<Button size="sm" variant="outline"><Inbox className="w-4 h-4 mr-1.5" /> Запустить синхронизацию</Button>}
            data-testid="table-inline-empty-demo"
          />
        </Section>
      </div>
    </AdminLayout>
  );
}
