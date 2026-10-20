import { and, asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { locales, type Locale } from "@/lib/i18n/config";
import { youtubeId, youtubeThumbnail } from "@/lib/youtube";
import { pick } from "./localize";
import { TAGS } from "./tags";

export type Settings = {
  name: string;
  title: string;
  bio: string;
  links: { github: string; email: string; discord: string; discordId: string; x: string };
};

export type Project = {
  id: number;
  name: string;
  url: string;
  logoUrl: string;
  screenshotUrl: string;
  bannerUrl: string | null;
  description: string;
  tech: string[];
  year: number;
};

export type GameProject = {
  id: number;
  name: string;
  store: string;
  youtubeUrl: string;
  tebexUrl: string | null;
  thumbnailUrl: string | null;
  description: string;
};

export type Reference = { id: number; name: string; logoUrl: string; url: string | null };

export type Package = {
  id: number;
  name: string;
  description: string;
  homepageUrl: string | null;
  repoUrl: string | null;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  description: string;
  start: number;
  end: number | null;
};

export type StackItem = { id: number; name: string; iconUrl: string };

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
};

export type Post = PostSummary & {
  body: string;
  updatedAt: string;
  availableLocales: Locale[];
};

export type GalleryItem = {
  id: number;
  imageUrl: string;
  width: number;
  height: number;
  caption: string | null;
  takenAt: string | null;
};

type PostRow = typeof s.posts.$inferSelect;

function postLocales(row: PostRow): Locale[] {
  return locales.filter((l) => pick(row, "title", l) && pick(row, "body", l));
}

// ---- Uncached (take a db, used by tests and admin) ----

export async function getSettingsUncached(db: Db, locale: Locale): Promise<Settings> {
  const [row] = await db.select().from(s.siteSettings).limit(1);
  return {
    name: row.name,
    title: pick(row, "title", locale) ?? "",
    bio: pick(row, "bio", locale) ?? "",
    links: { github: row.github, email: row.email, discord: row.discordUsername, discordId: row.discordId, x: row.x },
  };
}

export async function getProjectsUncached(db: Db, locale: Locale): Promise<Project[]> {
  const rows = await db.select().from(s.projects).where(eq(s.projects.visible, true)).orderBy(asc(s.projects.sortOrder));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    url: r.url,
    logoUrl: r.logoUrl,
    screenshotUrl: r.screenshotUrl,
    bannerUrl: r.bannerUrl,
    description: pick(r, "description", locale) ?? "",
    tech: r.tech,
    year: r.year,
  }));
}

export async function getGameProjectsUncached(db: Db, locale: Locale): Promise<GameProject[]> {
  const rows = await db
    .select()
    .from(s.gameProjects)
    .where(eq(s.gameProjects.visible, true))
    .orderBy(asc(s.gameProjects.sortOrder));
  return rows.map((r) => {
    const videoId = youtubeId(r.youtubeUrl);
    return {
      id: r.id,
      name: r.name,
      store: r.store,
      youtubeUrl: r.youtubeUrl,
      tebexUrl: r.tebexUrl,
      thumbnailUrl: videoId ? youtubeThumbnail(videoId) : null,
      description: pick(r, "description", locale) ?? "",
    };
  });
}

export async function getPackagesUncached(db: Db, locale: Locale): Promise<Package[]> {
  const rows = await db.select().from(s.packages).orderBy(asc(s.packages.sortOrder));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: pick(r, "description", locale) ?? "",
    homepageUrl: r.homepageUrl,
    repoUrl: r.repoUrl,
  }));
}

export async function getReferencesUncached(db: Db): Promise<Reference[]> {
  const rows = await db.select().from(s.references).orderBy(asc(s.references.sortOrder));
  return rows.map(({ id, name, logoUrl, url }) => ({ id, name, logoUrl, url }));
}

export async function getExperiencesUncached(db: Db, locale: Locale): Promise<Experience[]> {
  const rows = await db.select().from(s.experiences).orderBy(asc(s.experiences.sortOrder));
  return rows.map((r) => ({
    id: r.id,
    company: r.company,
    role: pick(r, "role", locale) ?? "",
    description: pick(r, "description", locale) ?? "",
    start: r.startYear,
    end: r.endYear,
  }));
}

