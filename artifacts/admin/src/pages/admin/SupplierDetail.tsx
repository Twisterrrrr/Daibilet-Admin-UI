import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SupplierRoleBadge, getSupplierRoleDescription, type SupplierRole } from "@/components/shared/SupplierRoleBadge";
import { SyncStatusBadge } from "@/components/shared/SyncStatusBadge";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, formatDateTime, formatPhone } from "@/lib/utils";
import { ArrowLeft, Edit2, ExternalLink, Info, CheckCircle2, XCircle, Plug } from "lucide-react";
import { LegalRequisites, type LegalRequisitesData } from "@/components/shared/LegalRequisites";
import { HubGraph } from "@/components/shared/HubGraph";

const mockLegal: LegalRequisitesData = {
  country: "RU",
  form: "OOO",
  legalName: 'ООО "Стар Эвентс"',
  inn: "7707083893",
  kpp: "770701001",
  ogrn: "1187746432198",
  bankName: "Сбербанк России",
  iban: "40702810900000012345",
  bik: "044525225",
  legalAddress: "115191, г. Москва, ул. Большая Тульская, д. 10, стр. 9, офис 1102",
  actualAddress: "115191, г. Москва, ул. Большая Тульская, д. 10, стр. 9, офис 1102",
  sameAddress: true,
};

const mockSupplier = {
  id: "SUP-02",
  name: "Star Events",
  legalName: 'ТОО "Стар Эвентс"',
  bin: "180940004411",
  city: "Астана",
  address: "пр. Республики, 24, офис 1102",
  contactEmail: "events@star.kz",
  contactPhone: "+7 7172 555-44-22",
  website: "https://starevents.kz",
  status: "active",
  role: "api" as SupplierRole,
  cabinetActive: true,
  cabinetUserEmail: "manager@starevents.kz",
  managerName: "Сейткалиев Бауржан",
  managerEmail: "b.seitkaliev@daibilet.kz",
  createdAt: "2024-03-20",
  updatedAt: "2025-04-10",
  integration: {
    id: "INT-02",
    name: "Ticketscloud API",
    source: "api" as const,
    status: "stale" as const,
    lastSyncAt: "2026-04-21T02:00:00Z",
    eventsCount: 3,
  },
};

const mockEvents = [
  { id: "EVT-002", title: "Forum на Arena", date: "2025-06-02", status: "published", soldCount: 128, source: "api" as const },
  { id: "EVT-007", title: "Almaty Theatre Week", date: "2025-09-12", status: "published", soldCount: 88, source: "api" as const },
];

interface EventRow { id: string; title: string; date: string; status: string; soldCount: number; source: "manual" | "imported" | "api" | "hybrid"; }
const eventColumns: Column<EventRow>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
  { key: "title", header: "Название", cell: (r) => <span className="font-medium">{r.title}</span> },
  { key: "source", header: "Источник", cell: (r) => <SourceBadge source={r.source} /> },
  { key: "date", header: "Дата", cell: (r) => formatDate(r.date) },
  { key: "sold", header: "Продано", cell: (r) => r.soldCount },
  { key: "status", header: "Статус", cell: (r) => <StatusBadge status={r.status} /> },
];

