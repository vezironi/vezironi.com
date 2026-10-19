import { describe, expect, it } from "vitest";
import { isActivePath } from "@/components/site/nav-links";

describe("isActivePath", () => {
  it("matches the page and its children", () => {
    expect(isActivePath("/tr/blog", "/tr/blog")).toBe(true);
    expect(isActivePath("/tr/blog/markdown-test", "/tr/blog")).toBe(true);
  });

  it("does not match siblings with a shared prefix", () => {
    expect(isActivePath("/tr/blogroll", "/tr/blog")).toBe(false);
    expect(isActivePath("/tr/contact", "/tr/blog")).toBe(false);
  });
});
