"use client";

const MAX_EDGE = 2400;

/**
 * Shrinks raster images in the browser before upload (Vercel limits request bodies to 4.5 MB).
 * SVG and GIF are returned untouched; the server still validates and re-encodes everything.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
}

export async function uploadFile(
  file: File,
  folder: string,
  action: (fd: FormData) => Promise<{ ok: true; url: string; width: number; height: number } | { ok: false; error: string }>,
) {
  const fd = new FormData();
  fd.set("file", await compressImage(file));
  fd.set("folder", folder);
  return action(fd);
}
