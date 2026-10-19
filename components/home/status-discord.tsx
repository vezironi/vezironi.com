"use client";

import { useEffect, useState } from "react";
import { parseLanyard, type DiscordStatus, type Presence } from "@/lib/lanyard";

const DOT: Record<DiscordStatus, string> = {
  online: "bg-[#23a55a]",
  idle: "bg-[#f0b232]",
  dnd: "bg-[#f23f43]",
  offline: "bg-subtle",
};

/** Live Discord presence via Lanyard: REST for the first paint, WebSocket for updates. */
function usePresence(userId: string): Presence | undefined {
  const [presence, setPresence] = useState<Presence | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    let socket: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;

    const fetchRest = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        if (alive) setPresence(parseLanyard(json));
      } catch {
        if (alive) setPresence((p) => p ?? { status: "offline", activity: null });
      }
    };

    const startPolling = () => {
      if (poll) return;
      poll = setInterval(fetchRest, 60_000);
    };

    fetchRest();
    try {
      socket = new WebSocket("wss://api.lanyard.rest/socket");
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data as string) as { op: number; t?: string; d?: unknown };
        if (msg.op === 1) {
          const interval = (msg.d as { heartbeat_interval: number }).heartbeat_interval;
          socket?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
          heartbeat = setInterval(() => socket?.send(JSON.stringify({ op: 3 })), interval);
        } else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") && alive) {
          setPresence(parseLanyard(msg.d));
        }
      };
      socket.onerror = startPolling;
      socket.onclose = startPolling;
    } catch {
      startPolling();
    }

    return () => {
      alive = false;
      clearInterval(heartbeat);
      clearInterval(poll);
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }, [userId]);

  return presence;
}

export function DiscordCard({
  userId,
  username,
  labels,
}: {
  userId: string;
  username: string;
  labels: Record<DiscordStatus | "noActivity", string>;
}) {
  const presence = usePresence(userId);
  const status = presence?.status ?? "offline";

  return (
    <a
      href={`https://discord.com/users/${userId}`}
      target="_blank"
      rel="noopener"
      className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3 transition-colors hover:border-accent"
      aria-busy={presence === undefined}
    >
      <div className="relative grid size-14 shrink-0 place-items-center rounded-md bg-grid text-subtle ring-1 ring-line">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-7" aria-hidden>
          <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.4 18.4 0 0 0-5.6 0L8.6 3a19.7 19.7 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18.1a19.9 19.9 0 0 0 6 3l1.3-2a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.2-.9-9.7-3.6-13.7ZM8 15.4c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.6 8 10.6s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
        </svg>
        <span className={`absolute -right-1 -bottom-1 size-3.5 rounded-full border-2 border-surface ${DOT[status]}`} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] tracking-wide text-subtle uppercase">
          <span lang="en">Discord</span> · {presence ? labels[status] : "…"}
        </p>
        <p className="mt-1 truncate text-sm font-medium">{username}</p>
        <p className="truncate text-xs text-muted">{presence?.activity ?? labels.noActivity}</p>
      </div>
    </a>
  );
}
