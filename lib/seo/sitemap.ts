import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { languageAlternates, localeUrl } from "./metadata";

type PostEntry = { slug: string; locales: Locale[]; updatedAt: string };

export function buildSitemap({ posts, hasGallery }: { posts: PostEntry[]; hasGallery: boolean }): MetadataRoute.Sitemap {
  const pages = ["", "/blog", "/games", "/contact", ...(hasGallery ? ["/gallery"] : [])];
  const entries: MetadataRoute.Sitemap = [];

  for (const path of pages) {
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, path),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  for (const post of posts) {
    const path = `/blog/${post.slug}`;
    for (const locale of post.locales) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: post.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languageAlternates(path, post.locales) },
      });
    }
  }
  return entries;
}
