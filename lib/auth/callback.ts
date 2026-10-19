import { exchangeCode, fetchDiscordUser } from "./discord";
import { isAdmin } from "./guard";
import { createSessionToken } from "./session";

export const CALLBACK_PATH = "/api/auth/callback/discord";

type Config = { clientId?: string; clientSecret?: string; adminId: string; secret?: string };
type Deps = { exchangeCode: typeof exchangeCode; fetchDiscordUser: typeof fetchDiscordUser };
export type CallbackResult = { redirect: string; sessionToken?: string };

/** Validates the OAuth state, resolves the Discord user and only issues a session for the admin. */
export async function handleDiscordCallback(
  input: { code: string | null; state: string | null; cookieState: string | undefined; origin: string },
  config: Config,
  deps: Deps = { exchangeCode, fetchDiscordUser },
): Promise<CallbackResult> {
  if (!config.clientId || !config.clientSecret || !config.secret) return { redirect: "/admin/login?error=config" };
  if (!input.code || !input.state || !input.cookieState || input.state !== input.cookieState) {
    return { redirect: "/admin/login?error=state" };
  }

  const accessToken = await deps.exchangeCode({
    code: input.code,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: `${input.origin}${CALLBACK_PATH}`,
  });
  if (!accessToken) return { redirect: "/admin/login?error=failed" };

  const user = await deps.fetchDiscordUser(accessToken);
  if (!user) return { redirect: "/admin/login?error=failed" };
  if (!isAdmin(user, config.adminId)) return { redirect: "/admin/login?error=forbidden" };

  return { redirect: "/admin", sessionToken: await createSessionToken(user, config.secret) };
}
