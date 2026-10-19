import type { MetadataRoute } from "next";
import { getGallery, listPostSlugs } from "@/lib/content/queries";
import { env } from "@/lib/env";
import { buildSitemap } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (env.noindex) return [];
  const [posts, gallery] = await Promise.all([listPostSlugs(), getGallery("en")]);
  return buildSitemap({ posts, hasGallery: gallery.length > 0 });
}
