import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <AdminLayout
      title="Настройки"
      breadcrumbs={[{ label: "Администратор" }, { label: "Настройки" }]}
    >
      <PageHeader
        title="Настройки платформы"
        description="Глобальные параметры системы"
      />

      <div className="max-w-2xl flex flex-col gap-6">
        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Общие</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="platform-name">Название платформы</Label>
              <Input id="platform-name" defaultValue="Daibilet" data-testid="input-platform-name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="support-email">E-mail поддержки</Label>
              <Input id="support-email" type="email" defaultValue="support@daibilet.kz" data-testid="input-support-email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="service-fee">Сервисный сбор (%)</Label>
              <Input id="service-fee" type="number" defaultValue="10" data-testid="input-service-fee" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Модерация</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Обязательная модерация событий</p>
                <p className="text-xs text-muted-foreground mt-0.5">Новые события поставщиков требуют одобрения до публикации</p>
              </div>
              <Switch defaultChecked data-testid="switch-moderation" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Автоматическая публикация</p>
                <p className="text-xs text-muted-foreground mt-0.5">Для верифицированных поставщиков</p>
              </div>
              <Switch data-testid="switch-auto-publish" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Возвраты</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="refund-window">Окно для возврата (дней)</Label>
              <Input id="refund-window" type="number" defaultValue="14" data-testid="input-refund-window" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Автоматический возврат</p>
                <p className="text-xs text-muted-foreground mt-0.5">При отмене события поставщиком</p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-refund" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button data-testid="button-save-settings">Сохранить настройки</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
