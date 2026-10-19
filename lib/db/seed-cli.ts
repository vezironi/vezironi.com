import { getDb } from "./client";
import { seed } from "./seed";

const db = await getDb();
await seed(db);
console.log("Seed complete.");
process.exit(0);
