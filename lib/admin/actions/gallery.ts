"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import type { SaveResult } from "../content";
import { addGalleryItems, deleteGalleryItem, reorderGallery, updateGalleryItem, type GalleryUpload } from "../gallery";

export async function addGalleryItemsAction(uploads: GalleryUpload[]): Promise<void> {
  await requireAdmin();
  updateTag(await addGalleryItems(await getDb(), uploads));
}

export async function updateGalleryItemAction(id: number, _prev: SaveResult | null, formData: FormData): Promise<SaveResult> {
  await requireAdmin();
  const input: Record<string, string> = {};
  for (const [key, value] of formData.entries()) if (typeof value === "string") input[key] = value;
  const result = await updateGalleryItem(await getDb(), Number(id), input);
  if (result.ok) updateTag(result.tag);
  return result;
}

export async function deleteGalleryItemAction(id: number): Promise<void> {
  await requireAdmin();
  updateTag(await deleteGalleryItem(await getDb(), Number(id)));
}

export async function reorderGalleryAction(ids: number[]): Promise<void> {
  await requireAdmin();
  if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id))) throw new Error("Invalid order");
  updateTag(await reorderGallery(await getDb(), ids));
}
