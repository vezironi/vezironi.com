import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { LogoTile } from "@/components/site/logo-tile";
import type { Project } from "@/lib/content/queries";
import type { Locale } from "@/lib/i18n/config";

const SCREENSHOT_ALT: Record<Locale, (name: string) => string> = {
  tr: (name) => `${name} ekran görüntüsü`,
  en: (name) => `${name} screenshot`,
};

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function Projects({ projects, locale }: { projects: Project[]; locale: Locale }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {projects.map((p, i) => (
        <li key={p.id}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-accent"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#111113]">
              <Image
                src={p.screenshotUrl}
                alt={SCREENSHOT_ALT[locale](p.name)}
                fill
                sizes="(min-width: 640px) 360px, 100vw"
                className="object-cover object-top grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                priority={i < 2}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="flex items-center gap-2">
                <LogoTile src={p.logoUrl} alt="" size={22} className="grayscale transition-[filter] duration-300 group-hover:grayscale-0" />
                <span className="font-medium">{p.name}</span>
                <span className="ml-auto flex items-center gap-1 font-mono text-[11px] text-subtle">
                  {p.year}
                  <ArrowUpRight className="size-3.5 transition-colors group-hover:text-accent" aria-hidden />
                </span>
              </div>
              <p className="line-clamp-3 text-[13px] leading-relaxed text-muted">{p.description}</p>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                {p.tech.map((t) => (
                  <span key={t} className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                    {t}
                  </span>
                ))}
                <span className="ml-auto font-mono text-[10px] text-subtle">{hostname(p.url)}</span>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
