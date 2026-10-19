import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { listPosts } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Blog" };

export default async function BlogAdminPage() {
  await requireAdminPage();
  const posts = await listPosts();
  return (
    <>
      <PageHeader
        title="Blog"
        description="Yazılar Markdown ile yazılır; her dil ayrı sekmede."
        actions={
          <Link href="/admin/blog/new" className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-bg">
            <Plus className="size-4" /> Yeni yazı
          </Link>
        }
      />
      <div className="p-6">
        {posts.length === 0 ? (
          <p className="text-sm text-subtle">Henüz yazı yok.</p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {posts.map((p) => {
              const langs = [p.titleTr && p.bodyTr ? "TR" : null, p.titleEn && p.bodyEn ? "EN" : null].filter(Boolean);
              return (
                <li key={p.id}>
                  <Link href={`/admin/blog/${p.id}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 hover:bg-grid">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.titleTr || p.titleEn || <em className="text-subtle">Başlıksız</em>}</span>
                    <span className="flex gap-1">
                      {langs.map((l) => (
                        <span key={l} className="rounded border border-line px-1 font-mono text-[10px] text-muted">
                          {l}
                        </span>
                      ))}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        p.status === "published" ? "bg-accent/15 text-accent" : "bg-grid text-subtle"
                      }`}
                    >
                      {p.status === "published" ? "yayında" : "taslak"}
                    </span>
                    <time className="font-mono text-[11px] text-subtle">{p.publishedAt}</time>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
