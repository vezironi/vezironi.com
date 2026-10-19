import { describe, expect, it, vi } from "vitest";
import { handleDiscordCallback } from "@/lib/auth/callback";
import { verifySessionToken } from "@/lib/auth/session";

const SECRET = "s".repeat(40);
const ADMIN = "1517800496029630556";
const config = { clientId: "cid", clientSecret: "sec", adminId: ADMIN, secret: SECRET };

function deps(userId: string | null, token: string | null = "tok") {
  return {
    exchangeCode: vi.fn().mockResolvedValue(token),
    fetchDiscordUser: vi.fn().mockResolvedValue(userId ? { id: userId, name: "u", avatar: null } : null),
  };
}

const base = { code: "c", state: "abc", cookieState: "abc", origin: "https://vezironi.com" };

describe("handleDiscordCallback", () => {
  it("signs the admin in", async () => {
    const result = await handleDiscordCallback(base, config, deps(ADMIN));
    expect(result.redirect).toBe("/admin");
    expect(await verifySessionToken(result.sessionToken, SECRET)).toMatchObject({ id: ADMIN });
  });

  it("uses the request origin for the redirect URI", async () => {
    const d = deps(ADMIN);
    await handleDiscordCallback({ ...base, origin: "http://localhost:3000" }, config, d);
    expect(d.exchangeCode.mock.calls[0][0].redirectUri).toBe("http://localhost:3000/api/auth/callback/discord");
  });

  it("refuses any other Discord account", async () => {
    const result = await handleDiscordCallback(base, config, deps("999"));
    expect(result).toEqual({ redirect: "/admin/login?error=forbidden" });
  });

  it("rejects a state mismatch without calling Discord", async () => {
    const d = deps(ADMIN);
    const result = await handleDiscordCallback({ ...base, cookieState: "other" }, config, d);
    expect(result).toEqual({ redirect: "/admin/login?error=state" });
    expect(d.exchangeCode).not.toHaveBeenCalled();
  });

  it("rejects a missing code or state cookie", async () => {
    expect(await handleDiscordCallback({ ...base, code: null }, config, deps(ADMIN))).toEqual({ redirect: "/admin/login?error=state" });
    expect(await handleDiscordCallback({ ...base, cookieState: undefined }, config, deps(ADMIN))).toEqual({
      redirect: "/admin/login?error=state",
    });
  });

  it("reports a failed exchange", async () => {
    expect(await handleDiscordCallback(base, config, deps(ADMIN, null))).toEqual({ redirect: "/admin/login?error=failed" });
  });

  it("reports a missing configuration", async () => {
    expect(await handleDiscordCallback(base, { ...config, clientSecret: undefined }, deps(ADMIN))).toEqual({
      redirect: "/admin/login?error=config",
    });
  });
});
