import { OG_SIZE } from "@/lib/seo/og";
import { pageOgImage } from "@/lib/seo/page-og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Blog — Vezir Oni";

export default pageOgImage({
  eyebrow: { tr: "blog", en: "blog" },
  title: (d) => d.meta.blogTitle,
  subtitle: (d) => d.meta.blogDescription,
  path: "/blog",
});