export default function SupplierDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const hasIntegration = mockSupplier.role !== "internal";

  return (
    <AdminLayout
      title={mockSupplier.name}
      breadcrumbs={[
        { label: "Администратор" },
        { label: "Поставщики", href: "/admin/suppliers" },
        { label: mockSupplier.name },
      ]}
    >
      <PageHeader
        title={mockSupplier.name}
        description={
          <span className="inline-flex items-center gap-2 flex-wrap">
            <SupplierRoleBadge role={mockSupplier.role} />
            <StatusBadge status={mockSupplier.status} />
            <span className={`inline-flex items-center gap-1 text-xs ${mockSupplier.cabinetActive ? "text-green-600" : "text-muted-foreground"}`}>
              {mockSupplier.cabinetActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              ЛК {mockSupplier.cabinetActive ? "активен" : "не активен"}
            </span>
          </span>
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/suppliers")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Назад
            </Button>
            <Button size="sm" data-testid="button-edit-supplier">
              <Edit2 className="w-4 h-4 mr-1.5" /> Редактировать
            </Button>
          </>
        }
      />

      <Alert className="mb-4">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>{mockSupplier.role === "import_only" ? "Только импорт" : mockSupplier.role === "internal" ? "Внутренние + ЛК" : "Внешний API"}.</strong>{" "}
          {getSupplierRoleDescription(mockSupplier.role)}
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-4">
        <DetailSection title="Основная информация">
          <DetailField label="ID" value={mockSupplier.id} readOnly />
          <DetailField label="Тип / Роль" value={<SupplierRoleBadge role={mockSupplier.role} />} />
          <DetailField label="Статус" value={<StatusBadge status={mockSupplier.status} />} />
          <DetailField label="Торговое название" value={mockSupplier.name} />
          <DetailField label="Юридическое название" value={mockSupplier.legalName} readOnly />
          <DetailField label="БИН" value={mockSupplier.bin} readOnly />
          <DetailField label="Дата регистрации" value={formatDate(mockSupplier.createdAt)} readOnly />
        </DetailSection>

        <DetailSection title="Личный кабинет">
          <DetailField
            label="ЛК активирован"
            value={mockSupplier.cabinetActive ? (
              <span className="text-green-600 text-sm inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Да
              </span>
            ) : (
              <span className="text-muted-foreground text-sm inline-flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Нет (поставщик только импортируется)
              </span>
            )}
          />
          {mockSupplier.cabinetActive && (
            <DetailField label="E-mail для входа" value={mockSupplier.cabinetUserEmail} readOnly />
          )}
          {!mockSupplier.cabinetActive && mockSupplier.role === "import_only" && (
            <DetailField
              label="Действие"
              value={
                <Button size="sm" variant="outline" data-testid="button-activate-cabinet">
                  Активировать ЛК
                </Button>
              }
            />
          )}
        </DetailSection>

        {hasIntegration && (
          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold inline-flex items-center gap-2">
                <Plug className="w-4 h-4" /> Интеграция
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLocation(`/admin/integrations`)}
                data-testid="button-view-integration"
              >
                Открыть в Интеграциях →
              </Button>
            </div>
            <DetailSection>
              <DetailField label="ID интеграции" value={mockSupplier.integration.id} readOnly />
              <DetailField label="Источник" value={mockSupplier.integration.name} readOnly />
              <DetailField label="Тип" value={<SourceBadge source={mockSupplier.integration.source} />} />
              <DetailField label="Sync статус" value={<SyncStatusBadge status={mockSupplier.integration.status} />} />
              <DetailField label="Последняя синхронизация" value={formatDateTime(mockSupplier.integration.lastSyncAt)} readOnly />
              <DetailField label="События из источника" value={mockSupplier.integration.eventsCount} readOnly />
            </DetailSection>
          </div>
        )}

        <DetailSection title="Контакты">
          <DetailField label="E-mail" value={mockSupplier.contactEmail} />
          <DetailField label="Телефон" value={<span className="font-mono">{formatPhone(mockSupplier.contactPhone)}</span>} />
          <DetailField label="Сайт" value={
            mockSupplier.website ? (
              <a href={mockSupplier.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                {mockSupplier.website} <ExternalLink className="w-3 h-3" />
              </a>
            ) : "—"
          } />
          <DetailField label="Менеджер Daibilet" value={mockSupplier.managerName} />
          <DetailField label="Email менеджера" value={mockSupplier.managerEmail} />
        </DetailSection>

        <DetailSection title="Адрес">
          <DetailField label="Город" value={mockSupplier.city} readOnly />
          <DetailField label="Адрес" value={mockSupplier.address} readOnly />
        </DetailSection>

        <LegalRequisites data={mockLegal} />

        <HubGraph
          subject={`${mockSupplier.name} (${mockSupplier.id})`}
          links={[
            { group: "Город регистрации",  label: mockSupplier.city,                    href: "/admin/cities/CTY-002",                hint: mockSupplier.city === "Астана" ? "Astana" : undefined },
            { group: "Площадки поставщика", label: "Алатау Арена",                       href: "/admin/venues/VEN-001", count: 8 },
            { group: "Площадки поставщика", label: "Барыс Арена",                        href: "/admin/venues/VEN-002", count: 5 },
            { group: "События",             label: "Forum на Arena",                     href: "/admin/events/EVT-002", hint: "06.2025" },
            { group: "События",             label: "Almaty Theatre Week",                href: "/admin/events/EVT-007", hint: "09.2025" },
            { group: "Интеграция",          label: mockSupplier.integration.name,        href: "/admin/integrations",   hint: "API" },
            { group: "Финансы",              label: "Выплаты по поставщику",              href: "/admin/finance/payouts", count: 12, hint: "за 30д" },
            { group: "Финансы",              label: "Сверка за апрель",                    href: "/admin/finance/reconciliation",        hint: "акт-02-2026" },
            { group: "Команда",              label: "Менеджер: " + mockSupplier.managerName, href: "/admin/staff" },
          ]}
          warning={mockSupplier.integration.status === "stale" ? "Sync интеграции устарел — данные событий могут расходиться" : undefined}
        />

        <div className="bg-card border border-card-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">События поставщика ({mockEvents.length})</h3>
          </div>
          <DataTable
            columns={eventColumns}
            data={mockEvents}
            onRowClick={(r) => setLocation(`/admin/events/${r.id}`)}
            emptyMessage="Нет событий"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
