// One-time helper to obtain a Spotify refresh token.
// 1. In the Spotify Developer Dashboard add the redirect URI http://127.0.0.1:8888/callback
// 2. Run: SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... bun scripts/spotify-token.ts
// 3. Open the printed URL, approve, and copy the refresh token into your env.

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const redirectUri = "http://127.0.0.1:8888/callback";
const scopes = "user-read-currently-playing user-read-recently-played";
const authorize = new URL("https://accounts.spotify.com/authorize");
authorize.search = new URLSearchParams({ client_id: clientId, response_type: "code", redirect_uri: redirectUri, scope: scopes }).toString();

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 8888,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname !== "/callback") return new Response("Not found", { status: 404 });
    const code = url.searchParams.get("code");
    if (!code) return new Response(`Spotify returned: ${url.searchParams.get("error")}`, { status: 400 });

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
    });
    const json = (await res.json()) as { refresh_token?: string; error_description?: string };
    if (!json.refresh_token) {
      console.error("Token exchange failed:", json);
      setTimeout(() => server.stop(), 100);
      return new Response(`Failed: ${json.error_description ?? "unknown error"}`, { status: 500 });
    }
    console.log("\nSPOTIFY_REFRESH_TOKEN=" + json.refresh_token + "\n");
    setTimeout(() => server.stop(), 100);
    return new Response("Done. Copy the refresh token from your terminal and close this tab.");
  },
});

console.log("Open this URL in your browser:\n\n" + authorize.toString() + "\n");
