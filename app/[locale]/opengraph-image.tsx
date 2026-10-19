import { getSettings } from "@/lib/content/queries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { OG_SIZE, renderHomeOg } from "@/lib/seo/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Vezir Oni — Full Stack Developer";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const settings = await getSettings(locale);
  return renderHomeOg({ name: settings.name, title: settings.title, site: "vezironi.com", eyebrow: locale === "tr" ? "portfolyo" : "portfolio" });
}
