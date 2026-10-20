import "server-only";
import { asc, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { listMessages as queryMessages } from "./messages";

// Admin reads are always fresh (no "use cache"); every caller is behind requireAdminPage().

export async function getDashboardCounts() {
  const db = await getDb();
  const [[projects], [games], [packages], [posts], [gallery], [unread], [messages]] = await Promise.all([
    db.select({ n: count() }).from(s.projects),
    db.select({ n: count() }).from(s.gameProjects),
    db.select({ n: count() }).from(s.packages),
    db.select({ n: count() }).from(s.posts),
    db.select({ n: count() }).from(s.galleryItems),
    db.select({ n: count() }).from(s.messages).where(eq(s.messages.read, false)),
    db.select({ n: count() }).from(s.messages),
  ]);
  return {
    projects: projects.n,
    games: games.n,
    packages: packages.n,
    posts: posts.n,
    gallery: gallery.n,
    unread: unread.n,
    messages: messages.n,
  };
}

export async function getUnreadCount() {
  const db = await getDb();
  const [row] = await db.select({ n: count() }).from(s.messages).where(eq(s.messages.read, false));
  return row.n;
}

export async function listSettings() {
  const [row] = await (await getDb()).select().from(s.siteSettings).limit(1);
  return row;
}

export async function listProjects() {
  return (await getDb()).select().from(s.projects).orderBy(asc(s.projects.sortOrder));
}

export async function listGameProjects() {
  return (await getDb()).select().from(s.gameProjects).orderBy(asc(s.gameProjects.sortOrder));
}

export async function listPackages() {
  return (await getDb()).select().from(s.packages).orderBy(asc(s.packages.sortOrder));
}

export async function listReferences() {
  return (await getDb()).select().from(s.references).orderBy(asc(s.references.sortOrder));
}

export async function listExperiences() {
  return (await getDb()).select().from(s.experiences).orderBy(asc(s.experiences.sortOrder));
}

export async function listStack() {
  return (await getDb()).select().from(s.stackItems).orderBy(asc(s.stackItems.sortOrder));
}

export async function listPosts() {
  return (await getDb()).select().from(s.posts).orderBy(desc(s.posts.publishedAt), desc(s.posts.id));
}

export async function getPostById(id: number) {
  const [row] = await (await getDb()).select().from(s.posts).where(eq(s.posts.id, id)).limit(1);
  return row ?? null;
}

export async function listGallery() {
  return (await getDb()).select().from(s.galleryItems).orderBy(asc(s.galleryItems.sortOrder));
}

export async function listMessages(opts?: { unreadOnly?: boolean }) {
  return queryMessages(await getDb(), opts);
}

export async function recentMessages(limit = 5) {
  return (await getDb()).select().from(s.messages).orderBy(desc(s.messages.createdAt)).limit(limit);
}
