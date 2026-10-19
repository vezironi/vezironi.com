import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { deletePost, savePost, slugify } from "@/lib/admin/posts";
import { createPgliteDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { seed } from "@/lib/db/seed";

const base = {
  slug: "yeni-yazi",
  publishedAt: "2026-10-19",
  status: "published",
  tags: "nextjs, test",
  titleTr: "Yeni yazı",
  excerptTr: "Özet",
  bodyTr: "## Merhaba",
  titleEn: "",
  excerptEn: "",
  bodyEn: "",
};

describe("slugify", () => {
  it("transliterates Turkish characters", () => {
    expect(slugify("Merhaba Dünya: Şimdi Çalışıyor, Ğüzel İş!")).toBe("merhaba-dunya-simdi-calisiyor-guzel-is");
  });

  it("collapses separators and trims dashes", () => {
    expect(slugify("  --Next.js 16   &  SEO--  ")).toBe("next-js-16-seo");
  });
});

describe("savePost", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
  });

  it("creates a TR-only published post", async () => {
    const result = await savePost(db, base);
    expect(result.ok).toBe(true);
    const [row] = await db.select().from(s.posts).where(eq(s.posts.slug, "yeni-yazi"));
    expect(row).toMatchObject({ titleTr: "Yeni yazı", titleEn: null, bodyEn: null, tags: ["nextjs", "test"], status: "published" });
  });

  it("rejects an invalid slug", async () => {
    const result = await savePost(db, { ...base, slug: "Merhaba Dünya" });
    expect(result.ok === false && result.errors.slug).toBeTruthy();
  });

  it("rejects a duplicate slug", async () => {
    const result = await savePost(db, { ...base, slug: "how-i-built-this-site" });
    expect(result.ok === false && result.errors.slug).toBeTruthy();
  });

  it("allows keeping the same slug when updating", async () => {
    const [post] = await db.select().from(s.posts).where(eq(s.posts.slug, "how-i-built-this-site"));
    const result = await savePost(db, { ...base, id: String(post.id), slug: "how-i-built-this-site" });
    expect(result.ok).toBe(true);
  });

  it("refuses to publish a post with no complete language", async () => {
    const result = await savePost(db, { ...base, titleTr: "", excerptTr: "", bodyTr: "" });
    expect(result.ok === false && result.errors._).toBeTruthy();
  });

  it("allows an empty draft", async () => {
    const result = await savePost(db, { ...base, status: "draft", titleTr: "", excerptTr: "", bodyTr: "" });
    expect(result.ok).toBe(true);
  });

  it("requires title and body together in a language", async () => {
    const result = await savePost(db, { ...base, titleEn: "Only a title" });
    expect(result.ok === false && result.errors.bodyEn).toBeTruthy();
  });

  it("requires a valid date", async () => {
    const result = await savePost(db, { ...base, publishedAt: "19.10.2026" });
    expect(result.ok === false && result.errors.publishedAt).toBeTruthy();
  });

  it("bumps updatedAt on edit", async () => {
    const [post] = await db.select().from(s.posts).where(eq(s.posts.slug, "how-i-built-this-site"));
    await new Promise((r) => setTimeout(r, 20));
    await savePost(db, {
      ...base,
      id: String(post.id),
      slug: post.slug,
      titleEn: post.titleEn ?? "",
      excerptEn: post.excerptEn ?? "",
      bodyEn: post.bodyEn ?? "",
    });
    const [after] = await db.select().from(s.posts).where(eq(s.posts.id, post.id));
    expect(after.updatedAt.getTime()).toBeGreaterThan(post.updatedAt.getTime());
  });

  it("deletes a post", async () => {
    const [post] = await db.select().from(s.posts).where(eq(s.posts.slug, "markdown-test"));
    await deletePost(db, post.id);
    expect(await db.select().from(s.posts).where(eq(s.posts.id, post.id))).toHaveLength(0);
  });
});
