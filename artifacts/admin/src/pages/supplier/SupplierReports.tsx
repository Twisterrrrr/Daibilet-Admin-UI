import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart2, FileText, Clock } from "lucide-react";

export default function SupplierReports() {
  return (
    <SupplierLayout
      title="Отчёты"
      breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Отчёты" }]}
    >
      <PageHeader
        title="Отчёты"
        description="Аналитика и экспорт данных"
      />

      <div className="flex flex-col items-center justify-center min-h-[320px] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <BarChart2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Раздел в разработке</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Здесь будут доступны финансовые отчёты, статистика продаж и экспорт данных.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Доступно в следующих версиях платформы</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full max-w-xl">
          {[
            { icon: FileText, title: "Отчёт по продажам", desc: "Детализация по событиям и периодам" },
            { icon: BarChart2, title: "Статистика по билетам", desc: "Конверсия и заполняемость залов" },
            { icon: FileText, title: "Финансовый отчёт", desc: "Выручка, сборы и выплаты" },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-border rounded-lg p-4 bg-card opacity-50 cursor-not-allowed"
            >
              <item.icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SupplierLayout>
  );
}
