import { useState } from "react";
import { CheckCircle2, AlertTriangle, Info, FileText } from "lucide-react";
import { formatBin, validateBin, formatIban } from "@/lib/utils";

export type LegalCountry = "KZ" | "RU" | "UZ";
export type LegalForm = "TOO" | "AO" | "IP" | "OOO" | "AO_RU" | "FL_RU" | "OOO_UZ";

export interface LegalRequisitesData {
  country: LegalCountry;
  form: LegalForm;
  legalName: string;
  // KZ
  bin?: string;
  iin?: string;
  kbe?: string; // КБЕ — код бенефициара
  isVatPayer?: boolean;
  vatCert?: string;
  // RU
  inn?: string;
  kpp?: string;
  ogrn?: string;
  // UZ
  innUz?: string;
  oked?: string;
  // Bank
  bankName?: string;
  iban?: string;
  bik?: string;
  // Addresses
  legalAddress: string;
  actualAddress?: string;
  sameAddress?: boolean;
  // EDO
  edoOperator?: string;
  edoId?: string;
}

interface Props {
  data: LegalRequisitesData;
  editable?: boolean;
}

const formLabels: Record<LegalForm, string> = {
  TOO:    "ТОО (KZ)",
  AO:     "АО (KZ)",
  IP:     "ИП (KZ)",
  OOO:    "ООО (RU)",
  AO_RU:  "АО (RU)",
  FL_RU:  "Самозанятый (RU)",
  OOO_UZ: "MChJ / ООО (UZ)",
};

const countryLabels: Record<LegalCountry, string> = {
  KZ: "🇰🇿 Казахстан",
  RU: "🇷🇺 Россия",
  UZ: "🇺🇿 Узбекистан",
};

export function LegalRequisites({ data }: Props) {
  const [country, setCountry] = useState<LegalCountry>(data.country);

  const binIssue = country === "KZ" ? validateBin(data.bin) : null;

  return (
    <div className="bg-card border border-card-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold inline-flex items-center gap-2">
          <FileText className="w-4 h-4" /> Юридические реквизиты
        </h3>
        <div className="flex items-center gap-1">
          {(["KZ", "RU", "UZ"] as LegalCountry[]).map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              data-testid={`button-country-${c}`}
              className={`px-2 py-1 text-[11px] rounded border ${country === c ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background hover:bg-accent"}`}
            >
              {countryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <Cell label="Юр. форма" value={formLabels[data.form] ?? data.form} />
        <Cell label="Страна юрисдикции" value={countryLabels[country]} />
        <Cell label="Юридическое название" value={data.legalName} mono />
      </div>

      {country === "KZ" && (
        <>
          <SectionTitle>KZ-реквизиты</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Cell
              label={data.form === "IP" ? "ИИН" : "БИН"}
              value={formatBin(data.bin || data.iin)}
              mono
              badge={
                binIssue ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-600">
                    <AlertTriangle className="w-3 h-3" /> {binIssue}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> валиден
                  </span>
                )
              }
            />
            <Cell label="КБЕ" value={data.kbe ?? "—"} mono hint="Код бенефициара (17 для ТОО, 19 для ИП)" />
            <Cell
              label="Плательщик НДС"
              value={data.isVatPayer ? `Да · ${data.vatCert ?? "сертификат не указан"}` : "Нет"}
              badge={
                data.isVatPayer ? (
                  <span className="text-[10px] text-blue-600">12% НДС</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">упрощёнка</span>
                )
              }
            />
            <Cell label="ОКЭД" value="93290 — Прочие виды развлекательной деятельности" hint="Виды экономической деятельности" />
          </div>

          <SectionTitle>Банковские реквизиты</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Cell label="Банк" value={data.bankName ?? "—"} />
            <Cell label="БИК" value={data.bik ?? "—"} mono />
            <Cell label="IBAN (расчётный счёт)" value={formatIban(data.iban)} mono full />
          </div>
        </>
      )}

      {country === "RU" && (
        <>
          <SectionTitle>RU-реквизиты</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Cell label="ИНН" value={data.inn ?? "—"} mono hint="10 цифр для ЮЛ, 12 для ИП/ФЛ" />
            <Cell label="КПП" value={data.kpp ?? "—"} mono hint="Код причины постановки на учёт (только для ЮЛ)" />
            <Cell label="ОГРН / ОГРНИП" value={data.ogrn ?? "—"} mono full />
            <Cell label="Расчётный счёт" value={data.iban ?? "—"} mono />
            <Cell label="БИК" value={data.bik ?? "—"} mono />
          </div>
        </>
      )}

      {country === "UZ" && (
        <>
          <SectionTitle>UZ-реквизиты</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Cell label="ИНН (СТИР)" value={data.innUz ?? "—"} mono hint="9 цифр" />
            <Cell label="ОКЭД" value={data.oked ?? "—"} mono />
            <Cell label="Транзитный счёт" value={data.iban ?? "—"} mono full />
            <Cell label="МФО банка" value={data.bik ?? "—"} mono />
          </div>
        </>
      )}

      <SectionTitle>Адреса</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Cell label="Юридический адрес" value={data.legalAddress} full />
        <Cell label="Фактический адрес" value={data.sameAddress ? "Совпадает с юридическим" : (data.actualAddress ?? "—")} full />
      </div>

      {country === "KZ" && (
        <>
          <SectionTitle>ЭДО</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Cell label="Оператор ЭСФ" value={data.edoOperator ?? "ИС ЭСФ (esf.gov.kz)"} />
            <Cell label="ID контрагента" value={data.edoId ?? "—"} mono />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 inline-flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            Электронные счета-фактуры выставляются автоматически по итогам каждой выплаты.
          </p>
        </>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-5 mb-2">{children}</h4>;
}

function Cell({ label, value, hint, mono, badge, full }: { label: string; value: React.ReactNode; hint?: string; mono?: boolean; badge?: React.ReactNode; full?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 p-2 rounded border border-border bg-background ${full ? "md:col-span-2" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
        {badge}
      </div>
      <span className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
  );
}
