export type DiscordStatus = "online" | "idle" | "dnd" | "offline";
export type Presence = { status: DiscordStatus; activity: string | null };

const STATUSES: DiscordStatus[] = ["online", "idle", "dnd", "offline"];
const LISTENING = 2;
const CUSTOM = 4;

type RawPresence = { discord_status?: unknown; activities?: { type?: number; name?: string }[] };

/** Accepts a Lanyard REST envelope ({success, data}) or a bare presence from the socket. */
export function parseLanyard(input: unknown): Presence {
  const offline: Presence = { status: "offline", activity: null };
  if (!input || typeof input !== "object") return offline;
  const envelope = input as { success?: boolean; data?: RawPresence };
  if (envelope.success === false) return offline;
  const presence: RawPresence = "data" in envelope && envelope.data ? envelope.data : (input as RawPresence);
  const status = STATUSES.find((s) => s === presence.discord_status);
  if (!status) return offline;
  const activity = (presence.activities ?? []).find((a) => a.type !== CUSTOM && a.type !== LISTENING && a.name);
  return { status, activity: activity?.name ?? null };
}
