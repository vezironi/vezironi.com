import { ArrowUpRight, Play } from "lucide-react";
import Image from "next/image";
import type { GameProject } from "@/lib/content/queries";
import type { Locale } from "@/lib/i18n/config";

const THUMBNAIL_ALT: Record<Locale, (name: string) => string> = {
  tr: (name) => `${name} tanıtım videosu`,
  en: (name) => `${name} showcase video`,
};

export function GameProjects({ games, locale, priority = false }: { games: GameProject[]; locale: Locale; priority?: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {games.map((g, i) => (
        <li
          key={g.id}
          className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-accent"
        >
          <div className="relative aspect-video overflow-hidden border-b border-line bg-[#111113]">
            {g.thumbnailUrl && (
              <Image
                src={g.thumbnailUrl}
                alt={THUMBNAIL_ALT[locale](g.name)}
                fill
                sizes="(min-width: 640px) 360px, 100vw"
                className="object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                priority={priority && i < 2}
              />
            )}
            <span
              aria-hidden
              className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="grid size-11 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                <Play className="size-4 translate-x-px fill-current" />
              </span>
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.12em] text-subtle uppercase">{g.store}</span>
              {g.tebexUrl && (
                // Above the card's stretched link so it opens Tebex instead of YouTube.
                <a
                  href={g.tebexUrl}
                  target="_blank"
                  rel="noopener"
                  className="relative z-10 ml-auto flex items-center gap-1 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  Tebex
                  <ArrowUpRight className="size-3" aria-hidden />
                </a>
              )}
            </div>
            <a
              href={g.youtubeUrl}
              target="_blank"
              rel="noopener"
              className="font-medium after:absolute after:inset-0 after:content-['']"
            >
              {g.name}
            </a>
            <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">{g.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
