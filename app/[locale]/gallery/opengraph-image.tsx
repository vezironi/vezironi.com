import { getGallery } from "@/lib/content/queries";
import { OG_SIZE } from "@/lib/seo/og";
import { pageOgImage } from "@/lib/seo/page-og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Gallery — Vezir Oni";

export default pageOgImage({
  eyebrow: { tr: "galeri", en: "gallery" },
  title: (d) => d.meta.galleryTitle,
  subtitle: (d) => d.meta.galleryDescription,
  path: "/gallery",
  aside: async (locale) => {
    const count = (await getGallery(locale)).length;
    return [locale === "tr" ? `${count} fotoğraf` : `${count} photos`];
  },
});
