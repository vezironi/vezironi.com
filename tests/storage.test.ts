import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, describe, expect, it } from "vitest";
import { deleteImage, uploadImage, UploadError } from "@/lib/storage";

const root = mkdtempSync(path.join(tmpdir(), "vo-upload-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));
const opts = { localRoot: root, blobToken: undefined };

async function png(width: number, height: number) {
  const buf = await sharp({ create: { width, height, channels: 3, background: "#a3e635" } }).png().toBuffer();
  return new File([new Uint8Array(buf)], "photo.png", { type: "image/png" });
}

describe("uploadImage", () => {
  it("rejects non-images", async () => {
    const file = new File(["%PDF"], "doc.pdf", { type: "application/pdf" });
    await expect(uploadImage(file, "gallery", opts)).rejects.toBeInstanceOf(UploadError);
  });

  it("rejects files over 8 MB", async () => {
    const file = new File([new Uint8Array(9 * 1024 * 1024)], "big.png", { type: "image/png" });
    await expect(uploadImage(file, "gallery", opts)).rejects.toThrow(/8 MB/);
  });

  it("rejects SVG outside logos and stack", async () => {
    const svg = new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], "a.svg", { type: "image/svg+xml" });
    await expect(uploadImage(svg, "gallery", opts)).rejects.toBeInstanceOf(UploadError);
    await expect(uploadImage(svg, "stack", opts)).resolves.toMatchObject({ url: expect.stringMatching(/^\/uploads\/stack\/.+\.svg$/) });
  });

  it("converts to WebP locally and reports the real size", async () => {
    const result = await uploadImage(await png(640, 480), "gallery", opts);
    expect(result).toMatchObject({ width: 640, height: 480 });
    expect(result.url).toMatch(/^\/uploads\/gallery\/[\w-]+\.webp$/);
    expect(existsSync(path.join(root, result.url))).toBe(true);
  });

  it("caps very large images at 2400px", async () => {
    const result = await uploadImage(await png(4000, 1000), "blog", opts);
    expect(result).toMatchObject({ width: 2400, height: 600 });
  });
});

describe("deleteImage", () => {
  it("removes a local upload", async () => {
    const { url } = await uploadImage(await png(10, 10), "gallery", opts);
    await deleteImage(url, opts);
    expect(existsSync(path.join(root, url))).toBe(false);
  });

  it("never touches seed assets or paths outside uploads", async () => {
    await expect(deleteImage("/seed/projects/keyra.webp", opts)).resolves.toBeUndefined();
    await expect(deleteImage("/uploads/../../package.json", opts)).resolves.toBeUndefined();
  });
});
