import { env } from "@/lib/env";

export type NowPlaying = {
  state: "playing" | "recent";
  title: string;
  artists: string;
  albumArt: string | null;
  url: string;
  progressMs?: number;
  durationMs?: number;
} | null;

export type SpotifyCredentials = { clientId: string; clientSecret: string; refreshToken: string };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

type SpotifyTrack = {
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
};

export function spotifyCredentials(): SpotifyCredentials | null {
  const { spotifyClientId: clientId, spotifyClientSecret: clientSecret, spotifyRefreshToken: refreshToken } = env;
  return clientId && clientSecret && refreshToken ? { clientId, clientSecret, refreshToken } : null;
}

function toTrack(track: SpotifyTrack, state: "playing" | "recent", progressMs?: number): NonNullable<NowPlaying> {
  return {
    state,
    title: track.name,
    artists: track.artists.map((a) => a.name).join(", "),
    albumArt: track.album?.images?.[0]?.url ?? null,
    url: track.external_urls.spotify,
    ...(state === "playing" ? { progressMs, durationMs: track.duration_ms } : {}),
  };
}

/** What is playing now, otherwise the last played track; null on any failure. */
export async function getNowPlaying(creds: SpotifyCredentials | null, fetchImpl: FetchLike = fetch): Promise<NowPlaying> {
  if (!creds) return null;
  try {
    const tokenRes = await fetchImpl("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: creds.refreshToken }).toString(),
      cache: "no-store",
    });
    if (!tokenRes.ok) return null;
    const { access_token: accessToken } = (await tokenRes.json()) as { access_token?: string };
    if (!accessToken) return null;
    const auth = { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" as const };

    const current = await fetchImpl("https://api.spotify.com/v1/me/player/currently-playing", auth);
    if (current.status === 200) {
      const body = (await current.json()) as {
        is_playing?: boolean;
        currently_playing_type?: string;
        progress_ms?: number;
        item?: SpotifyTrack | null;
      };
      if (body.is_playing && body.currently_playing_type === "track" && body.item) {
        return toTrack(body.item, "playing", body.progress_ms);
      }
    }

    const recent = await fetchImpl("https://api.spotify.com/v1/me/player/recently-played?limit=1", auth);
    if (!recent.ok) return null;
    const { items } = (await recent.json()) as { items?: { track: SpotifyTrack }[] };
    return items?.[0]?.track ? toTrack(items[0].track, "recent") : null;
  } catch {
    return null;
  }
}
