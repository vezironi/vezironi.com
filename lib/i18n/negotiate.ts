import { defaultLocale, isLocale, locales, type Locale } from "./config";

/** Picks a locale from the cookie (if valid) or the Accept-Language header. */
export function negotiateLocale(acceptLanguage: string | null, cookie?: string): Locale {
  if (isLocale(cookie)) return cookie;
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], quality: Number.isNaN(quality) ? 0 : quality, index };
    })
    .filter((entry) => entry.lang && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { lang } of ranked) {
    if (isLocale(lang)) return lang;
  }
  return defaultLocale;
}

const LEGACY_HOME = new Set(["/about", "/services"]);
const LOCALIZED_PREFIXES = ["/blog", "/games", "/gallery", "/contact"];
const PASSTHROUGH_PREFIXES = ["/admin", "/api"];

function hasPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** A first segment that is not a locale, a legacy path or a reserved prefix (e.g. "/de", "/wp-admin"). */
export function isUnknownTopLevel(pathname: string): boolean {
  if (pathname === "/") return false;
  if (locales.some((l) => hasPrefix(pathname, `/${l}`))) return false;
  if (PASSTHROUGH_PREFIXES.some((p) => hasPrefix(pathname, p))) return false;
  if (LEGACY_HOME.has(pathname) || LOCALIZED_PREFIXES.some((p) => hasPrefix(pathname, p))) return false;
  return true;
}

/** Returns where a locale-less or legacy path should go, or null to leave it alone. */
export function resolveRedirect(pathname: string, locale: Locale): string | null {
  if (locales.some((l) => hasPrefix(pathname, `/${l}`))) return null;
  if (PASSTHROUGH_PREFIXES.some((p) => hasPrefix(pathname, p))) return null;
  if (pathname === "/" || LEGACY_HOME.has(pathname)) return `/${locale}`;
  if (LOCALIZED_PREFIXES.some((p) => hasPrefix(pathname, p))) return `/${locale}${pathname}`;
  return null;
}
