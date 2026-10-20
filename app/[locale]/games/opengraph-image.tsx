import { OG_SIZE } from "@/lib/seo/og";
import { pageOgImage } from "@/lib/seo/page-og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Game Projects — Vezir Oni";

export default pageOgImage({
  eyebrow: { tr: "oyun projeleri", en: "game projects" },
  title: (d) => d.meta.gamesTitle,
  subtitle: (d) => d.meta.gamesDescription,
  path: "/games",
});
