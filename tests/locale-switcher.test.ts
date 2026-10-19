import { describe, expect, it } from "vitest";
import { swapLocale } from "@/components/site/locale-switcher";

describe("swapLocale", () => {
  it.each([
    ["/tr", "en", "/en"],
    ["/tr/blog/markdown-test", "en", "/en/blog/markdown-test"],
    ["/en/contact", "tr", "/tr/contact"],
    ["/", "tr", "/tr"],
  ] as const)("%s -> %s", (path, target, expected) => {
    expect(swapLocale(path, target)).toBe(expected);
  });
});
