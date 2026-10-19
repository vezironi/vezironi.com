import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPgliteDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { seed } from "@/lib/db/seed";

const state = vi.hoisted(() => ({ admin: true, db: null as unknown }));
vi.mock("@/lib/auth/server", async () => {
  const { UnauthorizedError } = await import("@/lib/auth/guard");
  return {
    requireAdmin: vi.fn(async () => {
      if (!state.admin) throw new UnauthorizedError();
      return { id: "1", name: "admin", avatar: null };
    }),
  };
});
vi.mock("@/lib/db/client", async (orig) => ({
  ...(await orig<typeof import("@/lib/db/client")>()),
  getDb: vi.fn(async () => state.db),
}));

const { deleteMessage, listMessages, setMessageRead } = await import("@/lib/admin/messages");
const { deleteMessageAction, setMessageReadAction } = await import("@/lib/admin/actions/messages");

async function insertMessages(db: Db) {
  return db
    .insert(s.messages)
    .values([
      { name: "Ali", email: "ali@example.com", body: "Eski mesaj gövdesi", ipHash: "a", read: true, createdAt: new Date("2026-10-01T10:00:00Z") },
      { name: "Ayşe", email: "ayse@example.com", subject: "Teklif", body: "Yeni mesaj gövdesi", ipHash: "b", createdAt: new Date("2026-10-02T10:00:00Z") },
    ])
    .returning();
}

describe("admin inbox core", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
  });

  it("lists newest first and can filter to unread", async () => {
    await insertMessages(db);
    expect((await listMessages(db)).map((m) => m.name)).toEqual(["Ayşe", "Ali"]);
    expect((await listMessages(db, { unreadOnly: true })).map((m) => m.name)).toEqual(["Ayşe"]);
  });

  it("marks a message read and unread", async () => {
    const [, ayse] = await insertMessages(db);
    await setMessageRead(db, ayse.id, true);
    expect((await db.select().from(s.messages).where(eq(s.messages.id, ayse.id)))[0].read).toBe(true);
    await setMessageRead(db, ayse.id, false);
    expect((await db.select().from(s.messages).where(eq(s.messages.id, ayse.id)))[0].read).toBe(false);
  });

  it("deletes a message", async () => {
    const [ali] = await insertMessages(db);
    await deleteMessage(db, ali.id);
    expect((await listMessages(db)).map((m) => m.id)).not.toContain(ali.id);
  });
});

describe("admin inbox actions", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
    state.db = db;
    state.admin = true;
  });

  it("toggles read state and deletes for the admin", async () => {
    const [ali, ayse] = await insertMessages(db);
    await setMessageReadAction(ayse.id, true);
    await deleteMessageAction(ali.id);
    const left = await listMessages(db);
    expect(left).toHaveLength(1);
    expect(left[0]).toMatchObject({ id: ayse.id, read: true });
  });

  it("rejects a non-admin before touching the database", async () => {
    const [ali] = await insertMessages(db);
    const before = await listMessages(db);
    state.admin = false;
    await expect(setMessageReadAction(ali.id, false)).rejects.toThrow("Unauthorized");
    await expect(deleteMessageAction(ali.id)).rejects.toThrow("Unauthorized");
    expect(await listMessages(db)).toEqual(before);
  });

  it("rejects malformed input from the client", async () => {
    await expect(setMessageReadAction("1" as never, true)).rejects.toThrow();
    await expect(setMessageReadAction(1, "yes" as never)).rejects.toThrow();
  });
});
