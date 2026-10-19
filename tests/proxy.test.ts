import { describe, expect, it } from "vitest";
import { isUnknownTopLevel, resolveRedirect } from "@/lib/i18n/negotiate";

describe("isUnknownTopLevel", () => {
  it.each(["/de", "/xyz/abc", "/wp-admin", "/fr/blog"])("%s is an unknown top-level path", (path) => {
    expect(isUnknownTopLevel(path)).toBe(true);
  });

  it.each(["/", "/tr", "/en/blog/x", "/about", "/services", "/blog", "/blog/x", "/gallery", "/contact", "/admin", "/admin/blog", "/api/spotify"])(
    "%s is handled elsewhere",
    (path) => {
      expect(isUnknownTopLevel(path)).toBe(false);
    },
  );
});

describe("resolveRedirect", () => {
  it.each([
    ["/", "tr", "/tr"],
    ["/about", "tr", "/tr"],
    ["/services", "en", "/en"],
    ["/blog", "en", "/en/blog"],
    ["/blog/foo", "en", "/en/blog/foo"],
    ["/gallery", "tr", "/tr/gallery"],
    ["/contact", "tr", "/tr/contact"],
  ] as const)("%s (%s) -> %s", (path, locale, target) => {
    expect(resolveRedirect(path, locale)).toBe(target);
  });

  it.each(["/en", "/en/blog", "/tr/blog/x", "/admin", "/admin/blog", "/api/spotify"])(
    "%s is left alone",
    (path) => {
      expect(resolveRedirect(path, "tr")).toBeNull();
    },
  );
});
