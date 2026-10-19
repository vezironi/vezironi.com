"use server";

import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { deleteMessage, setMessageRead } from "../messages";

export async function setMessageReadAction(id: number, read: boolean): Promise<void> {
  await requireAdmin();
  if (!Number.isInteger(id) || typeof read !== "boolean") throw new Error("Invalid input");
  await setMessageRead(await getDb(), id, read);
}

export async function deleteMessageAction(id: number): Promise<void> {
  await requireAdmin();
  if (!Number.isInteger(id)) throw new Error("Invalid input");
  await deleteMessage(await getDb(), id);
}
