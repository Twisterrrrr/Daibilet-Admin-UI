import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs } from "@/components/shared/Tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe2, Languages, Coins, Phone, Calendar, FileText, Info } from "lucide-react";
import { formatCurrency, formatPhone, formatNumber, formatBin, formatIban } from "@/lib/utils";

export default function SettingsLocale() {
  const [tab, setTab] = useState("general");
  const [primary, setPrimary] = useState("ru");
  const [showSecondary, setShowSecondary] = useState(true);

  return (
    <AdminLayout
      title="Локаль и форматы"
      breadcrumbs={[{ label: "Администратор" }, { label: "Настройки", href: "/admin/settings" }, { label: "Локаль и форматы" }]}
    >
      <PageHeader
        title="Локаль и форматы"
        description="Регион работы платформы, валюты, форматы телефона/даты/чисел и юридический контекст по странам."
      />

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-4 text-sm text-blue-900 dark:text-blue-200">
        <p>
          <strong>Daibilet — российский агрегатор</strong> с расчётами в рублях и юр. лицом в РФ. Дополнительно подключаются рынки СНГ
          (KZ/UZ/KG) — гастроли, трансграничный туризм, локальные поставщики. Здесь настраивается, какие форматы и юр. поля показывать
          оператору и какие проверки запускать на ввод.
        </p>
      </div>

      <Tabs
        items={[
          { key: "general",   label: "Регион и языки" },
          { key: "currency",  label: "Валюты" },
          { key: "phone",     label: "Телефоны" },
          { key: "datetime",  label: "Дата и числа" },
          { key: "legal",     label: "Юр. поля" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card icon={<Globe2 className="w-4 h-4" />} title="Основной регион">
            <Field label="Страна">
              <span className="text-sm">🇷🇺 Россия (RU)</span>
            </Field>
            <Field label="Часовой пояс по умолчанию">
              <span className="text-sm font-mono">Europe/Moscow (UTC+3)</span>
            </Field>
            <Field label="Дополнительные регионы продаж">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { c: "🇰🇿 Казахстан (KZ)",     on: true },
                  { c: "🇺🇿 Узбекистан (UZ)",    on: true },
                  { c: "🇰🇬 Кыргызстан (KG)",    on: true },
                  { c: "🇧🇾 Беларусь (BY)",      on: false },
                  { c: "🇦🇲 Армения (AM)",       on: false },
                ].map((r, i) => (
                  <label key={i} className={`text-xs px-2 py-1 rounded border cursor-pointer ${r.on ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                    <input type="checkbox" defaultChecked={r.on} className="mr-1.5" /> {r.c}
                  </label>
                ))}
              </div>
            </Field>
          </Card>

          <Card icon={<Languages className="w-4 h-4" />} title="Языки интерфейса">
            <p className="text-xs text-muted-foreground mb-2">Основной язык — русский. Для площадок и SEO-полей в KZ/UZ доступны локальные языки.</p>
            <Field label="Основной язык админки">
              <div className="flex gap-2">
                {[
                  { code: "ru", label: "Русский" },
                  { code: "en", label: "English" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setPrimary(l.code)}
                    className={`text-xs px-3 py-1.5 rounded border ${primary === l.code ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Локальные языки контента (для СНГ-рынков)">
              <div className="flex items-center gap-3">
                <Switch defaultChecked={showSecondary} onCheckedChange={setShowSecondary} />
                <span className="text-xs text-muted-foreground">Включить поля Қазақша / O'zbekcha рядом с RU для событий в KZ/UZ</span>
              </div>
            </Field>
            <Field label="Языки витрины (видны покупателю)">
              <div className="flex flex-wrap gap-1.5">
                {["ru", "en", "kk", "uz"].map((l) => (
                  <span key={l} className="text-[11px] px-2 py-1 bg-muted rounded">{l.toUpperCase()}</span>
                ))}
              </div>
            </Field>
          </Card>
        </div>
      )}

      {tab === "currency" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card icon={<Coins className="w-4 h-4" />} title="Валюты расчётов">
            <Field label="Основная валюта">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">₽ RUB</span>
                <span className="text-xs text-muted-foreground">российский рубль</span>
              </div>
            </Field>
            <Field label="Дополнительный показ (для СНГ-аудитории)">
              <div className="space-y-1.5">
                {[
                  { code: "KZT", on: true,  rate: "0.18 ₽"    },
                  { code: "USD", on: true,  rate: "92.40 ₽"    },
                  { code: "EUR", on: false, rate: "100.10 ₽"   },
                  { code: "UZS", on: false, rate: "0.0072 ₽"   },
                  { code: "KGS", on: false, rate: "1.06 ₽"     },
                ].map((c) => (
                  <label key={c.code} className="flex items-center justify-between gap-3 text-xs p-2 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={c.on} />
                      <span className="font-mono">{c.code}</span>
                    </div>
                    <span className="text-muted-foreground tabular-nums">1 {c.code} = {c.rate}</span>
                  </label>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 inline-flex items-center gap-1"><Info className="w-3 h-3" /> Курс обновляется ежедневно от ЦБ РФ.</p>
            </Field>
          </Card>

          <Card icon={<Coins className="w-4 h-4" />} title="Превью форматов">
            <Preview label="Цена билета (RUB)"      value={`${(2500).toLocaleString("ru-RU")} ₽`} />
            <Preview label="Сумма транзакции"        value={`${(184_500).toLocaleString("ru-RU")} ₽`} />
            <Preview label="Бесплатно"                value="0 ₽" />
            <Preview label="С отрицательной (refund)"  value={`${(-3500).toLocaleString("ru-RU")} ₽`} />
            <Preview label="Большое число (визиты)"   value={formatNumber(184_200)} />
            <Preview label="Округление дробных"        value={formatNumber(12345.67)} />
          </Card>
        </div>
      )}

      {tab === "phone" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card icon={<Phone className="w-4 h-4" />} title="Правила телефонных номеров">
            <Field label="Маска ввода">
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">+7 (___) ___-__-__</span>
            </Field>
            <Field label="Региональный префикс по умолчанию">
              <span className="text-xs">+7 (RU — мобильные начинаются с 9)</span>
            </Field>
            <Field label="Допустимые регионы">
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700">+7 9XX RU моб.</span>
                <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700">+7 4XX/8XX RU гор.</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">+7 7XX KZ</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">+998 UZ</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">+996 KG</span>
              </div>
            </Field>
            <Field label="Проверка на дубликаты">
              <div className="flex items-center gap-3">
                <Switch defaultChecked />
                <span className="text-xs text-muted-foreground">Уведомлять, если номер уже привязан к другому покупателю</span>
              </div>
            </Field>
          </Card>

          <Card icon={<Phone className="w-4 h-4" />} title="Превью форматирования">
            <Preview label="RU мобильный"   value={formatPhone("79161234567")} />
            <Preview label="RU городской"    value={formatPhone("74951234567")} />
            <Preview label="KZ мобильный"    value={formatPhone("77011234567")} />
            <Preview label="UZ мобильный"    value={formatPhone("998901234567")} />
            <Preview label="KG мобильный"    value={formatPhone("996700123456")} />
            <Preview label="Не валиден"       value={formatPhone("12345")} mono />
          </Card>
        </div>
      )}

      {tab === "datetime" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card icon={<Calendar className="w-4 h-4" />} title="Форматы">
            <Field label="Дата">           <span className="text-sm font-mono">DD.MM.YYYY</span></Field>
            <Field label="Время">          <span className="text-sm font-mono">HH:mm (24ч)</span></Field>
            <Field label="Разделитель тысяч"><span className="text-sm font-mono">пробел (12 345 ₽)</span></Field>
            <Field label="Десятичный знак">  <span className="text-sm font-mono">запятая (1,5)</span></Field>
            <Field label="Первый день недели"><span className="text-sm">Понедельник</span></Field>
            <Field label="Календарь"><span className="text-sm">Григорианский, гос. праздники РФ подсвечены</span></Field>
          </Card>
          <Card icon={<Calendar className="w-4 h-4" />} title="Превью">
            <Preview label="Дата события"     value={new Date("2026-04-21").toLocaleDateString("ru-RU")} />
            <Preview label="Дата + время"     value={new Date("2026-04-21T20:30:00Z").toLocaleString("ru-RU")} />
            <Preview label="Цена с тысячами" value={`${(125_000).toLocaleString("ru-RU")} ₽`} />
            <Preview label="Большое число"    value={formatNumber(1_842_355)} />
            <Preview label="Дробное"           value={(1.5).toLocaleString("ru-RU")} />
          </Card>
        </div>
      )}

      {tab === "legal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card icon={<FileText className="w-4 h-4" />} title="Юридические поля поставщиков">
            <p className="text-xs text-muted-foreground mb-3">Какие наборы реквизитов доступны при создании поставщика. Видимость зависит от страны юрисдикции.</p>
            {[
              { c: "🇷🇺 RU (по умолчанию)", fields: "ООО / АО / ИП / Самозанятый · ИНН (10/12) · КПП · ОГРН/ОГРНИП · р/с · БИК · ОКВЭД · НДС 20%" },
              { c: "🇰🇿 KZ", fields: "ТОО / АО / ИП · БИН/ИИН (12) · КБЕ · IBAN KZ20 · БИК · ОКЭД · ЭСФ · НДС 12%" },
              { c: "🇺🇿 UZ", fields: "MChJ · ИНН (СТИР, 9) · ОКЭД · транзитный счёт · МФО банка" },
            ].map((r, i) => (
              <div key={i} className="text-xs p-2 rounded border border-border bg-background mb-1.5">
                <div className="font-medium mb-0.5">{r.c}</div>
                <div className="text-muted-foreground">{r.fields}</div>
              </div>
            ))}
          </Card>

          <Card icon={<FileText className="w-4 h-4" />} title="Превью реквизитов">
            <Preview label="ИНН (RU, ЮЛ)"      value="7707083893" mono />
            <Preview label="ИНН (RU, ИП/ФЛ)"   value="772578401234" mono />
            <Preview label="КПП"                 value="770701001" mono />
            <Preview label="ОГРН"                value="1027700132195" mono />
            <Preview label="БИН (KZ)"           value={formatBin("180940004411")}  mono />
            <Preview label="IBAN KZ20"           value={formatIban("KZ206017131000123456")}  mono />
            <Preview label="ИНН (UZ, СТИР)"     value="123456789" mono />
            <Preview label="Сумма + НДС"        value={`${(120_000).toLocaleString("ru-RU")} ₽ (в т.ч. НДС 20% — ${(20_000).toLocaleString("ru-RU")} ₽)`} />
          </Card>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button>Сохранить настройки локали</Button>
      </div>
    </AdminLayout>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-4 inline-flex items-center gap-2">{icon} {title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      {children}
    </div>
  );
}

function Preview({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded border border-border text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono" : "tabular-nums"}>{value}</span>
    </div>
  );
}
