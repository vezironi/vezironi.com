import Navbar from "@/components/navbar";
import JsonLd from "@/components/seo/json-ld";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | vezironi",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          url: `${SITE_URL}/blog/${post.slug}`,
          author: {
            "@type": "Person",
            name: "vezironi",
          },
          publisher: {
            "@type": "Person",
            name: "vezironi",
          },
        }}
      />
      <Navbar />
      <main className="container mx-auto min-h-screen px-12 py-8">
        <article className="border border-neutral-400/20 border-dashed p-5 md:p-7">
          <header className="mb-6">
            <h1 className="text-lg md:text-xl text-neutral-50 tracking-tight">{post.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              <span>{post.date}</span>
              {post.tags?.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </header>

          <div
            className="blog-content text-sm text-neutral-300 leading-7 [&_h1]:text-lg [&_h1]:text-neutral-100 [&_h1]:mt-7 [&_h1]:mb-3 [&_h2]:text-base [&_h2]:text-neutral-100 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:text-neutral-100 [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-300 [&_hr]:my-6 [&_hr]:border-neutral-400/20 [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500/60 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-400 [&_img]:w-full [&_img]:h-auto [&_img]:rounded-none [&_img]:border [&_img]:border-neutral-400/20 [&_img]:border-dashed [&_img]:my-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-neutral-400/25 [&_pre]:border-dashed [&_pre]:bg-neutral-900/60 [&_pre]:p-3 [&_pre]:text-xs [&_pre_code]:font-mono [&_pre_code]:text-[12px] [&_p_code]:font-mono [&_p_code]:text-[12px] [&_p_code]:text-neutral-100 [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:border [&_p_code]:border-neutral-400/25 [&_p_code]:border-dashed [&_p_code]:bg-neutral-900/60 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-neutral-400/25 [&_th]:border-dashed [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-mono [&_th]:uppercase [&_th]:tracking-wider [&_td]:border [&_td]:border-neutral-400/20 [&_td]:border-dashed [&_td]:px-2 [&_td]:py-1.5"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </main>
    </>
  );
}
