import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Multiple root layouts ([locale] and admin): one 404 page for unmatched URLs.
  experimental: {
    globalNotFound: true,
    // Admin uploads: the browser shrinks images first; Vercel caps request bodies at 4.5 MB.
    serverActions: { bodySizeLimit: "4mb" },
  },
  // PGlite loads its WASM/data files relative to its own package; keep it unbundled.
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
