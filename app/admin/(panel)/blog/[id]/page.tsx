import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { PostEditor, type EditablePost } from "@/components/admin/post-editor";
import { getPostById } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Yazı düzenle" };

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireAdminPage();
  const { id } = await params;

  let post: EditablePost;
  if (id === "new") {
    post = { id: null, slug: "", publishedAt: today(), status: "draft", tags: [], titleTr: "", excerptTr: "", bodyTr: "", titleEn: "", excerptEn: "", bodyEn: "" };
  } else {
    const row = Number.isInteger(Number(id)) ? await getPostById(Number(id)) : null;
    if (!row) notFound();
    post = {
      id: row.id,
      slug: row.slug,
      publishedAt: row.publishedAt,
      status: row.status,
      tags: row.tags,
      titleTr: row.titleTr ?? "",
      excerptTr: row.excerptTr ?? "",
      bodyTr: row.bodyTr ?? "",
      titleEn: row.titleEn ?? "",
      excerptEn: row.excerptEn ?? "",
      bodyEn: row.bodyEn ?? "",
    };
  }

  return (
    <>
      <PageHeader
        title={post.id ? post.titleTr || post.titleEn || "Yazı" : "Yeni yazı"}
        actions={
          <Link href="/admin/blog" className="font-mono text-xs text-subtle hover:text-fg">
            ← tüm yazılar
          </Link>
        }
      />
      <PostEditor key={post.id ?? "new"} post={post} />
    </>
  );
}
