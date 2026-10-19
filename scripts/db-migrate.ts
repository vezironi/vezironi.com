// Applies drizzle/ migrations to the database in DATABASE_URL (Neon).
// Runs before `next build` on Vercel so the schema always matches the code.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("DATABASE_URL not set; skipping migrations (local dev uses PGlite).");
  process.exit(0);
}

await migrate(drizzle(neon(url)), { migrationsFolder: "drizzle" });
console.log("Migrations applied.");
