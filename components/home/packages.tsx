import { ArrowUpRight } from "lucide-react";
import type { Package } from "@/lib/content/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { NpmPackage } from "@/lib/npm";
import { CopyCommand } from "./copy-command";

function NpmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  );
}

const linkCls = "inline-flex items-center gap-0.5 transition-colors hover:text-accent";

export function Packages({
  packages,
  npm,
  locale,
  labels,
}: {
  packages: Package[];
  npm: Record<string, NpmPackage | null>;
  locale: Locale;
  labels: Dictionary["packages"];
}) {
  return (
    <ul className="grid gap-3">
      {packages.map((p) => {
        const live = npm[p.name] ?? null;
        const command = `npm i ${p.name}`;
        const npmUrl = `https://www.npmjs.com/package/${p.name}`;
        return (
          <li key={p.id} className="group rounded-lg border border-line bg-surface p-3 transition-colors hover:border-accent">
            <div className="flex items-center gap-2">
              <NpmIcon className="size-4 shrink-0 text-subtle transition-colors group-hover:text-[#cb3837]" />
              <a href={npmUrl} target="_blank" rel="noopener" className="min-w-0 truncate font-mono text-sm font-medium hover:text-accent">
                {p.name}
              </a>
              {live && (
                <span className="ml-auto shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  v{live.version}
                </span>
              )}
            </div>

            <p className="mt-2 text-[13px] leading-relaxed text-muted">{p.description}</p>

            <div className="mt-3 flex items-center gap-2 rounded-md border border-line bg-bg py-1 pr-1 pl-2.5 font-mono text-[12px]">
              <span className="text-subtle select-none" aria-hidden>
                $
              </span>
              <code className="min-w-0 flex-1 truncate text-fg">{command}</code>
              <CopyCommand command={command} label={labels.copy} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-subtle">
              {live?.license && <span>{live.license}</span>}
              {live?.weeklyDownloads ? (
                <span>
                  {live.weeklyDownloads.toLocaleString(locale)} {labels.weeklyDownloads}
                </span>
              ) : null}
              <span className="ml-auto flex items-center gap-3">
                {p.homepageUrl && (
                  <a href={p.homepageUrl} target="_blank" rel="noopener" className={linkCls}>
                    {labels.docs}
                    <ArrowUpRight className="size-3" aria-hidden />
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noopener" className={linkCls}>
                    GitHub
                    <ArrowUpRight className="size-3" aria-hidden />
                  </a>
                )}
                <a href={npmUrl} target="_blank" rel="noopener" className={linkCls}>
                  npm
                  <ArrowUpRight className="size-3" aria-hidden />
                </a>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
