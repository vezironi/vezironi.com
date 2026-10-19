import { asc, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPgliteDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { seed } from "@/lib/db/seed";

const state = vi.hoisted(() => ({ admin: true, db: null as unknown }));
vi.mock("@/lib/auth/server", async () => {
  const { UnauthorizedError } = await import("@/lib/auth/guard");
  return {
    requireAdmin: vi.fn(async () => {
      if (!state.admin) throw new UnauthorizedError();
      return { id: "1", name: "admin", avatar: null };
    }),
  };
});
vi.mock("@/lib/db/client", async (orig) => ({
  ...(await orig<typeof import("@/lib/db/client")>()),
  getDb: vi.fn(async () => state.db),
}));
const deleteImage = vi.hoisted(() => vi.fn(async () => {}));
vi.mock("@/lib/storage", () => ({ deleteImage }));
const updateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ updateTag, cacheLife: vi.fn(), cacheTag: vi.fn() }));

const { addGalleryItems, deleteGalleryItem, reorderGallery, updateGalleryItem } = await import("@/lib/admin/gallery");
const { addGalleryItemsAction, deleteGalleryItemAction, reorderGalleryAction, updateGalleryItemAction } = await import(
  "@/lib/admin/actions/gallery"
);

const upload = (n: number) => ({ url: `/uploads/gallery/${n}.webp`, width: 1200 + n, height: 800 });

function form(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

async function rows(db: Db) {
  return db.select().from(s.galleryItems).orderBy(asc(s.galleryItems.sortOrder));
}

describe("admin gallery core", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
    deleteImage.mockClear();
  });

  it("appends uploads after the existing items in order", async () => {
    expect(await addGalleryItems(db, [upload(1), upload(2)])).toBe("gallery");
    await addGalleryItems(db, [upload(3)]);
    const all = await rows(db);
    expect(all.map((r) => r.imageUrl)).toEqual(["/uploads/gallery/1.webp", "/uploads/gallery/2.webp", "/uploads/gallery/3.webp"]);
    expect(all[0]).toMatchObject({ width: 1201, height: 800, captionTr: null, captionEn: null, takenAt: null });
  });

  it("rejects uploads that are not stored images or have bad dimensions", async () => {
    await expect(addGalleryItems(db, [{ url: "javascript:alert(1)", width: 10, height: 10 }])).rejects.toThrow();
    await expect(addGalleryItems(db, [{ url: "/uploads/gallery/a.webp", width: 0, height: 10 }])).rejects.toThrow();
    await expect(addGalleryItems(db, [])).rejects.toThrow();
    expect(await rows(db)).toHaveLength(0);
  });

  it("updates captions and date, storing blanks as null", async () => {
    await addGalleryItems(db, [upload(1)]);
    const [item] = await rows(db);
    const result = await updateGalleryItem(db, item.id, { captionTr: "  Deniz  ", captionEn: "", takenAt: "2026-05-01" });
    expect(result).toMatchObject({ ok: true, tag: "gallery", id: item.id });
    const [after] = await db.select().from(s.galleryItems).where(eq(s.galleryItems.id, item.id));
    expect(after).toMatchObject({ captionTr: "Deniz", captionEn: null, takenAt: "2026-05-01", imageUrl: item.imageUrl });

    await updateGalleryItem(db, item.id, { captionTr: "", captionEn: "", takenAt: "" });
    const [cleared] = await db.select().from(s.galleryItems).where(eq(s.galleryItems.id, item.id));
    expect(cleared).toMatchObject({ captionTr: null, takenAt: null });
  });

  it("validates the date and caption length and reports a missing item", async () => {
    await addGalleryItems(db, [upload(1)]);
    const [item] = await rows(db);
    const bad = await updateGalleryItem(db, item.id, { takenAt: "01.05.2026", captionTr: "x".repeat(301) });
    expect(bad.ok).toBe(false);
    if (!bad.ok) {
      expect(bad.errors.takenAt).toBeTruthy();
      expect(bad.errors.captionTr).toBeTruthy();
    }
    const missing = await updateGalleryItem(db, item.id + 999, { captionTr: "a" });
    expect(missing.ok).toBe(false);
  });

  it("deletes the row and its stored image", async () => {
    await addGalleryItems(db, [upload(1), upload(2)]);
    const [first] = await rows(db);
    expect(await deleteGalleryItem(db, first.id)).toBe("gallery");
    expect((await rows(db)).map((r) => r.id)).not.toContain(first.id);
    expect(deleteImage).toHaveBeenCalledWith("/uploads/gallery/1.webp");
  });

  it("reorders by the given ids", async () => {
    await addGalleryItems(db, [upload(1), upload(2), upload(3)]);
    const ids = (await rows(db)).map((r) => r.id);
    await reorderGallery(db, [ids[2], ids[0], ids[1]]);
    expect((await rows(db)).map((r) => r.id)).toEqual([ids[2], ids[0], ids[1]]);
  });
});

describe("admin gallery actions", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
    state.db = db;
    state.admin = true;
    updateTag.mockClear();
  });

  it("invalidates the gallery tag after each write", async () => {
    await addGalleryItemsAction([upload(1), upload(2)]);
    const ids = (await rows(db)).map((r) => r.id);
    const result = await updateGalleryItemAction(ids[0], null, form({ captionTr: "Merhaba", captionEn: "", takenAt: "" }));
    expect(result.ok).toBe(true);
    await reorderGalleryAction([...ids].reverse());
    await deleteGalleryItemAction(ids[1]);
    expect(updateTag).toHaveBeenCalledTimes(4);
    expect(updateTag).toHaveBeenCalledWith("gallery");
  });

  it("does not invalidate on validation errors", async () => {
    await addGalleryItemsAction([upload(1)]);
    updateTag.mockClear();
    const [item] = await rows(db);
    const result = await updateGalleryItemAction(item.id, null, form({ takenAt: "dün" }));
    expect(result.ok).toBe(false);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("rejects a non-admin before touching the database", async () => {
    await addGalleryItemsAction([upload(1)]);
    const before = await rows(db);
    updateTag.mockClear();
    state.admin = false;
    await expect(addGalleryItemsAction([upload(2)])).rejects.toThrow("Unauthorized");
    await expect(updateGalleryItemAction(before[0].id, null, form({ captionTr: "x" }))).rejects.toThrow("Unauthorized");
    await expect(reorderGalleryAction([before[0].id])).rejects.toThrow("Unauthorized");
    await expect(deleteGalleryItemAction(before[0].id)).rejects.toThrow("Unauthorized");
    expect(await rows(db)).toEqual(before);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("rejects a malformed reorder payload", async () => {
    await expect(reorderGalleryAction(["1" as never])).rejects.toThrow();
  });
});
