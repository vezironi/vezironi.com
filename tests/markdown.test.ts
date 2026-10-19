import { describe, expect, it } from "vitest";
import { readingTime, renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("adds ids to headings", async () => {
    expect(await renderMarkdown("## Hi there")).toContain('<h2 id="hi-there"');
  });

  it("renders GFM tables", async () => {
    expect(await renderMarkdown("| a | b |\n| --- | --- |\n| 1 | 2 |")).toContain("<table>");
  });

  it("highlights code blocks with shiki", async () => {
    expect(await renderMarkdown("```ts\nconst a = 1\n```")).toContain("shiki");
  });

  it("strips scripts", async () => {
    const html = await renderMarkdown('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
  });

  it("opens external links safely in a new tab", async () => {
    const html = await renderMarkdown("[x](https://a.com)");
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("leaves internal links alone", async () => {
    expect(await renderMarkdown("[x](/tr/blog)")).not.toContain("_blank");
  });

  it("lazy-loads images", async () => {
    expect(await renderMarkdown("![alt](/a.png)")).toContain('loading="lazy"');
  });
});

describe("readingTime", () => {
  it("rounds up to at least one minute", () => {
    expect(readingTime("one two three")).toBe(1);
    expect(readingTime(Array(450).fill("word").join(" "))).toBe(3);
  });
});
