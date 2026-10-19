"use server";

import { requireAdmin } from "@/lib/auth/server";
import { uploadImage, UploadError, type UploadFolder, type UploadResult } from "@/lib/storage";

const FOLDERS = new Set<UploadFolder>(["gallery", "projects", "logos", "references", "stack", "blog"]);

export async function uploadAction(formData: FormData): Promise<({ ok: true } & UploadResult) | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  const folder = String(formData.get("folder")) as UploadFolder;
  if (!(file instanceof File) || !FOLDERS.has(folder)) return { ok: false, error: "Geçersiz yükleme." };
  try {
    return { ok: true, ...(await uploadImage(file, folder)) };
  } catch (error) {
    if (error instanceof UploadError) return { ok: false, error: error.message };
    console.error("Upload failed", error);
    return { ok: false, error: "Yükleme başarısız oldu." };
  }
}
