import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export function buildRobots(): MetadataRoute.Robots {
  if (env.noindex) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
