// Captures a 1440x900 screenshot of every project and saves it as WebP.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { projectsSeed } from "../lib/db/seed-data";

const outDir = path.join("public", "seed", "projects");
mkdirSync(outDir, { recursive: true });

const only = process.argv.slice(2);
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
});

for (const project of projectsSeed) {
  if (only.length && !only.includes(project.slug)) continue;
  const page = await context.newPage();
  try {
    await page.goto(project.url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    console.warn(`${project.slug}: networkidle timed out, capturing anyway`);
  }
  await page.waitForTimeout(1500);
  const png = await page.screenshot({ type: "png" });
  await sharp(png).webp({ quality: 80 }).toFile(path.join(outDir, `${project.slug}.webp`));
  console.log("captured", project.slug);
  await page.close();
}

await browser.close();
