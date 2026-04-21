import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DetailSection, DetailField } from "@/components/shared/DetailField";
import { Tabs } from "@/components/shared/Tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, KeyRound, ShieldCheck, ShieldX, Trash2, Mail } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { roleMeta, RoleBadge, type StaffRole } from "./StaffList";

const user = {
  id: "USR-007",
  name: "Жанар Касимова",
  email: "zhanar@daibilet.kz",
  role: "manager" as StaffRole,
  status: "active",
  twoFA: true,
  createdAt: "2025-01-15T10:00:00Z",
  lastLoginAt: "2026-04-21T10:00:00Z",
  invitedBy: "Алия Жакупова",
  scopeCities: ["Алматы"],
  scopeCategories: ["Театр", "Концерты"],
  scopeSuppliers: [] as string[],
  sessions: [
    { id: "S1", device: "Chrome 124 · macOS",   ip: "85.234.12.41",  city: "Алматы",  current: true,  lastSeen: "2026-04-21T19:30:00Z" },
    { id: "S2", device: "Safari · iPhone 14",   ip: "212.45.88.10",  city: "Астана",  current: false, lastSeen: "2026-04-20T14:20:00Z" },
  ],
  recentActivity: [
    { t: "2026-04-21T19:30:00Z", a: "event.updated",     o: "EVT-118 «Forum на Arena»" },
    { t: "2026-04-21T18:42:00Z", a: "order.refunded",    o: "ORD-58092" },
    { t: "2026-04-21T16:10:00Z", a: "supplier.contacted",o: "SUP-014 Star Events" },
    { t: "2026-04-21T14:00:00Z", a: "auth.login",        o: "—" },
  ],
};

export default function StaffDetail({ params: _params }: { params?: { id?: string } }) {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [role, setRole] = useState<StaffRole>(user.role);

  return (
    <AdminLayout
      title={user.name}
      breadcrumbs={[{ label: "Администратор" }, { label: "Сотрудники", href: "/admin/staff" }, { label: user.name }]}
    >
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2 flex-wrap">
            {user.name}
            <RoleBadge role={role} />
            <span className="text-sm font-normal font-mono text-muted-foreground">{user.id}</span>
          </span>
        }
        description={user.email}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/staff")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> К списку
            </Button>
            <Button variant="outline" size="sm" data-testid="button-reset-password"><KeyRound className="w-4 h-4 mr-1.5" /> Сбросить пароль</Button>
            <Button variant="outline" size="sm" className="text-red-600" data-testid="button-suspend"><ShieldX className="w-4 h-4 mr-1.5" /> Заблокировать</Button>
          </>
        }
      />

      <Tabs
        items={[
          { key: "overview", label: "Обзор" },
          { key: "permissions", label: "Роль и доступ" },
          { key: "sessions", label: "Сессии", count: user.sessions.length },
          { key: "activity", label: "Активность" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <DetailSection title="Учётная запись">
            <DetailField label="ID" value={user.id} readOnly />
            <DetailField label="Email" value={user.email} />
            <DetailField label="Имя" value={user.name} />
            <DetailField label="Создан" value={formatDateTime(user.createdAt)} readOnly />
            <DetailField label="Приглашён" value={user.invitedBy} readOnly />
            <DetailField label="Последний вход" value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—"} readOnly />
          </DetailSection>

          <div className="bg-card border border-card-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-1 inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Двухфакторная аутентификация
                </h3>
                <p className="text-xs text-muted-foreground">
                  {user.twoFA ? "Включена. Используется приложение-аутентификатор." : "Не включена. Рекомендуется обязательно."}
                </p>
              </div>
              <Switch checked={user.twoFA} data-testid="switch-2fa" />
            </div>
          </div>
        </div>
      )}

      {tab === "permissions" && (
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-card-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-1">Роль</h3>
            <p className="text-xs text-muted-foreground mb-3">Определяет базовый набор прав. Дополнительные ограничения задаются ниже.</p>
            <div className="flex items-start gap-3">
              <Select value={role} onValueChange={(v) => setRole(v as StaffRole)}>
                <SelectTrigger className="w-64" data-testid="select-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(roleMeta) as StaffRole[]).map(r => (
                    <SelectItem key={r} value={r}>{roleMeta[r].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded">
                {roleMeta[role].description}
              </div>
            </div>
          </div>

          <DetailSection title="Ограничения области (scopes)">
            <DetailField label="Города" value={user.scopeCities.join(", ") || "Все города"} />
            <DetailField label="Категории" value={user.scopeCategories.join(", ") || "Все категории"} />
            <DetailField label="Поставщики" value={user.scopeSuppliers.join(", ") || "Все поставщики"} />
          </DetailSection>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200">
            Sсope-ограничения сужают видимость данных. Например, при ограничении «Алматы» сотрудник видит только события, заказы и поставщиков, относящиеся к Алматы.
          </div>
        </div>
      )}

      {tab === "sessions" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Устройство</th>
                <th className="text-left px-4 py-2 font-medium">IP</th>
                <th className="text-left px-4 py-2 font-medium">Город</th>
                <th className="text-left px-4 py-2 font-medium">Активность</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {user.sessions.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-2">
                    {s.device}
                    {s.current && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">текущая</span>}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{s.ip}</td>
                  <td className="px-4 py-2">{s.city}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{formatDateTime(s.lastSeen)}</td>
                  <td className="px-4 py-2 text-right">
                    {!s.current && (
                      <button className="text-red-600 hover:underline text-xs inline-flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Завершить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Время</th>
                <th className="text-left px-4 py-2 font-medium">Действие</th>
                <th className="text-left px-4 py-2 font-medium">Объект</th>
              </tr>
            </thead>
            <tbody>
              {user.recentActivity.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2 text-xs font-mono text-muted-foreground">{formatDateTime(r.t)}</td>
                  <td className="px-4 py-2 text-xs font-mono">{r.a}</td>
                  <td className="px-4 py-2 text-sm">{r.o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
