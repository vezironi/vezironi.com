import { desc, eq } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";

// Inbox reads and writes. Messages are never cached on the public site, so there is no tag to invalidate.

export async function listMessages(db: Db, { unreadOnly = false }: { unreadOnly?: boolean } = {}) {
  const query = db.select().from(s.messages);
  return (unreadOnly ? query.where(eq(s.messages.read, false)) : query).orderBy(desc(s.messages.createdAt), desc(s.messages.id));
}

export async function setMessageRead(db: Db, id: number, read: boolean): Promise<void> {
  await db.update(s.messages).set({ read }).where(eq(s.messages.id, id));
}

export async function deleteMessage(db: Db, id: number): Promise<void> {
  await db.delete(s.messages).where(eq(s.messages.id, id));
}
