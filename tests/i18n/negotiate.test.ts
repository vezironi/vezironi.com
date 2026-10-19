import { describe, expect, it } from "vitest";
import { negotiateLocale } from "@/lib/i18n/negotiate";

describe("negotiateLocale", () => {
  it.each([
    ["tr-TR,tr;q=0.9,en;q=0.8", "tr"],
    ["en-US", "en"],
    ["de-DE,de;q=0.9", "en"],
    ["de;q=1, tr;q=0.5", "tr"],
    ["en;q=0.4, tr;q=0.8", "tr"],
    ["*", "en"],
    ["", "en"],
  ])("header %j resolves to %s", (header, expected) => {
    expect(negotiateLocale(header)).toBe(expected);
  });

  it("falls back to en when no header is sent (bots)", () => {
    expect(negotiateLocale(null)).toBe("en");
  });

  it("prefers a valid cookie over the header", () => {
    expect(negotiateLocale("en", "tr")).toBe("tr");
  });

  it("ignores an unknown cookie value", () => {
    expect(negotiateLocale("tr", "xx")).toBe("tr");
  });

  it("ignores a q=0 entry", () => {
    expect(negotiateLocale("tr;q=0, en;q=0.5")).toBe("en");
  });
});
