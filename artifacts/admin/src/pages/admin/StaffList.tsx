import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, Column } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs } from "@/components/shared/Tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ShieldCheck, ShieldAlert, ShieldX, Crown, KeyRound, UserCog, Eye, Headphones, BarChart3, Wallet } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export type StaffRole = "owner" | "admin" | "manager" | "editor" | "support" | "finance" | "analyst" | "readonly";

export const roleMeta: Record<StaffRole, { label: string; icon: typeof Crown; className: string; description: string }> = {
  owner:    { label: "Владелец",        icon: Crown,        className: "bg-amber-100 text-amber-800",       description: "Полный доступ, единственный может управлять биллингом и владельцами" },
  admin:    { label: "Администратор",   icon: ShieldCheck,  className: "bg-violet-100 text-violet-700",     description: "Полный доступ ко всем разделам, кроме биллинга" },
  manager:  { label: "Менеджер",        icon: UserCog,      className: "bg-blue-100 text-blue-700",         description: "События, заказы, поставщики, отзывы, чаты — без финансов и системных настроек" },
  editor:   { label: "Контент-редактор",icon: KeyRound,     className: "bg-emerald-100 text-emerald-700",   description: "Лендинги, статьи, города, площадки, SEO, медиа" },
  support:  { label: "Поддержка",       icon: Headphones,   className: "bg-sky-100 text-sky-700",           description: "Обращения, чаты, отзывы, заказы (read-write по своим тикетам)" },
  finance:  { label: "Финансист",       icon: Wallet,       className: "bg-teal-100 text-teal-700",         description: "Финансы, выплаты, сверки, транзакции, отчёты — read-write" },
  analyst:  { label: "Аналитик",        icon: BarChart3,    className: "bg-indigo-100 text-indigo-700",     description: "Все отчёты и дашборды на чтение, экспорт данных" },
  readonly: { label: "Только чтение",   icon: Eye,          className: "bg-slate-100 text-slate-700",       description: "Просмотр любых разделов, без права редактирования" },
};

interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "active" | "invited" | "suspended";
  lastLoginAt: string | null;
  twoFA: boolean;
  scopes: string[]; // e.g. city limit, supplier limit
  createdAt: string;
}

const mockStaff: Staff[] = [
  { id: "USR-001", name: "Сергей Ким",       email: "ceo@daibilet.kz",      role: "owner",    status: "active",    lastLoginAt: "2026-04-21T18:42:00Z", twoFA: true,  scopes: [], createdAt: "2024-01-10" },
  { id: "USR-002", name: "Алия Жакупова",    email: "aliya@daibilet.kz",    role: "admin",    status: "active",    lastLoginAt: "2026-04-21T19:30:00Z", twoFA: true,  scopes: [], createdAt: "2024-02-01" },
  { id: "USR-003", name: "Динара Омарова",   email: "dinara@daibilet.kz",   role: "support",  status: "active",    lastLoginAt: "2026-04-21T19:44:00Z", twoFA: false, scopes: [], createdAt: "2024-05-12" },
  { id: "USR-004", name: "Аскар Бектуров",   email: "askar@daibilet.kz",    role: "support",  status: "active",    lastLoginAt: "2026-04-21T16:10:00Z", twoFA: true,  scopes: [], createdAt: "2024-08-22" },
  { id: "USR-005", name: "Мария Костенко",   email: "maria@daibilet.kz",    role: "editor",   status: "active",    lastLoginAt: "2026-04-21T11:20:00Z", twoFA: false, scopes: ["Алматы"], createdAt: "2024-11-04" },
  { id: "USR-006", name: "Тимур Сатпаев",    email: "timur@daibilet.kz",    role: "finance",  status: "active",    lastLoginAt: "2026-04-20T17:00:00Z", twoFA: true,  scopes: [], createdAt: "2024-09-01" },
  { id: "USR-007", name: "Жанар Касимова",   email: "zhanar@daibilet.kz",   role: "manager",  status: "active",    lastLoginAt: "2026-04-21T10:00:00Z", twoFA: true,  scopes: ["Театр", "Концерты"], createdAt: "2025-01-15" },
  { id: "USR-008", name: "Айдос Бекенов",    email: "aidos@daibilet.kz",    role: "analyst",  status: "active",    lastLoginAt: "2026-04-19T14:25:00Z", twoFA: true,  scopes: [], createdAt: "2025-02-20" },
  { id: "USR-009", name: "Гость-аудитор",    email: "audit@partner.kz",     role: "readonly", status: "active",    lastLoginAt: "2026-04-15T09:00:00Z", twoFA: false, scopes: ["Финансы"], createdAt: "2026-03-10" },
  { id: "USR-010", name: "Новый сотрудник",  email: "new@daibilet.kz",      role: "support",  status: "invited",   lastLoginAt: null,                    twoFA: false, scopes: [], createdAt: "2026-04-21" },
  { id: "USR-011", name: "Бывший сотрудник", email: "former@daibilet.kz",   role: "manager",  status: "suspended", lastLoginAt: "2026-03-12T10:00:00Z", twoFA: false, scopes: [], createdAt: "2024-06-01" },
];

