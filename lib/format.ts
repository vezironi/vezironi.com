import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function formatRange(start: number, end: number | null, locale: Locale): string {
  if (end === null) return `${start} — ${getDictionary(locale).time.present}`;
  if (end === start) return String(start);
  return `${start} — ${end}`;
}

const INTL_LOCALE: Record<Locale, string> = { tr: "tr-TR", en: "en-US" };

/** Formats a `YYYY-MM-DD` date without timezone drift. */
export function formatDate(isoDate: string, locale: Locale): string {
  const [y, m, d] = isoDate.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
