import { cacheLife } from "next/cache";

export type NpmPackage = {
  name: string;
  version: string;
  license: string | null;
  description: string | null;
  weeklyDownloads: number | null;
  url: string;
};

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export async function fetchNpmPackage(name: string, fetchImpl: FetchLike = fetch): Promise<NpmPackage | null> {
  try {
    const [latest, downloads] = await Promise.all([
      fetchImpl(`https://registry.npmjs.org/${name.replace("/", "%2f")}/latest`, { headers: { Accept: "application/json" } }),
      fetchImpl(`https://api.npmjs.org/downloads/point/last-week/${name}`, { headers: { Accept: "application/json" } }).catch(
        () => null,
      ),
    ]);
    if (!latest.ok) return null;
    const meta = (await latest.json()) as { name?: string; version?: string; license?: string; description?: string };
    if (!meta.version) return null;
    let weeklyDownloads: number | null = null;
    if (downloads?.ok) {
      const body = (await downloads.json()) as { downloads?: number };
      weeklyDownloads = typeof body.downloads === "number" ? body.downloads : null;
    }
    return {
      name: meta.name ?? name,
      version: meta.version,
      license: meta.license ?? null,
      description: meta.description ?? null,
      weeklyDownloads,
      url: `https://www.npmjs.com/package/${name}`,
    };
  } catch {
    return null;
  }
}

export async function getNpmPackage(name: string): Promise<NpmPackage | null> {
  "use cache";
  cacheLife("days");
  return fetchNpmPackage(name);
}
