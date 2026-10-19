import { afterEach, describe, expect, it, vi } from "vitest";

async function load() {
  vi.resetModules();
  return {
    ...(await import("@/lib/seo/metadata")),
    ...(await import("@/lib/seo/sitemap")),
    ...(await import("@/lib/seo/robots")),
  };
}

afterEach(() => vi.unstubAllEnvs());

describe("buildMetadata", () => {
  it("sets canonical and hreflang alternates for both locales", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const { buildMetadata } = await load();
    const meta = buildMetadata({ locale: "tr", path: "/blog", title: "Blog", description: "d" });
    expect(meta.alternates?.canonical).toBe("https://vezironi.com/tr/blog");
    expect(meta.alternates?.languages).toEqual({
      tr: "https://vezironi.com/tr/blog",
      en: "https://vezironi.com/en/blog",
      "x-default": "https://vezironi.com/en/blog",
    });
  });

  it("maps the home path to the bare locale URL", async () => {
    const { buildMetadata } = await load();
    expect(buildMetadata({ locale: "en", path: "", title: "t", description: "d" }).alternates?.canonical).toBe(
      "https://vezironi.com/en",
    );
  });

  it("omits missing locales and points x-default at the only one", async () => {
    const { buildMetadata } = await load();
    const meta = buildMetadata({ locale: "tr", path: "/blog/x", title: "t", description: "d", availableLocales: ["tr"] });
    expect(meta.alternates?.languages).toEqual({
      tr: "https://vezironi.com/tr/blog/x",
      "x-default": "https://vezironi.com/tr/blog/x",
    });
  });

  it("is noindex on staging", async () => {
    vi.stubEnv("SITE_NOINDEX", "true");
    const { buildMetadata } = await load();
    expect(buildMetadata({ locale: "tr", path: "", title: "t", description: "d" }).robots).toMatchObject({ index: false });
  });

  it("can be noindex per page", async () => {
    const { buildMetadata } = await load();
    expect(buildMetadata({ locale: "tr", path: "/gallery", title: "t", description: "d", noindex: true }).robots).toMatchObject({
      index: false,
    });
    expect(buildMetadata({ locale: "tr", path: "", title: "t", description: "d" }).robots).toMatchObject({ index: true });
  });

  it("uses the staging URL when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://v2.vezironi.com");
    const { buildMetadata } = await load();
    expect(buildMetadata({ locale: "en", path: "", title: "t", description: "d" }).alternates?.canonical).toBe(
      "https://v2.vezironi.com/en",
    );
  });
});

describe("buildSitemap", () => {
  const posts = [
    { slug: "both", locales: ["tr", "en"] as ("tr" | "en")[], updatedAt: "2026-10-19T00:00:00.000Z" },
    { slug: "sadece-tr", locales: ["tr"] as ("tr" | "en")[], updatedAt: "2026-10-20T00:00:00.000Z" },
  ];

  it("lists each page in both locales with alternates", async () => {
    const { buildSitemap } = await load();
    const urls = buildSitemap({ posts, hasGallery: true }).map((e) => e.url);
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://vezironi.com/tr",
        "https://vezironi.com/en",
        "https://vezironi.com/tr/blog",
        "https://vezironi.com/en/contact",
        "https://vezironi.com/tr/gallery",
        "https://vezironi.com/tr/blog/both",
        "https://vezironi.com/en/blog/both",
        "https://vezironi.com/tr/blog/sadece-tr",
      ]),
    );
    expect(urls).not.toContain("https://vezironi.com/en/blog/sadece-tr");
    const home = buildSitemap({ posts, hasGallery: true }).find((e) => e.url === "https://vezironi.com/tr");
    expect(home?.alternates?.languages).toMatchObject({ en: "https://vezironi.com/en" });
  });

  it("leaves out the gallery while it is empty", async () => {
    const { buildSitemap } = await load();
    const urls = buildSitemap({ posts, hasGallery: false }).map((e) => e.url);
    expect(urls.some((u) => u.includes("/gallery"))).toBe(false);
  });
});

describe("buildRobots", () => {
  it("blocks admin and api in production", async () => {
    const { buildRobots } = await load();
    const robots = buildRobots();
    expect(robots.rules).toMatchObject({ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] });
    expect(robots.sitemap).toBe("https://vezironi.com/sitemap.xml");
  });

  it("blocks everything on staging", async () => {
    vi.stubEnv("SITE_NOINDEX", "true");
    const { buildRobots } = await load();
    expect(buildRobots().rules).toMatchObject({ userAgent: "*", disallow: "/" });
  });
});
