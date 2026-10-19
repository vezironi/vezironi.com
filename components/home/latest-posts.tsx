import Link from "next/link";
import type { PostSummary } from "@/lib/content/queries";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

export function PostList({ posts, locale, empty }: { posts: PostSummary[]; locale: Locale; empty: string }) {
  if (posts.length === 0) return <p className="text-sm text-subtle">{empty}</p>;
  return (
    <ul className="divide-y divide-line">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/${locale}/blog/${post.slug}`} className="group flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="text-sm transition-colors group-hover:text-accent">{post.title}</span>
            <time dateTime={post.publishedAt} className="shrink-0 font-mono text-[11px] text-subtle">
              {formatDate(post.publishedAt, locale)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
