"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { deleteEntity, ENTITY_TAG, reorderEntity, saveEntity, saveSettings, type Entity, type SaveResult } from "../content";

function assertEntity(entity: string): asserts entity is Entity {
  if (!Object.hasOwn(ENTITY_TAG, entity)) throw new Error("Unknown entity");
}

function toInput(formData: FormData) {
  const input: Record<string, string> = {};
  for (const [key, value] of formData.entries()) if (typeof value === "string") input[key] = value;
  return input;
}

export async function saveEntityAction(entity: Entity, _prev: SaveResult | null, formData: FormData): Promise<SaveResult> {
  await requireAdmin();
  assertEntity(entity);
  const result = await saveEntity(await getDb(), entity, toInput(formData));
  if (result.ok) updateTag(result.tag);
  return result;
}

export async function deleteEntityAction(entity: Entity, id: number): Promise<void> {
  await requireAdmin();
  assertEntity(entity);
  updateTag(await deleteEntity(await getDb(), entity, Number(id)));
}

export async function reorderEntityAction(entity: Entity, ids: number[]): Promise<void> {
  await requireAdmin();
  assertEntity(entity);
  if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id))) throw new Error("Invalid order");
  updateTag(await reorderEntity(await getDb(), entity, ids));
}

export async function saveSettingsAction(_prev: SaveResult | null, formData: FormData): Promise<SaveResult> {
  await requireAdmin();
  const result = await saveSettings(await getDb(), toInput(formData));
  if (result.ok) updateTag(result.tag);
  return result;
}
