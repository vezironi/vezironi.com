import { describe, expect, it, vi } from "vitest";
import { getNowPlaying, type SpotifyCredentials } from "@/lib/spotify";

const creds: SpotifyCredentials = { clientId: "id", clientSecret: "secret", refreshToken: "refresh" };

const track = (name: string) => ({
  name,
  duration_ms: 200000,
  external_urls: { spotify: `https://open.spotify.com/track/${name}` },
  artists: [{ name: "Artist A" }, { name: "Artist B" }],
  album: { images: [{ url: "https://i.scdn.co/big.jpg" }, { url: "https://i.scdn.co/small.jpg" }] },
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

function mockFetch(routes: { token?: Response; current?: Response; recent?: Response }) {
  return vi.fn(async (url: string) => {
    if (url.includes("/api/token")) return routes.token ?? json({ access_token: "acc" });
    if (url.includes("currently-playing")) return routes.current ?? new Response(null, { status: 204 });
    if (url.includes("recently-played")) return routes.recent ?? json({ items: [] });
    throw new Error(`unexpected ${url}`);
  });
}

describe("getNowPlaying", () => {
  it("returns the playing track", async () => {
    const fetchImpl = mockFetch({
      current: json({ is_playing: true, currently_playing_type: "track", progress_ms: 5000, item: track("song") }),
    });
    expect(await getNowPlaying(creds, fetchImpl)).toEqual({
      state: "playing",
      title: "song",
      artists: "Artist A, Artist B",
      albumArt: "https://i.scdn.co/big.jpg",
      url: "https://open.spotify.com/track/song",
      progressMs: 5000,
      durationMs: 200000,
    });
  });

  it("falls back to the last played track on 204", async () => {
    const fetchImpl = mockFetch({ recent: json({ items: [{ track: track("old") }] }) });
    expect(await getNowPlaying(creds, fetchImpl)).toMatchObject({ state: "recent", title: "old" });
  });

  it("falls back when an ad or podcast is playing (item null)", async () => {
    const fetchImpl = mockFetch({
      current: json({ is_playing: true, currently_playing_type: "ad", item: null }),
      recent: json({ items: [{ track: track("old") }] }),
    });
    expect(await getNowPlaying(creds, fetchImpl)).toMatchObject({ state: "recent", title: "old" });
  });

  it("falls back when playback is paused", async () => {
    const fetchImpl = mockFetch({
      current: json({ is_playing: false, currently_playing_type: "track", item: track("paused") }),
      recent: json({ items: [{ track: track("old") }] }),
    });
    expect(await getNowPlaying(creds, fetchImpl)).toMatchObject({ state: "recent", title: "old" });
  });

  it("returns null when the token refresh fails", async () => {
    expect(await getNowPlaying(creds, mockFetch({ token: json({ error: "invalid_grant" }, 400) }))).toBeNull();
  });

  it("returns null when nothing was ever played", async () => {
    expect(await getNowPlaying(creds, mockFetch({}))).toBeNull();
  });

  it("returns null without credentials and never calls fetch", async () => {
    const fetchImpl = mockFetch({});
    expect(await getNowPlaying(null, fetchImpl)).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns null when fetch throws", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("offline"));
    expect(await getNowPlaying(creds, fetchImpl)).toBeNull();
  });
});
