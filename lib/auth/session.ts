import { jwtVerify, SignJWT } from "jose";

export type SessionUser = { id: string; name: string; avatar: string | null };

export const SESSION_COOKIE = "vo_session";
export const STATE_COOKIE = "vo_oauth_state";
export const SESSION_MAX_AGE = 7 * 24 * 3600; // seconds

function key(secret: string) {
  if (secret.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser, secret: string, now = new Date()): Promise<string> {
  const iat = Math.floor(now.getTime() / 1000);
  return new SignJWT({ name: user.name, avatar: user.avatar })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt(iat)
    .setExpirationTime(iat + SESSION_MAX_AGE)
    .sign(key(secret));
}

export async function verifySessionToken(token: string | undefined, secret: string): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: typeof payload.name === "string" ? payload.name : "",
      avatar: typeof payload.avatar === "string" ? payload.avatar : null,
    };
  } catch {
    return null;
  }
}
