import Navbar from "@/components/navbar";
import JsonLd from "@/components/seo/json-ld";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description: "Development notes, project logs and build updates.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "vezironi Blog",
          url: `${SITE_URL}/blog`,
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        }}
      />
      <Navbar />
      <main className="container mx-auto min-h-screen px-12 py-8">
        <section className="relative w-full overflow-hidden">
          <div className="relative flex items-center justify-between mb-5">
            <h1 className="text-lg uppercase text-neutral-50">
              <span className="tracking-[0.02px] text-blue-500">{"//"}</span> Blog
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              {posts.length} Posts
            </span>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group border border-neutral-400/20 border-dashed p-4 hover:border-neutral-300/70 hover:bg-neutral-400/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-neutral-100 tracking-tight">{post.title}</p>
                    <i className="fa-light fa-arrow-up-right text-[10px] text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </div>

                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{post.excerpt}</p>

                  <div className="mt-3 flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    <span>{post.date}</span>
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 font-mono">No posts yet.</p>
          )}
        </section>
      </main>
    </>
  );
}
