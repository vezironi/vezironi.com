import { getPost } from "@/lib/content/queries";
import { formatDate } from "@/lib/format";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { readingTime } from "@/lib/markdown";
import { OG_SIZE, renderPageOg, renderPostOg } from "@/lib/seo/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Blog — Vezir Oni";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const post = await getPost(locale, slug);
  if (!post) {
    return renderPageOg({ eyebrow: "blog", title: dict.meta.blogTitle, subtitle: dict.meta.blogDescription, site: "vezironi.com/blog" });
  }
  return renderPostOg({
    title: post.title,
    excerpt: post.excerpt,
    meta: `${formatDate(post.publishedAt, locale)} · ${readingTime(post.body)} ${dict.blog.readingTime}`,
    tags: post.tags.slice(0, 4),
    site: `vezironi.com/${locale}/blog`,
  });
}
