import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { env } from "@/lib/env";

export type UploadFolder = "gallery" | "projects" | "logos" | "references" | "stack" | "blog";
export type UploadResult = { url: string; width: number; height: number };
type Options = { localRoot?: string; blobToken?: string };

export class UploadError extends Error {}

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 2400;
const RASTER = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);
const SVG_FOLDERS = new Set<UploadFolder>(["logos", "stack"]);

function resolveOptions(opts: Options = {}) {
  return {
    localRoot: opts.localRoot ?? path.join(process.cwd(), "public"),
    blobToken: "blobToken" in opts ? opts.blobToken : env.blobToken,
  };
}

/**
 * Validates and stores an image. Rasters (except GIF) become WebP capped at 2400px;
 * SVG is allowed only for logos and stack icons. Uses Vercel Blob when a token is set,
 * otherwise public/uploads/ for local development.
 */
export async function uploadImage(file: File, folder: UploadFolder, opts?: Options): Promise<UploadResult> {
  const { localRoot, blobToken } = resolveOptions(opts);
  if (file.size > MAX_BYTES) throw new UploadError("Dosya 8 MB'tan büyük olamaz.");
  const isSvg = file.type === "image/svg+xml";
  if (!RASTER.has(file.type) && !isSvg) throw new UploadError("Sadece görsel dosyaları yüklenebilir.");
  if (isSvg && !SVG_FOLDERS.has(folder)) throw new UploadError("SVG sadece logo ve stack ikonları için kullanılabilir.");

  let body: Buffer;
  let ext: string;
  let contentType: string;
  let width: number;
  let height: number;

  if (isSvg) {
    const text = await file.text();
    if (/<script|\son\w+\s*=|javascript:/i.test(text)) throw new UploadError("SVG içinde betik olamaz.");
    body = Buffer.from(text);
    const meta = await sharp(body).metadata().catch(() => ({ width: 24, height: 24 }));
    [width, height, ext, contentType] = [meta.width ?? 24, meta.height ?? 24, "svg", "image/svg+xml"];
  } else if (file.type === "image/gif") {
    body = Buffer.from(await file.arrayBuffer());
    const meta = await sharp(body).metadata();
    [width, height, ext, contentType] = [meta.width ?? 0, meta.height ?? 0, "gif", "image/gif"];
  } else {
    const { data, info } = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    [body, width, height, ext, contentType] = [data, info.width, info.height, "webp", "image/webp"];
  }

  const name = `${folder}/${randomUUID()}.${ext}`;
  if (blobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(name, body, { access: "public", contentType, token: blobToken });
    return { url: blob.url, width, height };
  }

  const target = path.join(localRoot, "uploads", name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, body);
  return { url: `/uploads/${name}`, width, height };
}

/** Deletes an uploaded image; seed assets and anything outside the upload stores are left alone. */
export async function deleteImage(url: string, opts?: Options): Promise<void> {
  const { localRoot, blobToken } = resolveOptions(opts);
  if (/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
    if (!blobToken) return;
    const { del } = await import("@vercel/blob");
    await del(url, { token: blobToken });
    return;
  }
  if (!url.startsWith("/uploads/")) return;
  const uploads = path.join(localRoot, "uploads");
  const target = path.resolve(localRoot, `.${url}`);
  if (!target.startsWith(uploads + path.sep)) return;
  await unlink(target).catch(() => {});
}
