import { eq, max } from "drizzle-orm";
import { z } from "zod";
import { TAGS, type ContentTag } from "@/lib/content/tags";
import type { Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { deleteImage } from "@/lib/storage";
import type { FormInput, SaveResult } from "./content";

// Gallery writes. Server actions in ./actions/gallery.ts wrap these with requireAdmin()
// and cache invalidation.

export type GalleryUpload = { url: string; width: number; height: number };

const STORED_IMAGE = /^\/uploads\/[\w./-]+$|^https:\/\/\S+$/;
const dimension = z.number().int().positive().max(20_000);
const uploadsSchema = z
  .array(z.object({ url: z.string().regex(STORED_IMAGE), width: dimension, height: dimension }))
  .min(1)
  .max(100);

const caption = z
  .string()
  .trim()
  .max(300, "En fazla 300 karakter.")
  .optional()
  .transform((v) => (v ? v : null));

const updateSchema = z.object({
  captionTr: caption,
  captionEn: caption,
  takenAt: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))), "Tarih YYYY-AA-GG biçiminde olmalı."),
});

/** Appends freshly uploaded images to the end of the gallery. */
export async function addGalleryItems(db: Db, uploads: GalleryUpload[]): Promise<ContentTag> {
  const items = uploadsSchema.parse(uploads);
  const [{ top }] = await db.select({ top: max(s.galleryItems.sortOrder) }).from(s.galleryItems);
  const start = (Number(top) || 0) + 1;
  await db
    .insert(s.galleryItems)
    .values(items.map((u, i) => ({ imageUrl: u.url, width: u.width, height: u.height, sortOrder: start + i })));
  return TAGS.gallery;
}

export async function updateGalleryItem(db: Db, id: number, input: FormInput): Promise<SaveResult> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "_")] ??= issue.message;
    return { ok: false, errors };
  }
  const updated = await db.update(s.galleryItems).set(parsed.data).where(eq(s.galleryItems.id, id)).returning({ id: s.galleryItems.id });
  if (updated.length === 0) return { ok: false, errors: { _: "Kayıt bulunamadı." } };
  return { ok: true, tag: TAGS.gallery, id };
}

export async function deleteGalleryItem(db: Db, id: number): Promise<ContentTag> {
  const [row] = await db.delete(s.galleryItems).where(eq(s.galleryItems.id, id)).returning();
  if (row) await deleteImage(row.imageUrl);
  return TAGS.gallery;
}

export async function reorderGallery(db: Db, ids: number[]): Promise<ContentTag> {
  // Sequential updates: the Neon HTTP driver has no interactive transactions.
  for (const [index, id] of ids.entries()) {
    await db.update(s.galleryItems).set({ sortOrder: index }).where(eq(s.galleryItems.id, id));
  }
  return TAGS.gallery;
}
