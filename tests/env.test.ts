import { afterEach, describe, expect, it, vi } from "vitest";

async function loadEnv() {
  vi.resetModules();
  return (await import("@/lib/env")).env;
}

describe("env", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults siteUrl to the production domain", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect((await loadEnv()).siteUrl).toBe("https://vezironi.com");
  });

  it("strips a trailing slash from siteUrl", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://v2.vezironi.com/");
    expect((await loadEnv()).siteUrl).toBe("https://v2.vezironi.com");
  });

  it("reads SITE_NOINDEX as a boolean", async () => {
    vi.stubEnv("SITE_NOINDEX", "true");
    expect((await loadEnv()).noindex).toBe(true);
    vi.stubEnv("SITE_NOINDEX", "");
    expect((await loadEnv()).noindex).toBe(false);
  });

  it("defaults the admin Discord ID", async () => {
    vi.stubEnv("ADMIN_DISCORD_ID", "");
    expect((await loadEnv()).adminDiscordId).toBe("1517800496029630556");
  });
});
