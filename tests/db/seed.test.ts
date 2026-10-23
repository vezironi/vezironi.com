import { asc, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { createPgliteDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { seed } from "@/lib/db/seed";

const BIO_TR =
  "Full Stack Developer ve bağımsız yazılım girişimcisiyim. Web uygulamaları, backend sistemleri ve FiveM scriptleri geliştiriyor; kendi dijital ürünlerimi ve platformlarımı oluşturarak fikirleri ölçeklenebilir, gerçek dünya çözümlerine dönüştürüyorum.";

describe("seed", () => {
  let db: Db;

  beforeAll(async () => {
    db = await createPgliteDb();
    await seed(db);
    await seed(db); // idempotent
  });

  it("seeds the seven projects in order", async () => {
    const rows = await db.select().from(s.projects).orderBy(asc(s.projects.sortOrder));
    expect(rows.map((r) => r.name)).toEqual([
      "Keyra",
      "Mazlum Admin",
      "Veyra",
      "White Bilişim",
      "0Resmon",
      "Hype Scripts",
      "Vatan Sağ Olsun",
    ]);
  });

  it("creates the 26 game projects from the migration, without the duplicate casino", async () => {
    const rows = await db.select().from(s.gameProjects).orderBy(asc(s.gameProjects.sortOrder));
    expect(rows).toHaveLength(26);
    expect(rows[0]).toMatchObject({ name: "Marriage V2", store: "0Resmon", visible: true });
    expect(rows.at(-1)).toMatchObject({ name: "CarPlay", store: "FastScript" });
    expect(rows.filter((r) => r.name === "Manageable Casino")).toHaveLength(1);
    expect(rows.filter((r) => r.tebexUrl === null).map((r) => r.name)).toEqual([
      "VehicleKeys",
      "Chat v3",
      "GPS V2",
      "Manageable Casino",
      "Multicharacter v2",
      "Dailyrewards",
      "Repair Kit",
    ]);
  });

  it("seeds the npm package separately from projects", async () => {
    const rows = await db.select().from(s.packages);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: "@vezironi/veyra-ui",
      homepageUrl: "https://veyra.vezironi.com/",
      repoUrl: "https://github.com/vezironi/veyra-ui",
    });
  });

  it("seeds the five references", async () => {
    const rows = await db.select().from(s.references).orderBy(asc(s.references.sortOrder));
    expect(rows.map((r) => r.name)).toEqual(["0Resmon", "White Bilişim", "BORP", "FastScript", "Night"]);
  });

  it("seeds experiences newest first with Hype Scripts ongoing", async () => {
    const rows = await db.select().from(s.experiences).orderBy(asc(s.experiences.sortOrder));
    expect(rows).toHaveLength(6);
    expect(rows[0]).toMatchObject({ company: "Hype Scripts", startYear: 2026, endYear: null });
    expect(rows.at(-1)).toMatchObject({ company: "Kobi Bilişim Güvenlik", startYear: 2021, endYear: 2022 });
  });

  it("seeds 9 technologies and 8 tools", async () => {
    const tech = await db.select().from(s.stackItems).where(eq(s.stackItems.category, "tech"));
    const tools = await db.select().from(s.stackItems).where(eq(s.stackItems.category, "tool"));
    expect(tech).toHaveLength(9);
    expect(tools).toHaveLength(8);
  });

  it("seeds six published bilingual launch posts", async () => {
    const rows = await db.select().from(s.posts).where(eq(s.posts.status, "published"));
    expect(rows.map((r) => r.slug).sort()).toEqual([
      "bilingual-seo-nextjs",
      "github-contribution-graph",
      "how-i-built-this-site",
      "isometric-svg-logo",
      "publishing-vue-components-to-npm",
      "spotify-now-playing-card",
    ]);
    for (const r of rows) {
      expect(r.titleTr && r.titleEn && r.bodyTr && r.bodyEn && r.excerptTr && r.excerptEn).toBeTruthy();
    }
  });

  it("keeps the markdown test post as a draft", async () => {
    const [test] = await db.select().from(s.posts).where(eq(s.posts.slug, "markdown-test"));
    expect(test.status).toBe("draft");
  });

  it("leaves the gallery empty", async () => {
    expect(await db.select().from(s.galleryItems)).toHaveLength(0);
  });

  it("stores the bio verbatim", async () => {
    const [settings] = await db.select().from(s.siteSettings);
    expect(settings.bioTr).toBe(BIO_TR);
    expect(settings).toMatchObject({
      name: "Vezir Oni",
      github: "https://github.com/vezironi",
      email: "contact@vezironi.com",
      discordId: "1517800496029630556",
      x: "https://x.com/vezir_oni",
    });
  });
});