export async function getStackUncached(db: Db): Promise<{ tech: StackItem[]; tools: StackItem[] }> {
  const rows = await db.select().from(s.stackItems).orderBy(asc(s.stackItems.sortOrder));
  const toItem = ({ id, name, iconUrl }: (typeof rows)[number]) => ({ id, name, iconUrl });
  return {
    tech: rows.filter((r) => r.category === "tech").map(toItem),
    tools: rows.filter((r) => r.category === "tool").map(toItem),
  };
}

async function publishedPosts(db: Db): Promise<PostRow[]> {
  return db
    .select()
    .from(s.posts)
    .where(eq(s.posts.status, "published"))
    .orderBy(desc(s.posts.publishedAt), desc(s.posts.id));
}

export async function getPostsUncached(db: Db, locale: Locale, opts: { limit?: number } = {}): Promise<PostSummary[]> {
  const rows = (await publishedPosts(db)).filter((r) => postLocales(r).includes(locale));
  return rows.slice(0, opts.limit ?? rows.length).map((r) => ({
    slug: r.slug,
    title: pick(r, "title", locale) ?? "",
    excerpt: pick(r, "excerpt", locale) ?? "",
    tags: r.tags,
    publishedAt: r.publishedAt,
  }));
}

export async function getPostUncached(db: Db, locale: Locale, slug: string): Promise<Post | null> {
  const [row] = await db
    .select()
    .from(s.posts)
    .where(and(eq(s.posts.slug, slug), eq(s.posts.status, "published")))
    .limit(1);
  if (!row) return null;
  const availableLocales = postLocales(row);
  if (!availableLocales.includes(locale)) return null;
  return {
    slug: row.slug,
    title: pick(row, "title", locale) ?? "",
    excerpt: pick(row, "excerpt", locale) ?? "",
    body: pick(row, "body", locale) ?? "",
    tags: row.tags,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt.toISOString(),
    availableLocales,
  };
}

/** Whether a slug exists in any form (draft or other locale) — used for legacy redirects. */
export async function postSlugExistsUncached(db: Db, slug: string): Promise<boolean> {
  const rows = await db.select({ id: s.posts.id }).from(s.posts).where(eq(s.posts.slug, slug)).limit(1);
  return rows.length > 0;
}

export async function listPostSlugsUncached(
  db: Db,
): Promise<{ slug: string; locales: Locale[]; updatedAt: string }[]> {
  return (await publishedPosts(db)).map((r) => ({
    slug: r.slug,
    locales: postLocales(r),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getGalleryUncached(db: Db, locale: Locale): Promise<GalleryItem[]> {
  const rows = await db.select().from(s.galleryItems).orderBy(asc(s.galleryItems.sortOrder));
  return rows.map((r) => ({
    id: r.id,
    imageUrl: r.imageUrl,
    width: r.width,
    height: r.height,
    caption: pick(r, "caption", locale),
    takenAt: r.takenAt,
  }));
}

// ---- Cached (used by pages; invalidated by revalidateTag from the admin) ----

export async function getSettings(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.settings);
  return getSettingsUncached(await getDb(), locale);
}

export async function getProjects(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.projects);
  return getProjectsUncached(await getDb(), locale);
}

export async function getGameProjects(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.games);
  return getGameProjectsUncached(await getDb(), locale);
}

export async function getPackages(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.packages);
  return getPackagesUncached(await getDb(), locale);
}

export async function getReferences() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.references);
  return getReferencesUncached(await getDb());
}

export async function getExperiences(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.experiences);
  return getExperiencesUncached(await getDb(), locale);
}

export async function getStack() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.stack);
  return getStackUncached(await getDb());
}

export async function getPosts(locale: Locale, opts: { limit?: number } = {}) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  return getPostsUncached(await getDb(), locale, opts);
}

export async function getPost(locale: Locale, slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  return getPostUncached(await getDb(), locale, slug);
}

export async function postSlugExists(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  return postSlugExistsUncached(await getDb(), slug);
}

export async function listPostSlugs() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  return listPostSlugsUncached(await getDb());
}

export async function getGallery(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.gallery);
  return getGalleryUncached(await getDb(), locale);
}
