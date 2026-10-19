import { NextResponse, type NextRequest } from "next/server";
import { handleDiscordCallback } from "@/lib/auth/callback";
import { SESSION_COOKIE, SESSION_MAX_AGE, STATE_COOKIE } from "@/lib/auth/session";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const result = await handleDiscordCallback(
    {
      code: searchParams.get("code"),
      state: searchParams.get("state"),
      cookieState: request.cookies.get(STATE_COOKIE)?.value,
      origin,
    },
    {
      clientId: env.discordClientId,
      clientSecret: env.discordClientSecret,
      adminId: env.adminDiscordId,
      secret: env.authSecret,
    },
  );

  const response = NextResponse.redirect(new URL(result.redirect, origin));
  response.cookies.delete({ name: STATE_COOKIE, path: "/api/auth" });
  if (result.sessionToken) {
    response.cookies.set(SESSION_COOKIE, result.sessionToken, {
      httpOnly: true,
      secure: origin.startsWith("https://"),
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }
  return response;
}
