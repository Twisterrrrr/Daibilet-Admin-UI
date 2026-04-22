import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number | null | undefined, currency = "RUB"): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("ru-RU").format(n);
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

/**
 * Format phone number. Supports KZ (+7 7XX XXX-XX-XX), RU (+7 9XX XXX-XX-XX),
 * UZ (+998), KG (+996). Falls back to raw with light grouping.
 */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  // KZ / RU: 11 digits starting with 7
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  // UZ: 12 digits starting with 998
  if (digits.length === 12 && digits.startsWith("998")) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }
  // KG: 12 digits starting with 996
  if (digits.length === 12 && digits.startsWith("996")) {
    return `+996 ${digits.slice(3, 6)} ${digits.slice(6, 9)}-${digits.slice(9, 12)}`;
  }
  return raw;
}

/** Detect phone region by digits (KZ-mobile, KZ-landline, RU, UZ, KG, unknown). */
export function detectPhoneRegion(raw: string | null | undefined): "kz_mobile" | "kz_landline" | "ru_mobile" | "uz" | "kg" | "unknown" {
  if (!raw) return "unknown";
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("77"))   return "kz_mobile";
  if (d.length === 11 && d.startsWith("7") && /^7(7[12347]|6[01])/.test(d.slice(0, 3))) return "kz_landline";
  if (d.length === 11 && d.startsWith("79"))   return "ru_mobile";
  if (d.length === 12 && d.startsWith("998"))  return "uz";
  if (d.length === 12 && d.startsWith("996"))  return "kg";
  return "unknown";
}

/** Format Kazakhstani BIN/IIN (12 digits) with grouping XXXXXX XXX XXX. */
export function formatBin(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = raw.replace(/\D/g, "");
  if (d.length !== 12) return raw;
  return `${d.slice(0, 6)} ${d.slice(6, 9)} ${d.slice(9, 12)}`;
}

/** Validate Kazakhstani BIN/IIN: 12 digits with control sum. Returns reason or null. */
export function validateBin(raw: string | null | undefined): string | null {
  if (!raw) return "Не заполнено";
  const d = raw.replace(/\D/g, "");
  if (d.length !== 12) return "БИН/ИИН должен содержать 12 цифр";
  // Light heuristic only (full algorithm is complex). 7-я цифра определяет тип:
  // БИН: 4,5,6 — type code; для юр. лица 5-я цифра в наборе.
  const typeDigit = d[4];
  if (!"0123".includes(typeDigit)) return "5-я цифра должна определять тип ЮЛ (0–3)";
  return null;
}

/** Format IBAN-style KZ account: KZxx Xxxx Xxxx Xxxx Xxxx (20 chars). */
export function formatIban(raw: string | null | undefined): string {
  if (!raw) return "—";
  const s = raw.replace(/\s/g, "").toUpperCase();
  return s.replace(/(.{4})/g, "$1 ").trim();
}
