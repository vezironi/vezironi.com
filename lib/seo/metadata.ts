import type { Metadata } from "next";
import { env } from "@/lib/env";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

export const OG_LOCALE: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };

export function localeUrl(locale: Locale, path: string): string {
  return `${env.siteUrl}/${locale}${path}`;
}

/** Alternates for every locale the page exists in; x-default prefers English. */
export function languageAlternates(path: string, available: readonly Locale[] = locales): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of available) languages[l] = localeUrl(l, path);
  const fallback = available.includes(defaultLocale) ? defaultLocale : available[0];
  languages["x-default"] = localeUrl(fallback, path);
  return languages;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  availableLocales = locales,
  noindex = false,
  type = "website",
  publishedTime,
}: {
  locale: Locale;
  /** Path after the locale, "" for home, e.g. "/blog". */
  path: string;
  title: string;
  description: string;
  availableLocales?: readonly Locale[];
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const url = localeUrl(locale, path);
  const index = !(env.noindex || noindex);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path, availableLocales) },
    robots: { index, follow: index },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: "Vezir Oni",
      locale: OG_LOCALE[locale],
      alternateLocale: availableLocales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, creator: "@vezir_oni" },
  };
}
