import type { Db } from "./client";
import * as s from "./schema";
import {
  experiencesSeed,
  packagesSeed,
  postsSeed,
  projectsSeed,
  referencesSeed,
  settingsSeed,
  stackSeed,
} from "./seed-data";

/** Idempotent: inserts initial content, skipping rows that already exist. */
export async function seed(db: Db): Promise<void> {
  await db.insert(s.siteSettings).values(settingsSeed).onConflictDoNothing();

  await db
    .insert(s.projects)
    .values(
      projectsSeed.map(({ slug, ...p }, i) => ({
        ...p,
        logoUrl: `/seed/logos/${slug}.webp`,
        screenshotUrl: `/seed/projects/${slug}.webp`,
        sortOrder: i,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(s.packages)
    .values(packagesSeed.map((p, i) => ({ ...p, sortOrder: i })))
    .onConflictDoNothing();

  await db
    .insert(s.references)
    .values(
      referencesSeed.map(({ file, ...r }, i) => ({
        ...r,
        logoUrl: `/seed/references/${file}_logo.webp`,
        sortOrder: i,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(s.experiences)
    .values(experiencesSeed.map((e, i) => ({ ...e, sortOrder: i })))
    .onConflictDoNothing();

  await db
    .insert(s.stackItems)
    .values(
      stackSeed.map(({ icon, ...item }, i) => ({ ...item, iconUrl: `/seed/stack/${icon}.svg`, sortOrder: i })),
    )
    .onConflictDoNothing();

  await db.insert(s.posts).values(postsSeed).onConflictDoNothing();
}
