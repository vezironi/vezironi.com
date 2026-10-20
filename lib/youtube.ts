const ID = /^[\w-]{11}$/;

/** Video ID from watch, youtu.be, shorts, embed and live URLs; null for anything else. */
export function youtubeId(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null | undefined;
  if (host === "youtu.be") id = u.pathname.split("/")[1];
  else if (host === "youtube.com") {
    const [, first, second] = u.pathname.split("/");
    id = first === "watch" ? u.searchParams.get("v") : ["shorts", "embed", "live"].includes(first) ? second : null;
  }
  return id && ID.test(id) ? id : null;
}

/** maxresdefault (1280×720) for cards; mqdefault (320×180) for small previews. */
export function youtubeThumbnail(id: string, quality: "maxresdefault" | "mqdefault" = "maxresdefault"): string {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}
