"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { renderMarkdown } from "@/lib/markdown";
import type { SaveResult } from "../content";
import { deletePost, savePost } from "../posts";

export async function savePostAction(_prev: SaveResult | null, formData: FormData): Promise<SaveResult> {
  await requireAdmin();
  const input: Record<string, string> = {};
  for (const [key, value] of formData.entries()) if (typeof value === "string") input[key] = value;
  const result = await savePost(await getDb(), input);
  if (result.ok) updateTag(result.tag);
  return result;
}

export async function deletePostAction(id: number): Promise<void> {
  await requireAdmin();
  updateTag(await deletePost(await getDb(), Number(id)));
}

export async function previewMarkdownAction(markdown: string): Promise<string> {
  await requireAdmin();
  return renderMarkdown(String(markdown).slice(0, 200_000));
}
