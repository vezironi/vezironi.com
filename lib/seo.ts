export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://vezironi.com");
export const SITE_NAME = "vezironi";
export const SITE_DESCRIPTION = "Portfolio, projects, blog, and services by vezironi.";

export function absoluteUrl(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalized, SITE_URL).toString();
}
