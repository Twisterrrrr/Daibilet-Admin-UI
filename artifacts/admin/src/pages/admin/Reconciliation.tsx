import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, RefreshCw, Upload, FileText } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

interface ReconRow {
  id: string;
  date: string;
  provider: string;
  ourTotal: number;
  providerTotal: number;
  diff: number;
  rowsOk: number;
  rowsMismatch: number;
  status: "matched" | "mismatch" | "pending";
}

const recon: ReconRow[] = [
  { id: "REC-2026-04-20-kaspi", date: "2026-04-20", provider: "Kaspi Pay",  ourTotal: 28_900_000, providerTotal: 28_758_000, diff: -142_000, rowsOk: 281, rowsMismatch: 4, status: "mismatch" },
  { id: "REC-2026-04-20-halyk", date: "2026-04-20", provider: "Halyk",      ourTotal: 14_200_000, providerTotal: 14_200_000, diff: 0,        rowsOk: 142, rowsMismatch: 0, status: "matched" },
  { id: "REC-2026-04-20-woop",  date: "2026-04-20", provider: "Wooppay",    ourTotal: 9_800_000,  providerTotal: 9_800_000,  diff: 0,        rowsOk: 88,  rowsMismatch: 0, status: "matched" },
  { id: "REC-2026-04-20-forte", date: "2026-04-20", provider: "ForteBank",  ourTotal: 7_400_000,  providerTotal: 0,           diff: -7_400_000, rowsOk: 0, rowsMismatch: 0, status: "pending" },
  { id: "REC-2026-04-19-kaspi", date: "2026-04-19", provider: "Kaspi Pay",  ourTotal: 26_100_000, providerTotal: 26_100_000, diff: 0,        rowsOk: 254, rowsMismatch: 0, status: "matched" },
];

const mismatchDetails = [
  { our: "TX-89901 / 14 200 ₸", their: "kaspi:8821-410 / 14 250 ₸", diff: 50,    note: "Несоответствие суммы (округление?)" },
  { our: "TX-89887 / 12 000 ₸", their: "не найдено",                  diff: -12000, note: "Платёж не пришёл от провайдера" },
  { our: "не найдено",            their: "kaspi:8821-405 / 8 500 ₸",  diff: 8500,  note: "Лишний платёж от провайдера" },
  { our: "TX-89875 / 6 000 ₸",  their: "kaspi:8821-401 / 6 050 ₸",  diff: 50,    note: "Несоответствие суммы" },
];

export default function Reconciliation() {
  const [provider, setProvider] = useState("all");
  const [period, setPeriod] = useState("today");

  const filtered = recon.filter((r) => provider === "all" || r.provider === provider);
  const matched = recon.filter((r) => r.status === "matched").length;
  const mismatched = recon.filter((r) => r.status === "mismatch").length;
  const pending = recon.filter((r) => r.status === "pending").length;
  const totalDiff = recon.reduce((s, r) => s + r.diff, 0);

  return (
    <AdminLayout title="Сверки" breadcrumbs={[{ label: "Администратор" }, { label: "Финансы", href: "/admin/finance" }, { label: "Сверки" }]}>
      <PageHeader
        title="Сверки с провайдерами"
        description="Сравнение наших данных с выписками платёжных провайдеров"
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-import-statement"><Upload className="w-4 h-4 mr-1.5" /> Загрузить выписку</Button>
            <Button size="sm" data-testid="button-run-recon"><RefreshCw className="w-4 h-4 mr-1.5" /> Запустить сверку</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Сходится" value={matched} icon={CheckCircle2} />
        <StatCard label="Расхождения" value={mismatched} icon={AlertCircle} />
        <StatCard label="Ожидают выписку" value={pending} icon={FileText} />
        <StatCard label="Дельта" value={formatCurrency(Math.abs(totalDiff))} icon={AlertCircle} />
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="w-44" data-testid="select-recon-provider"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все провайдеры</SelectItem>
            <SelectItem value="Kaspi Pay">Kaspi Pay</SelectItem>
            <SelectItem value="Halyk">Halyk</SelectItem>
            <SelectItem value="Wooppay">Wooppay</SelectItem>
            <SelectItem value="ForteBank">ForteBank</SelectItem>
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40" data-testid="select-recon-period"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Сегодня</SelectItem>
            <SelectItem value="yesterday">Вчера</SelectItem>
            <SelectItem value="7d">7 дней</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-card-border rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2 font-medium">ID</th>
              <th className="text-left px-4 py-2 font-medium">Дата</th>
              <th className="text-left px-4 py-2 font-medium">Провайдер</th>
              <th className="text-right px-4 py-2 font-medium">Наш итог</th>
              <th className="text-right px-4 py-2 font-medium">Итог провайдера</th>
              <th className="text-right px-4 py-2 font-medium">Дельта</th>
              <th className="text-right px-4 py-2 font-medium">OK / Расх.</th>
              <th className="text-left px-4 py-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-accent/40">
                <td className="px-4 py-2 font-mono text-xs">{r.id}</td>
                <td className="px-4 py-2">{formatDate(r.date)}</td>
                <td className="px-4 py-2 font-medium">{r.provider}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(r.ourTotal)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{r.status === "pending" ? "—" : formatCurrency(r.providerTotal)}</td>
                <td className={`px-4 py-2 text-right tabular-nums font-medium ${r.diff !== 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {r.diff === 0 ? "0 ₸" : formatCurrency(r.diff)}
                </td>
                <td className="px-4 py-2 text-right text-xs">
                  <span className="text-emerald-600">{r.rowsOk}</span>
                  {r.rowsMismatch > 0 && <span className="text-red-600"> / {r.rowsMismatch}</span>}
                </td>
                <td className="px-4 py-2">
                  {r.status === "matched" && <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Сходится</span>}
                  {r.status === "mismatch" && <span className="inline-flex items-center gap-1 text-xs text-red-700"><AlertCircle className="w-3 h-3" /> Расхождение</span>}
                  {r.status === "pending" && <span className="inline-flex items-center gap-1 text-xs text-amber-700"><FileText className="w-3 h-3" /> Нет выписки</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-card-border rounded-lg">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <h3 className="text-sm font-semibold">Детализация расхождений: REC-2026-04-20-kaspi</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Наша запись</th>
              <th className="text-left px-4 py-2 font-medium">Запись провайдера</th>
              <th className="text-right px-4 py-2 font-medium">Дельта</th>
              <th className="text-left px-4 py-2 font-medium">Комментарий</th>
              <th className="text-right px-4 py-2 font-medium">Действие</th>
            </tr>
          </thead>
          <tbody>
            {mismatchDetails.map((m, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2 font-mono text-xs">{m.our}</td>
                <td className="px-4 py-2 font-mono text-xs">{m.their}</td>
                <td className={`px-4 py-2 text-right tabular-nums font-medium ${m.diff < 0 ? "text-red-600" : "text-amber-600"}`}>
                  {m.diff > 0 ? "+" : ""}{formatCurrency(m.diff)}
                </td>
                <td className="px-4 py-2 text-muted-foreground">{m.note}</td>
                <td className="px-4 py-2 text-right">
                  <Button variant="outline" size="sm" data-testid={`button-resolve-${i}`}>Разобрать</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
