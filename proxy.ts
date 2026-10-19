import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { isUnknownTopLevel, negotiateLocale, resolveRedirect } from "@/lib/i18n/negotiate";

// Two segments so app/[locale] cannot claim it; matches no route, so Next serves
// app/global-not-found.tsx with a 404 status.
const NOT_FOUND_PATH = "/_/not-found";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Otherwise "/de" would be rendered by app/[locale] with an invalid locale.
  if (isUnknownTopLevel(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = NOT_FOUND_PATH;
    return NextResponse.rewrite(url);
  }

  const locale = negotiateLocale(
    request.headers.get("accept-language"),
    request.cookies.get(LOCALE_COOKIE)?.value,
  );
  const target = resolveRedirect(pathname, locale);
  if (!target) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = target;
  // "/" depends on the visitor's language, so it must not be cached as permanent.
  return NextResponse.redirect(url, pathname === "/" ? 307 : 301);
}

export const config = {
  matcher: ["/((?!_next|api|admin|_/|.*\\..*|opengraph-image|twitter-image).*)"],
};
