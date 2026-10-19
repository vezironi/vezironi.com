import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { TAGS } from "@/lib/content/tags";
import type { Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import type { FormInput, SaveResult } from "./content";

export { slugify } from "./slugify";

const optional = z.string().trim().optional().transform((v) => (v ? v : null));

const schema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Sadece küçük harf, rakam ve tire kullan (örn. yeni-yazi)."),
  publishedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-AA-GG biçiminde olmalı."),
  status: z.enum(["draft", "published"], { error: "Durum seç." }),
  tags: z
    .string()
    .optional()
    .transform((v) => (v ?? "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)),
  titleTr: optional,
  excerptTr: optional,
  bodyTr: optional,
  titleEn: optional,
  excerptEn: optional,
  bodyEn: optional,
});

/** Validates and writes a post. A language counts only when it has both a title and a body. */
export async function savePost(db: Db, input: FormInput): Promise<SaveResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { ok: false, errors };
  }
  const data = parsed.data;
  const errors: Record<string, string> = {};

  for (const lang of ["Tr", "En"] as const) {
    const title = data[`title${lang}`];
    const body = data[`body${lang}`];
    if (title && !body) errors[`body${lang}`] = "Başlık girdiysen içerik de gir (ya da ikisini de boş bırak).";
    if (body && !title) errors[`title${lang}`] = "İçerik girdiysen başlık da gir (ya da ikisini de boş bırak).";
  }
  const complete = (["Tr", "En"] as const).some((lang) => data[`title${lang}`] && data[`body${lang}`]);
  if (data.status === "published" && !complete) errors._ = "Yayınlamak için en az bir dilde başlık ve içerik gerekli.";

  const id = input.id ? Number(input.id) : null;
  const clash = await db
    .select({ id: s.posts.id })
    .from(s.posts)
    .where(id ? and(eq(s.posts.slug, data.slug), ne(s.posts.id, id)) : eq(s.posts.slug, data.slug))
    .limit(1);
  if (clash.length) errors.slug = "Bu adres (slug) başka bir yazıda kullanılıyor.";
  if (Object.keys(errors).length) return { ok: false, errors };

  const values = { ...data, updatedAt: new Date() };
  if (id) {
    const updated = await db.update(s.posts).set(values).where(eq(s.posts.id, id)).returning({ id: s.posts.id });
    if (!updated.length) return { ok: false, errors: { _: "Yazı bulunamadı." } };
    return { ok: true, tag: TAGS.posts, id };
  }
  const [row] = await db.insert(s.posts).values(values).returning({ id: s.posts.id });
  return { ok: true, tag: TAGS.posts, id: row.id };
}

export async function deletePost(db: Db, id: number) {
  await db.delete(s.posts).where(eq(s.posts.id, id));
  return TAGS.posts;
}
