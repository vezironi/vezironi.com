import type { SessionUser } from "./session";

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function buildAuthorizeUrl({ clientId, redirectUri, state }: { clientId: string; redirectUri: string; state: string }) {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "identify",
    redirect_uri: redirectUri,
    state,
    prompt: "none",
  }).toString();
  return url.toString();
}

export async function exchangeCode(
  { code, clientId, clientSecret, redirectUri }: { code: string; clientId: string; clientSecret: string; redirectUri: string },
  fetchImpl: FetchLike = fetch,
): Promise<string | null> {
  try {
    const res = await fetchImpl("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

export async function fetchDiscordUser(accessToken: string, fetchImpl: FetchLike = fetch): Promise<SessionUser | null> {
  try {
    const res = await fetchImpl("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) return null;
    const u = (await res.json()) as { id?: string; username?: string; global_name?: string | null; avatar?: string | null };
    if (!u.id) return null;
    return { id: u.id, name: u.global_name || u.username || "", avatar: u.avatar ?? null };
  } catch {
    return null;
  }
}
