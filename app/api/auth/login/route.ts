import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { CALLBACK_PATH } from "@/lib/auth/callback";
import { buildAuthorizeUrl } from "@/lib/auth/discord";
import { STATE_COOKIE } from "@/lib/auth/session";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  if (!env.discordClientId) return NextResponse.redirect(new URL("/admin/login?error=config", origin));

  const state = randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(
    buildAuthorizeUrl({ clientId: env.discordClientId, redirectUri: `${origin}${CALLBACK_PATH}`, state }),
  );
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: origin.startsWith("https://"),
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 600,
  });
  return response;
}
