import { mkdirSync } from "node:fs";
import path from "node:path";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { env } from "@/lib/env";
import * as schema from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Db = PgDatabase<PgQueryResultHKT, typeof schema, any>;

const MIGRATIONS = path.join(process.cwd(), "drizzle");

/** Embedded Postgres for local dev and tests. `dataDir` undefined = in-memory. */
export async function createPgliteDb(dataDir?: string): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  if (dataDir) mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS });
  return db as unknown as Db;
}

/** Local dev DB: file-backed PGlite, seeded on first start so `bun dev` works with no setup. */
async function createLocalDb(): Promise<Db> {
  const db = await createPgliteDb(path.join(process.cwd(), ".data", "pglite"));
  const existing = await db.select({ id: schema.siteSettings.id }).from(schema.siteSettings).limit(1);
  if (existing.length === 0) {
    const { seed } = await import("./seed");
    await seed(db);
  }
  return db;
}

async function createNeonDb(url: string): Promise<Db> {
  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  return drizzle(neon(url), { schema }) as unknown as Db;
}

const globalForDb = globalThis as unknown as { __vezironiDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  globalForDb.__vezironiDb ??= env.databaseUrl
    ? createNeonDb(env.databaseUrl)
    : createLocalDb();
  return globalForDb.__vezironiDb;
}

export { schema };
