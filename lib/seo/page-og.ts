import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary";
import { renderPageOg } from "./og";

type PageOg = {
  eyebrow: Record<Locale, string>;
  title: (d: Dictionary) => string;
  subtitle: (d: Dictionary) => string;
  path: string;
  /** Page-specific lines shown in the side panel. */
  aside?: (locale: Locale) => Promise<string[]>;
};

/** Shared opengraph-image handler for simple pages. */
export function pageOgImage(page: PageOg) {
  return async function Image({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: raw } = await params;
    const locale = isLocale(raw) ? raw : defaultLocale;
    const dict = getDictionary(locale);
    return renderPageOg({
      eyebrow: page.eyebrow[locale],
      title: page.title(dict),
      subtitle: page.subtitle(dict),
      site: `vezironi.com/${locale}${page.path}`,
      aside: page.aside ? await page.aside(locale) : [],
    });
  };
}
