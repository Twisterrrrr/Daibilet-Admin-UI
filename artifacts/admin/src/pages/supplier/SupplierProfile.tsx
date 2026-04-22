import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DetailField } from "@/components/shared/DetailField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Edit2 } from "lucide-react";
import { useState } from "react";

const supplierData = {
  id: "SUP-01",
  name: "АртПро Концерты",
  legalName: 'ТОО "АртПро Россия"',
  bin: "180940001234",
  city: "Москва",
  address: "ул. Жибек Жолы, 48, офис 305",
  contactEmail: "info@artpro.kz",
  contactPhone: "+7 727 355-66-77",
  website: "https://artpro.kz",
  status: "active",
  managerName: "Нурланов Ерлан",
  managerEmail: "e.nurlanov@artpro.kz",
};

export default function SupplierProfile() {
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState(supplierData.contactPhone);
  const [website, setWebsite] = useState(supplierData.website);
  const [contactEmail, setContactEmail] = useState(supplierData.contactEmail);

  return (
    <SupplierLayout
      title="Профиль / Компания"
      breadcrumbs={[{ label: "Кабинет поставщика" }, { label: "Профиль / Компания" }]}
    >
      <PageHeader
        title="Профиль компании"
        description="Ваши данные на платформе Daibilet"
        actions={
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode(!editMode)}
            data-testid="button-toggle-edit-profile"
          >
            <Edit2 className="w-4 h-4 mr-1.5" />
            {editMode ? "Сохранить" : "Редактировать"}
          </Button>
        }
      />

      <div className="max-w-3xl flex flex-col gap-4">
        <div className="bg-card border border-card-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Юридическая информация</h3>
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded ml-1">только для чтения</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField label="ID поставщика" value={supplierData.id} readOnly />
            <DetailField label="Статус" value={<StatusBadge status={supplierData.status} />} readOnly />
            <DetailField label="Юридическое название" value={supplierData.legalName} readOnly />
            <DetailField label="БИН" value={supplierData.bin} readOnly />
            <DetailField label="Город" value={supplierData.city} readOnly />
            <DetailField label="Юридический адрес" value={supplierData.address} readOnly />
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Контактные данные</h3>
          {editMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-email">Контактный e-mail</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  data-testid="input-contact-email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-phone">Телефон</Label>
                <Input
                  id="contact-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="input-contact-phone"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="website">Веб-сайт</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  data-testid="input-website"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Контактный e-mail" value={contactEmail} />
              <DetailField label="Телефон" value={phone} />
              <DetailField label="Веб-сайт" value={
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {website}
                </a>
              } />
            </div>
          )}
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Менеджер аккаунта</h3>
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded ml-1">только для чтения</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField label="Имя" value={supplierData.managerName} readOnly />
            <DetailField label="E-mail" value={supplierData.managerEmail} readOnly />
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
