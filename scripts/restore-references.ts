// Restores the v1 reference logos from git history into public/seed.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const COMMIT = "3485855";
const names = ["0resmon", "whitebilisim", "borp", "fastscript", "night"];
const refDir = path.join("public", "seed", "references");
const logoDir = path.join("public", "seed", "logos");
mkdirSync(refDir, { recursive: true });
mkdirSync(logoDir, { recursive: true });

for (const name of names) {
  const file = `${name}_logo.webp`;
  const data = execFileSync("git", ["show", `${COMMIT}:public/references/${file}`]);
  writeFileSync(path.join(refDir, file), data);
  if (name === "0resmon" || name === "whitebilisim") writeFileSync(path.join(logoDir, `${name}.webp`), data);
  console.log("restored", file);
}
