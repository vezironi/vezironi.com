import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { PostList } from "@/components/home/latest-posts";
import { Section } from "@/components/site/section";
import { getPosts } from "@/lib/content/queries";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/blog", title: dict.meta.blogTitle, description: dict.meta.blogDescription });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const posts = await getPosts(locale);

  return (
    <main>
      <div className="px-4 pt-10 pb-6 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{dict.meta.blogTitle}</h1>
        <p className="mt-2 text-sm text-muted">{dict.meta.blogDescription}</p>
      </div>
      <Section title={dict.sections.blog} meta={String(posts.length).padStart(2, "0")}>
        <PostList posts={posts} locale={locale} empty={dict.blog.empty} />
      </Section>
    </main>
  );
}