export function RoleBadge({ role }: { role: StaffRole }) {
  const m = roleMeta[role]; const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.className}`}>
      <Icon className="w-3 h-3" /> {m.label}
    </span>
  );
}

function StatusChip({ status }: { status: Staff["status"] }) {
  const m = {
    active:    { label: "Активен",      className: "bg-emerald-100 text-emerald-700", icon: ShieldCheck },
    invited:   { label: "Приглашён",    className: "bg-blue-100 text-blue-700",       icon: ShieldAlert },
    suspended: { label: "Заблокирован", className: "bg-red-100 text-red-700",         icon: ShieldX },
  }[status];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.className}`}>
      <Icon className="w-3 h-3" /> {m.label}
    </span>
  );
}

export default function StaffList() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"users" | "roles" | "audit">("users");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [, setLocation] = useLocation();

  const filtered = mockStaff.filter((s) => {
    const m = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    return m && (role === "all" || s.role === role) && (status === "all" || s.status === status);
  });

  const stats = {
    active: mockStaff.filter(s => s.status === "active").length,
    invited: mockStaff.filter(s => s.status === "invited").length,
    suspended: mockStaff.filter(s => s.status === "suspended").length,
    no2fa: mockStaff.filter(s => !s.twoFA && s.status === "active").length,
  };

  const columns: Column<Staff>[] = [
    { key: "user", header: "Пользователь", cell: (s) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          {s.name.split(" ").map(p => p[0]).join("").slice(0, 2)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{s.name}</span>
          <span className="text-xs text-muted-foreground">{s.email}</span>
        </div>
      </div>
    )},
    { key: "role", header: "Роль", cell: (s) => <RoleBadge role={s.role} /> },
    { key: "scopes", header: "Ограничения", cell: (s) => (
      s.scopes.length === 0 ? <span className="text-xs text-muted-foreground">—</span> : (
        <div className="flex flex-wrap gap-1">
          {s.scopes.map(sc => <span key={sc} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{sc}</span>)}
        </div>
      )
    )},
    { key: "2fa", header: "2FA", cell: (s) => (
      s.twoFA
        ? <span className="text-xs text-emerald-600 inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Вкл</span>
        : <span className="text-xs text-amber-600 inline-flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Выкл</span>
    )},
    { key: "status", header: "Статус", cell: (s) => <StatusChip status={s.status} /> },
    { key: "lastLogin", header: "Последний вход", cell: (s) => (
      s.lastLoginAt ? <span className="text-xs">{formatDateTime(s.lastLoginAt)}</span> : <span className="text-xs text-muted-foreground">никогда</span>
    )},
  ];

  // Permissions matrix
  const sections = ["События", "Заказы", "Поставщики", "Финансы", "Лендинги/SEO", "Чат", "Отзывы", "Логи", "Настройки", "Сотрудники"];
  type P = "rw" | "r" | "—";
  const matrix: Record<StaffRole, P[]> = {
    owner:    ["rw", "rw", "rw", "rw", "rw", "rw", "rw", "rw", "rw", "rw"],
    admin:    ["rw", "rw", "rw", "rw", "rw", "rw", "rw", "rw", "rw", "rw"],
    manager:  ["rw", "rw", "rw", "r",  "—",  "rw", "rw", "r",  "—",  "—" ],
    editor:   ["r",  "—",  "—",  "—",  "rw", "—",  "rw", "—",  "—",  "—" ],
    support:  ["r",  "rw", "r",  "—",  "—",  "rw", "rw", "—",  "—",  "—" ],
    finance:  ["r",  "r",  "r",  "rw", "—",  "—",  "—",  "r",  "—",  "—" ],
    analyst:  ["r",  "r",  "r",  "r",  "r",  "—",  "r",  "r",  "—",  "—" ],
    readonly: ["r",  "r",  "r",  "r",  "r",  "—",  "r",  "—",  "—",  "—" ],
  };
  const pBadge = (p: P) => p === "rw"
    ? <span className="text-emerald-600 font-medium">●</span>
    : p === "r"
      ? <span className="text-blue-600">○</span>
      : <span className="text-muted-foreground/40">—</span>;

  return (
    <AdminLayout title="Сотрудники / RBAC" breadcrumbs={[{ label: "Администратор" }, { label: "Система" }, { label: "Сотрудники" }]}>
      <PageHeader
        title="Сотрудники"
        description={`${mockStaff.length} аккаунтов · ${stats.active} активных · ${stats.invited} приглашений · ${stats.no2fa} без 2FA`}
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-export-audit">Журнал доступа</Button>
            <Button size="sm" data-testid="button-invite-staff"><Plus className="w-4 h-4 mr-1.5" /> Пригласить</Button>
          </>
        }
      />

      {stats.no2fa > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 mb-4 flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{stats.no2fa} активных сотрудников не включили двухфакторную аутентификацию. Это нарушение политики безопасности.</span>
        </div>
      )}

      <Tabs
        items={[
          { key: "users", label: "Пользователи", count: mockStaff.length },
          { key: "roles", label: "Роли и права" },
          { key: "audit", label: "Журнал доступа" },
        ]}
        active={tab}
        onChange={(v) => setTab(v as any)}
      />

      {tab === "users" && (
        <>
          <FilterBar
            search={search} onSearchChange={setSearch}
            searchPlaceholder="Поиск по имени или email..."
            filters={
              <>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-44" data-testid="select-staff-role"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все роли</SelectItem>
                    {(Object.keys(roleMeta) as StaffRole[]).map(r => (
                      <SelectItem key={r} value={r}>{roleMeta[r].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-40" data-testid="select-staff-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="invited">Приглашённые</SelectItem>
                    <SelectItem value="suspended">Заблокированные</SelectItem>
                  </SelectContent>
                </Select>
              </>
            }
          />
          <DataTable columns={columns} data={filtered} onRowClick={(s) => setLocation(`/admin/staff/${s.id}`)} emptyMessage="Сотрудники не найдены" data-testid="table-staff" />
        </>
      )}

      {tab === "roles" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(roleMeta) as StaffRole[]).map(r => {
              const m = roleMeta[r]; const Icon = m.icon;
              const count = mockStaff.filter(s => s.role === r).length;
              return (
                <div key={r} className="bg-card border border-card-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                  </div>
                  <p className="text-sm font-semibold mb-1">{m.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Матрица прав</h3>
              <span className="text-[11px] text-muted-foreground">
                <span className="text-emerald-600 mr-1">●</span> чтение/запись
                <span className="text-blue-600 mx-2">○</span> только чтение
                <span className="text-muted-foreground ml-1">— нет доступа</span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium sticky left-0 bg-muted/50">Раздел</th>
                    {(Object.keys(roleMeta) as StaffRole[]).map(r => (
                      <th key={r} className="text-center px-3 py-2 font-medium">{roleMeta[r].label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sections.map((sec, i) => (
                    <tr key={sec} className="border-t border-border">
                      <td className="px-4 py-2 sticky left-0 bg-card font-medium">{sec}</td>
                      {(Object.keys(roleMeta) as StaffRole[]).map(r => (
                        <td key={r} className="px-3 py-2 text-center text-base">{pBadge(matrix[r][i])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Время</th>
                <th className="text-left px-4 py-2 font-medium">Пользователь</th>
                <th className="text-left px-4 py-2 font-medium">Действие</th>
                <th className="text-left px-4 py-2 font-medium">Объект</th>
                <th className="text-left px-4 py-2 font-medium">IP</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                { t: "2026-04-21T19:42:01Z", u: "Динара Омарова",   a: "chat.assigned",     o: "CHT-1023",    ip: "85.234.12.41" },
                { t: "2026-04-21T19:35:18Z", u: "Алия Жакупова",    a: "event.published",   o: "EVT-118",     ip: "212.45.88.10" },
                { t: "2026-04-21T19:30:55Z", u: "Тимур Сатпаев",    a: "payout.marked_paid",o: "PO-2026-04-19-002", ip: "5.34.122.4" },
                { t: "2026-04-21T19:18:02Z", u: "Мария Костенко",   a: "landing.updated",   o: "LND-007",     ip: "85.234.12.55" },
                { t: "2026-04-21T19:00:42Z", u: "Аскар Бектуров",   a: "review.rejected",   o: "REV-095",     ip: "212.45.99.2" },
                { t: "2026-04-21T18:55:12Z", u: "Сергей Ким",       a: "staff.role_changed",o: "USR-007 → manager", ip: "5.34.122.4" },
              ].map((row, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2 font-mono text-muted-foreground">{formatDateTime(row.t)}</td>
                  <td className="px-4 py-2">{row.u}</td>
                  <td className="px-4 py-2 font-mono">{row.a}</td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{row.o}</td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
