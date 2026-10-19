// Fetches a logo for projects without one: the largest declared icon, falling
// back to og:image. Saves a 256px WebP to public/seed/logos/<slug>.webp.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { projectsSeed } from "../lib/db/seed-data";

const outDir = path.join("public", "seed", "logos");
mkdirSync(outDir, { recursive: true });
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ["keyra", "mazlumadmin", "veyra", "hypescripts"];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const project of projectsSeed.filter((p) => slugs.includes(p.slug))) {
  await page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const candidates = await page.evaluate(() => {
    const icons = [...document.querySelectorAll<HTMLLinkElement>("link[rel~='icon'], link[rel='apple-touch-icon']")].map(
      (l) => ({ href: l.href, size: Number.parseInt(l.sizes?.value?.split("x")[0] ?? "0", 10) || (l.rel.includes("apple") ? 180 : 32) }),
    );
    const og = document.querySelector<HTMLMetaElement>("meta[property='og:image']")?.content;
    if (og) icons.push({ href: og, size: 1 });
    icons.push({ href: new URL("/favicon.ico", location.origin).href, size: 16 });
    return icons.sort((a, b) => b.size - a.size);
  });

  let saved = false;
  for (const { href } of candidates) {
    try {
      const res = await fetch(href);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf, { density: 384 })
        .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 90 })
        .toFile(path.join(outDir, `${project.slug}.webp`));
      console.log(project.slug, "<-", href);
      saved = true;
      break;
    } catch {
      // try next candidate
    }
  }
  if (!saved) console.warn(project.slug, "no usable logo found");
}

await browser.close();
