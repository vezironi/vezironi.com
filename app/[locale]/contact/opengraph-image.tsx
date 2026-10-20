import { OG_SIZE } from "@/lib/seo/og";
import { pageOgImage } from "@/lib/seo/page-og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Contact — Vezir Oni";

export default pageOgImage({
  eyebrow: { tr: "iletişim", en: "contact" },
  title: (d) => d.meta.contactTitle,
  subtitle: (d) => d.meta.contactDescription,
  path: "/contact",
});
