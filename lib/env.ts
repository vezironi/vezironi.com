function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  siteUrl: (read("NEXT_PUBLIC_SITE_URL") ?? "https://vezironi.com").replace(/\/+$/, ""),
  noindex: read("SITE_NOINDEX") === "true",
  databaseUrl: read("DATABASE_URL"),
  blobToken: read("BLOB_READ_WRITE_TOKEN"),
  authSecret: read("AUTH_SECRET"),
  adminDiscordId: read("ADMIN_DISCORD_ID") ?? "1517800496029630556",
  resendApiKey: read("RESEND_API_KEY"),
  contactToEmail: read("CONTACT_TO_EMAIL") ?? "contact@vezironi.com",
  contactFromEmail: read("CONTACT_FROM_EMAIL") ?? "no-reply@vezironi.com",
  spotifyClientId: read("SPOTIFY_CLIENT_ID"),
  spotifyClientSecret: read("SPOTIFY_CLIENT_SECRET"),
  spotifyRefreshToken: read("SPOTIFY_REFRESH_TOKEN"),
  githubToken: read("GITHUB_TOKEN"),
  lanyardDiscordId: read("LANYARD_DISCORD_ID") ?? "1517800496029630556",
};
