import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { isAdmin, UnauthorizedError } from "./guard";
import { SESSION_COOKIE, verifySessionToken, type SessionUser } from "./session";

/** The signed-in admin, or null. Reads the session cookie, so call it inside a Suspense boundary. */
export async function getAdmin(): Promise<SessionUser | null> {
  if (!env.authSecret) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const user = await verifySessionToken(token, env.authSecret);
  return isAdmin(user, env.adminDiscordId) ? user : null;
}

/** For server actions and route handlers: throws unless the caller is the admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getAdmin();
  if (!user) throw new UnauthorizedError();
  return user;
}

/** For admin pages: sends anyone else to the login page. */
export async function requireAdminPage(): Promise<SessionUser> {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
