import { describe, expect, it, vi } from "vitest";
import { buildAuthorizeUrl, exchangeCode, fetchDiscordUser } from "@/lib/auth/discord";
import { isAdmin } from "@/lib/auth/guard";
import { createSessionToken, verifySessionToken } from "@/lib/auth/session";

const SECRET = "x".repeat(40);
const ADMIN = "1517800496029630556";

describe("session tokens", () => {
  it("round-trips the Discord user", async () => {
    const token = await createSessionToken({ id: ADMIN, name: "vezironi.", avatar: null }, SECRET);
    expect(await verifySessionToken(token, SECRET)).toMatchObject({ id: ADMIN, name: "vezironi." });
  });

  it("rejects a token signed with another secret", async () => {
    const token = await createSessionToken({ id: ADMIN, name: "a", avatar: null }, SECRET);
    expect(await verifySessionToken(token, "y".repeat(40))).toBeNull();
  });

  it("rejects an expired token", async () => {
    const past = new Date(Date.now() - 8 * 24 * 3600 * 1000);
    const token = await createSessionToken({ id: ADMIN, name: "a", avatar: null }, SECRET, past);
    expect(await verifySessionToken(token, SECRET)).toBeNull();
  });

  it("rejects garbage and empty input", async () => {
    expect(await verifySessionToken("not-a-jwt", SECRET)).toBeNull();
    expect(await verifySessionToken(undefined, SECRET)).toBeNull();
  });

  it("refuses to sign with a short secret", async () => {
    await expect(createSessionToken({ id: ADMIN, name: "a", avatar: null }, "short")).rejects.toThrow();
  });
});

describe("isAdmin", () => {
  it("only accepts the configured Discord ID", () => {
    expect(isAdmin(null, ADMIN)).toBe(false);
    expect(isAdmin({ id: "123", name: "x", avatar: null }, ADMIN)).toBe(false);
    expect(isAdmin({ id: ADMIN, name: "x", avatar: null }, ADMIN)).toBe(true);
  });
});

describe("Discord OAuth", () => {
  it("builds the authorize URL with identify scope and state", () => {
    const url = new URL(buildAuthorizeUrl({ clientId: "cid", redirectUri: "https://vezironi.com/api/auth/callback/discord", state: "s1" }));
    expect(url.origin + url.pathname).toBe("https://discord.com/oauth2/authorize");
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      client_id: "cid",
      response_type: "code",
      scope: "identify",
      state: "s1",
      redirect_uri: "https://vezironi.com/api/auth/callback/discord",
    });
  });

  it("exchanges a code for an access token", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: "tok" }), { status: 200 }));
    expect(await exchangeCode({ code: "c", clientId: "cid", clientSecret: "sec", redirectUri: "r" }, fetchImpl)).toBe("tok");
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://discord.com/api/oauth2/token");
    expect(String(init.body)).toContain("grant_type=authorization_code");
  });

  it("returns null when the exchange fails", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("{}", { status: 400 }));
    expect(await exchangeCode({ code: "c", clientId: "cid", clientSecret: "sec", redirectUri: "r" }, fetchImpl)).toBeNull();
  });

  it("reads the Discord user", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: ADMIN, username: "vezironi.", global_name: "No.1", avatar: "abc" }), { status: 200 }),
    );
    expect(await fetchDiscordUser("tok", fetchImpl)).toEqual({ id: ADMIN, name: "No.1", avatar: "abc" });
  });

  it("returns null when the user request fails", async () => {
    expect(await fetchDiscordUser("tok", vi.fn().mockResolvedValue(new Response("", { status: 401 })))).toBeNull();
  });
});
