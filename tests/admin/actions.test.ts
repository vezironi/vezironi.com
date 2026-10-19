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
      return { id: "1517800496029630556", name: "admin", avatar: null };
    }),
  };
});
vi.mock("@/lib/db/client", async (orig) => ({
  ...(await orig<typeof import("@/lib/db/client")>()),
  getDb: vi.fn(async () => state.db),
}));
const updateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ updateTag, cacheLife: vi.fn(), cacheTag: vi.fn() }));

const { deleteEntityAction, reorderEntityAction, saveEntityAction, saveSettingsAction } = await import(
  "@/lib/admin/actions/content"
);

function form(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

describe("admin content actions", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
    state.db = db;
    state.admin = true;
    updateTag.mockClear();
  });

  it("saves and invalidates the entity's tag", async () => {
    const result = await saveEntityAction("references", null, form({ name: "Acme", logoUrl: "/uploads/references/a.webp", url: "" }));
    expect(result).toMatchObject({ ok: true });
    expect(updateTag).toHaveBeenCalledWith("references");
  });

  it("does not invalidate on validation errors", async () => {
    const result = await saveEntityAction("references", null, form({ name: "", logoUrl: "x" }));
    expect(result.ok).toBe(false);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("rejects a non-admin before touching the database", async () => {
    state.admin = false;
    const before = await db.select().from(s.references);
    await expect(saveEntityAction("references", null, form({ name: "Evil", logoUrl: "/uploads/x.webp" }))).rejects.toThrow("Unauthorized");
    await expect(deleteEntityAction("references", before[0].id)).rejects.toThrow("Unauthorized");
    await expect(reorderEntityAction("references", before.map((r) => r.id).reverse())).rejects.toThrow("Unauthorized");
    await expect(saveSettingsAction(null, form({ name: "x" }))).rejects.toThrow("Unauthorized");
    expect(await db.select().from(s.references)).toEqual(before);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("rejects an unknown entity name from the client", async () => {
    await expect(deleteEntityAction("users" as never, 1)).rejects.toThrow();
  });

  it("deletes and reorders with invalidation", async () => {
    const [night] = await db.select().from(s.references).where(eq(s.references.name, "Night"));
    await deleteEntityAction("references", night.id);
    expect(updateTag).toHaveBeenCalledWith("references");
    const ids = (await db.select().from(s.references)).map((r) => r.id).reverse();
    await reorderEntityAction("references", ids);
    expect(updateTag).toHaveBeenCalledTimes(2);
  });
});
