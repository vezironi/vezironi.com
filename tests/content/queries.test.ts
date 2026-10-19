import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { createPgliteDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { seed } from "@/lib/db/seed";
import { pick } from "@/lib/content/localize";
import {
  getExperiencesUncached,
  getGalleryUncached,
  getPackagesUncached,
  getPostUncached,
  getPostsUncached,
  getProjectsUncached,
  getSettingsUncached,
  getStackUncached,
  listPostSlugsUncached,
} from "@/lib/content/queries";

describe("pick", () => {
  it("reads the locale-suffixed field", () => {
    const row = { titleTr: "Merhaba", titleEn: "Hello" };
    expect(pick(row, "title", "tr")).toBe("Merhaba");
    expect(pick(row, "title", "en")).toBe("Hello");
  });

  it("returns null for empty strings", () => {
    expect(pick({ titleTr: "", titleEn: "x" }, "title", "tr")).toBeNull();
  });
});

describe("content queries", () => {
  let db: Db;

  beforeAll(async () => {
    db = await createPgliteDb();
    await seed(db);
    await db.insert(s.posts).values([
      {
        slug: "sadece-tr",
        titleTr: "Sadece Türkçe",
        excerptTr: "özet",
        bodyTr: "gövde",
        publishedAt: "2026-10-20",
        status: "published",
      },
      {
        slug: "taslak",
        titleTr: "Taslak",
        titleEn: "Draft",
        bodyTr: "a",
        bodyEn: "b",
        publishedAt: "2026-10-21",
        status: "draft",
      },
      {
        slug: "hidden-project-check",
        titleEn: "Old",
        bodyEn: "x",
        publishedAt: "2020-01-01",
        status: "published",
      },
    ]);
    await db.update(s.projects).set({ visible: false }).where(eq(s.projects.name, "Veyra"));
  });

  it("excludes TR-only posts from the EN list", async () => {
    const slugs = (await getPostsUncached(db, "en")).map((p) => p.slug);
    expect(slugs).not.toContain("sadece-tr");
    expect(slugs).toContain("how-i-built-this-site");
  });

  it("includes TR-only posts in the TR list, newest first", async () => {
    const slugs = (await getPostsUncached(db, "tr")).map((p) => p.slug);
    expect(slugs[0]).toBe("sadece-tr");
  });

  it("limits the list", async () => {
    expect(await getPostsUncached(db, "en", { limit: 1 })).toHaveLength(1);
  });

  it("never returns drafts", async () => {
    expect((await getPostsUncached(db, "tr")).map((p) => p.slug)).not.toContain("taslak");
    expect(await getPostUncached(db, "tr", "taslak")).toBeNull();
  });

  it("returns null for a post missing the requested locale", async () => {
    expect(await getPostUncached(db, "en", "sadece-tr")).toBeNull();
  });

  it("reports which locales a post has", async () => {
    expect((await getPostUncached(db, "tr", "sadece-tr"))?.availableLocales).toEqual(["tr"]);
    expect((await getPostUncached(db, "en", "how-i-built-this-site"))?.availableLocales).toEqual(["tr", "en"]);
  });

  it("lists slugs with their locales for the sitemap", async () => {
    const list = await listPostSlugsUncached(db);
    expect(list.find((p) => p.slug === "sadece-tr")?.locales).toEqual(["tr"]);
    expect(list.find((p) => p.slug === "taslak")).toBeUndefined();
  });

  it("localizes and filters projects", async () => {
    const projects = await getProjectsUncached(db, "en");
    expect(projects.map((p) => p.name)).not.toContain("Veyra");
    expect(projects[0]).toMatchObject({ name: "Keyra", year: 2026 });
    expect(projects[0].description).toMatch(/password vault/);
  });

  it("returns experiences with a null end for ongoing roles", async () => {
    const [first] = await getExperiencesUncached(db, "tr");
    expect(first).toMatchObject({ company: "Hype Scripts", role: "Kurucu", start: 2026, end: null });
  });

  it("splits the stack", async () => {
    const stack = await getStackUncached(db);
    expect(stack.tech).toHaveLength(9);
    expect(stack.tools).toHaveLength(8);
  });

  it("localizes settings", async () => {
    const settings = await getSettingsUncached(db, "en");
    expect(settings.name).toBe("Vezir Oni");
    expect(settings.bio).toMatch(/^I'm a full stack developer/);
    expect(settings.links.github).toBe("https://github.com/vezironi");
  });

  it("localizes packages", async () => {
    const [pkg] = await getPackagesUncached(db, "tr");
    expect(pkg).toMatchObject({ name: "@vezironi/veyra-ui", homepageUrl: "https://veyra.vezironi.com/" });
    expect(pkg.description).toMatch(/^Vue 3 için/);
  });

  it("returns an empty gallery", async () => {
    expect(await getGalleryUncached(db, "tr")).toEqual([]);
  });
});
