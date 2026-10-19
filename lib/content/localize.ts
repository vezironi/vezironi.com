import type { Locale } from "@/lib/i18n/config";

const SUFFIX: Record<Locale, string> = { tr: "Tr", en: "En" };

/** Reads `${field}Tr` / `${field}En` from a row; empty strings count as missing. */
export function pick(row: object, field: string, locale: Locale): string | null {
  const value = (row as Record<string, unknown>)[`${field}${SUFFIX[locale]}`];
  return typeof value === "string" && value.length > 0 ? value : null;
}
