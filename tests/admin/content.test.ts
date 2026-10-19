import { asc, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { deleteEntity, reorderEntity, saveEntity, saveSettings } from "@/lib/admin/content";
import { createPgliteDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { seed } from "@/lib/db/seed";

const project = {
  name: "Yeni Proje",
  url: "https://example.com",
  logoUrl: "/uploads/logos/a.webp",
  screenshotUrl: "/uploads/projects/a.webp",
  bannerUrl: "",
  descriptionTr: "Açıklama",
  descriptionEn: "Description",
  tech: "Next.js, TypeScript ,  ",
  year: "2026",
  visible: "on",
};

describe("admin content core", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
  });

  it("validates required fields", async () => {
    const result = await saveEntity(db, "projects", { ...project, url: "not a url", name: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.url).toBeTruthy();
      expect(result.errors.name).toBeTruthy();
    }
  });

  it("creates a project at the end and parses tech and checkbox values", async () => {
    const result = await saveEntity(db, "projects", project);
    expect(result).toMatchObject({ ok: true, tag: "projects" });
    const rows = await db.select().from(s.projects).orderBy(asc(s.projects.sortOrder));
    expect(rows.at(-1)).toMatchObject({ name: "Yeni Proje", tech: ["Next.js", "TypeScript"], year: 2026, visible: true, bannerUrl: null });
  });

  it("updates an existing project and treats a missing checkbox as false", async () => {
    const [keyra] = await db.select().from(s.projects).where(eq(s.projects.name, "Keyra"));
    const withoutVisible: Record<string, string> = { ...project };
    delete withoutVisible.visible;
    await saveEntity(db, "projects", { ...withoutVisible, id: String(keyra.id), name: "Keyra" });
    const [after] = await db.select().from(s.projects).where(eq(s.projects.id, keyra.id));
    expect(after).toMatchObject({ descriptionTr: "Açıklama", visible: false, sortOrder: keyra.sortOrder });
  });

  it("accepts seed paths and absolute URLs for images but not other strings", async () => {
    expect((await saveEntity(db, "projects", { ...project, logoUrl: "/seed/logos/keyra.webp" })).ok).toBe(true);
    expect((await saveEntity(db, "projects", { ...project, name: "B", logoUrl: "https://x.public.blob.vercel-storage.com/a.webp" })).ok).toBe(true);
    expect((await saveEntity(db, "projects", { ...project, name: "C", logoUrl: "javascript:alert(1)" })).ok).toBe(false);
  });

  it("stores an ongoing experience with a null end year", async () => {
    const result = await saveEntity(db, "experiences", {
      company: "Yeni Şirket",
      roleTr: "Geliştirici",
      roleEn: "Developer",
      descriptionTr: "",
      descriptionEn: "",
      startYear: "2025",
      current: "on",
      endYear: "2020",
    });
    expect(result.ok).toBe(true);
    const [row] = await db.select().from(s.experiences).where(eq(s.experiences.company, "Yeni Şirket"));
    expect(row.endYear).toBeNull();
  });

  it("rejects an end year before the start year", async () => {
    const result = await saveEntity(db, "experiences", {
      company: "X",
      roleTr: "a",
      roleEn: "a",
      startYear: "2025",
      endYear: "2020",
    });
    expect(result.ok === false && result.errors.endYear).toBeTruthy();
  });

  it("validates npm package names", async () => {
    const bad = await saveEntity(db, "packages", { name: "Not A Package", descriptionTr: "a", descriptionEn: "a" });
    expect(bad.ok === false && bad.errors.name).toBeTruthy();
    expect((await saveEntity(db, "packages", { name: "@vezironi/new-pkg", descriptionTr: "a", descriptionEn: "a" })).ok).toBe(true);
  });

  it("reorders rows to the given id order", async () => {
    const rows = await db.select().from(s.references).orderBy(asc(s.references.sortOrder));
    const reversed = rows.map((r) => r.id).reverse();
    await reorderEntity(db, "references", reversed);
    const after = await db.select().from(s.references).orderBy(asc(s.references.sortOrder));
    expect(after.map((r) => r.id)).toEqual(reversed);
  });

  it("deletes a row", async () => {
    const [night] = await db.select().from(s.references).where(eq(s.references.name, "Night"));
    await deleteEntity(db, "references", night.id);
    expect(await db.select().from(s.references).where(eq(s.references.id, night.id))).toHaveLength(0);
  });

  it("updates site settings", async () => {
    const result = await saveSettings(db, {
      name: "Vezir Oni",
      titleTr: "Yazılımcı",
      titleEn: "Developer",
      bioTr: "Merhaba",
      bioEn: "Hello",
      github: "https://github.com/vezironi",
      email: "contact@vezironi.com",
      discordUsername: "vezironi.",
      discordId: "1517800496029630556",
      x: "https://x.com/vezir_oni",
    });
    expect(result).toMatchObject({ ok: true, tag: "settings" });
    const [row] = await db.select().from(s.siteSettings);
    expect(row).toMatchObject({ titleTr: "Yazılımcı", bioEn: "Hello" });
  });

  it("rejects an invalid settings email", async () => {
    const result = await saveSettings(db, { name: "a", titleTr: "a", titleEn: "a", bioTr: "a", bioEn: "a", github: "https://g.com", email: "x", discordUsername: "a", discordId: "1", x: "https://x.com" });
    expect(result.ok === false && result.errors.email).toBeTruthy();
  });
});
