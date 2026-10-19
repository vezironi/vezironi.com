"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "@/lib/spotify";

const POLL_MS = 30_000;

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.4-2.1-10.6-1.2a.75.75 0 1 1-.33-1.46c4.6-1 8.6-.6 11.7 1.4.36.2.47.67.25 1.02Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.2-2-8.1-2.55-11.9-1.4a.94.94 0 1 1-.54-1.8c4.3-1.3 9.7-.68 13.4 1.6.44.27.58.85.31 1.29Zm.13-3.4C15.24 8.37 8.88 8.16 5.2 9.28a1.12 1.12 0 1 1-.65-2.15c4.23-1.28 11.26-1.03 15.7 1.6a1.12 1.12 0 0 1-1.15 1.93Z" />
    </svg>
  );
}

function format(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function SpotifyCard({ labels }: { labels: { nowPlaying: string; lastPlayed: string; notListening: string } }) {
  const [data, setData] = useState<NowPlaying | undefined>(undefined);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/spotify", { cache: "no-store" });
        const json = (await res.json()) as NowPlaying;
        if (!alive) return;
        setData(json);
        setProgress(json?.progressMs ?? 0);
      } catch {
        if (alive) setData(null);
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const playing = data?.state === "playing";
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress((p) => p + 1000), 1000);
    return () => clearInterval(id);
  }, [playing]);

  const duration = data?.durationMs ?? 0;
  const label = data === undefined ? "…" : !data ? labels.notListening : playing ? labels.nowPlaying : labels.lastPlayed;

  const body = (
    <>
      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-grid ring-1 ring-line">
        {data?.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.albumArt} alt="" width={56} height={56} className="size-full object-cover" />
        ) : (
          <SpotifyIcon className="absolute inset-0 m-auto size-6 text-subtle" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-subtle uppercase">
          <SpotifyIcon className={`size-3 ${playing ? "text-[#1db954]" : ""}`} />
          {label}
          {playing && (
            <span aria-hidden className="ml-0.5 flex h-2.5 items-end gap-[2px]">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-[2px] animate-pulse bg-[#1db954]" style={{ height: `${50 + i * 25}%`, animationDelay: `${i * 150}ms` }} />
              ))}
            </span>
          )}
        </p>
        {data ? (
          <>
            <p className="mt-1 truncate text-sm font-medium">{data.title}</p>
            <p className="truncate text-xs text-muted">{data.artists}</p>
          </>
        ) : data === null ? (
          <>
            <p className="mt-1 text-sm font-medium">Spotify</p>
            <p className="text-xs text-muted">—</p>
          </>
        ) : (
          <>
            <div className="mt-1.5 h-3.5 w-2/3 rounded bg-grid" />
            <div className="mt-1.5 h-3 w-1/2 rounded bg-grid" />
          </>
        )}
        {playing && duration > 0 && (
          <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-subtle">
            <span>{format(Math.min(progress, duration))}</span>
            <span className="h-1 flex-1 overflow-hidden rounded bg-grid">
              <span className="block h-full bg-accent transition-[width] duration-1000 ease-linear" style={{ width: `${Math.min(100, (progress / duration) * 100)}%` }} />
            </span>
            <span>{format(duration)}</span>
          </div>
        )}
      </div>
    </>
  );

  const cls = "flex items-center gap-3 rounded-lg border border-line bg-surface p-3";
  return data ? (
    <a href={data.url} target="_blank" rel="noopener" className={`${cls} transition-colors hover:border-accent`}>
      {body}
    </a>
  ) : (
    <div className={cls} aria-busy={data === undefined}>
      {body}
    </div>
  );
}
