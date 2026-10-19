import { describe, expect, it, vi } from "vitest";
import { fetchNpmPackage } from "@/lib/npm";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

function mockFetch(latest: Response, downloads: Response) {
  return vi.fn(async (url: string) => (url.includes("api.npmjs.org/downloads") ? downloads : latest));
}

describe("fetchNpmPackage", () => {
  it("combines registry metadata with weekly downloads", async () => {
    const fetchImpl = mockFetch(
      json({ name: "@vezironi/veyra-ui", version: "0.1.2", license: "MIT", description: "Vue 3 UI kit" }),
      json({ downloads: 42 }),
    );
    expect(await fetchNpmPackage("@vezironi/veyra-ui", fetchImpl)).toEqual({
      name: "@vezironi/veyra-ui",
      version: "0.1.2",
      license: "MIT",
      description: "Vue 3 UI kit",
      weeklyDownloads: 42,
      url: "https://www.npmjs.com/package/@vezironi/veyra-ui",
    });
    expect(fetchImpl).toHaveBeenCalledWith(expect.stringContaining("registry.npmjs.org/@vezironi%2fveyra-ui/latest"), expect.anything());
  });

  it("still returns metadata when the downloads API fails", async () => {
    const result = await fetchNpmPackage("x", mockFetch(json({ name: "x", version: "1.0.0" }), json({}, 500)));
    expect(result).toMatchObject({ name: "x", version: "1.0.0", weeklyDownloads: null, license: null });
  });

  it("returns null when the registry fails", async () => {
    expect(await fetchNpmPackage("x", mockFetch(json({}, 404), json({ downloads: 1 })))).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    expect(await fetchNpmPackage("x", vi.fn().mockRejectedValue(new Error("offline")))).toBeNull();
  });
});
