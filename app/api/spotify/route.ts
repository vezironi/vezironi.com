import { connection } from "next/server";
import { getNowPlaying, spotifyCredentials } from "@/lib/spotify";

export async function GET() {
  await connection();
  const nowPlaying = await getNowPlaying(spotifyCredentials());
  return Response.json(nowPlaying, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" },
  });
}
