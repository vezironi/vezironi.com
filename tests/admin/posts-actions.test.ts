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
const updateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ updateTag, cacheLife: vi.fn(), cacheTag: vi.fn() }));

const { deletePostAction, previewMarkdownAction, savePostAction } = await import("@/lib/admin/actions/posts");

describe("post actions", () => {
  let db: Db;
  beforeEach(async () => {
    db = await createPgliteDb();
    await seed(db);
    state.db = db;
    state.admin = true;
    updateTag.mockClear();
  });

  it("renders a markdown preview for the admin", async () => {
    expect(await previewMarkdownAction("## Merhaba")).toContain("<h2");
  });

  it("rejects every post action for a non-admin", async () => {
    state.admin = false;
    const before = await db.select().from(s.posts);
    const fd = new FormData();
    fd.set("slug", "x");
    await expect(savePostAction(null, fd)).rejects.toThrow("Unauthorized");
    await expect(deletePostAction(before[0].id)).rejects.toThrow("Unauthorized");
    await expect(previewMarkdownAction("# x")).rejects.toThrow("Unauthorized");
    expect(await db.select().from(s.posts)).toHaveLength(before.length);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("invalidates the posts tag after a delete", async () => {
    const [post] = await db.select().from(s.posts);
    await deletePostAction(post.id);
    expect(updateTag).toHaveBeenCalledWith("posts");
  });
});
