import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { TrendingUp, Users, Plug, Building2, RotateCcw, Calendar, FileText, Download, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  {
    group: "Продажи",
    items: [
      { href: "/admin/reports/sales", icon: TrendingUp, title: "Отчёт по продажам", desc: "GMV, билеты, средний чек по событиям, периодам, городам" },
      { href: "/admin/reports/channels", icon: Plug, title: "По источникам и каналам", desc: "Manual / Imported / API / Hybrid · Internal checkout / External / Mirror" },
      { href: "/admin/reports/conversion", icon: TrendingUp, title: "Конверсия воронки", desc: "Просмотры → корзина → оплата по каждому событию" },
    ],
  },
  {
    group: "Партнёры",
    items: [
      { href: "/admin/reports/suppliers", icon: Users, title: "По поставщикам", desc: "Оборот, комиссии, выплаты, refund rate" },
      { href: "/admin/reports/venues", icon: Building2, title: "По площадкам", desc: "Заполняемость, средний чек, оборот" },
      { href: "/admin/reports/cities", icon: Globe, title: "По городам", desc: "Оборот и количество событий по регионам" },
    ],
  },
  {
    group: "Операционные",
    items: [
      { href: "/admin/reports/refunds", icon: RotateCcw, title: "Возвраты", desc: "Refund rate, причины, динамика" },
      { href: "/admin/reports/scheduled", icon: Calendar, title: "Календарь событий", desc: "Загруженность по датам и площадкам" },
      { href: "/admin/finance/transactions", icon: FileText, title: "Журнал транзакций", desc: "Все платежи и возвраты с фильтрами" },
    ],
  },
];

export default function ReportsHub() {
  return (
    <AdminLayout title="Отчёты" breadcrumbs={[{ label: "Администратор" }, { label: "Отчёты" }]}>
      <PageHeader
        title="Отчёты и аналитика"
        description="Готовые отчёты с возможностью экспорта"
        actions={<Button variant="outline" size="sm" data-testid="button-export-bundle"><Download className="w-4 h-4 mr-1.5" /> Скачать пакет</Button>}
      />

      <div className="flex flex-col gap-6">
        {reports.map((g) => (
          <div key={g.group}>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">{g.group}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.items.map((r) => (
                <Link key={r.href} href={r.href}>
                  <div className="bg-card border border-card-border rounded-lg p-5 hover:border-primary cursor-pointer transition-colors h-full">
                    <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center mb-3">
                      <r.icon className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <p className="font-medium text-sm mb-1">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
