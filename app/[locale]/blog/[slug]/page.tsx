import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { blogPostingJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Section } from "@/components/site/section";
import { getPost, listPostSlugs, postSlugExists } from "@/lib/content/queries";
import { formatDate } from "@/lib/format";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { readingTime, renderMarkdown } from "@/lib/markdown";

// Shiki reads the clock while highlighting, so the render must happen in a cached scope.
async function renderPostHtml(markdown: string) {
  "use cache";
  cacheLife("max");
  return renderMarkdown(markdown);
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  try {
    const slugs = await listPostSlugs();
    return slugs.filter((p) => (p.locales as string[]).includes(params.locale)).map((p) => ({ slug: p.slug }));
  } catch (error) {
    // Local dev without DATABASE_URL: Next may call this from a separate worker that can't
    // open the embedded PGlite (it is locked by the main process). Pages then render on demand.
    if (process.env.NODE_ENV === "development") return [];
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPost(locale, slug);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt || post.title,
    availableLocales: post.availableLocales,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = await getPost(locale, slug);
  if (!post) {
    // Known slug (draft or other language) → 404; unknown (e.g. a v1 post) → blog index.
    if (await postSlugExists(slug)) notFound();
    redirect(`/${locale}/blog`);
  }
  const dict = getDictionary(locale);
  const html = await renderPostHtml(post.body);

  return (
    <main>
      <JsonLd data={blogPostingJsonLd(post, locale, "Vezir Oni")} />
      <article>
        <header className="px-4 pt-10 pb-8 sm:px-6">
          <Link href={`/${locale}/blog`} className="font-mono text-xs text-subtle transition-colors hover:text-accent">
            {dict.blog.backToBlog}
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{post.title}</h1>
          {post.excerpt && <p className="mt-3 text-muted text-pretty">{post.excerpt}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-subtle">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            <span aria-hidden>·</span>
            <span>
              {readingTime(post.body)} {dict.blog.readingTime}
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="rounded border border-line px-1.5 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        </header>
        <Section>
          <div className="prose-blueprint" dangerouslySetInnerHTML={{ __html: html }} />
        </Section>
      </article>
    </main>
  );
}
