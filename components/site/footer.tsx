import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Settings } from "@/lib/content/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { BackToTop } from "./back-to-top";
import { LocalTime } from "./local-time";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
        <span aria-hidden>{"// "}</span>
        {title}
      </h2>
      <ul className="grid gap-2 text-sm">{children}</ul>
    </div>
  );
}

const linkCls = "inline-flex items-center gap-1 text-muted transition-colors hover:text-fg";

export function Footer({
  settings,
  dict,
  locale,
  year,
  hasGallery,
}: {
  settings: Settings;
  dict: Dictionary;
  locale: Locale;
  year: number;
  hasGallery: boolean;
}) {
  const pages = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    ...(hasGallery ? [{ href: `/${locale}/gallery`, label: dict.nav.gallery }] : []),
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];
  const social = [
    { href: settings.links.github, label: "GitHub" },
    { href: settings.links.x, label: "X (Twitter)" },
    { href: `https://discord.com/users/${settings.links.discordId}`, label: "Discord" },
  ];

  return (
    <footer className="mx-auto w-full max-w-3xl border-x border-t border-dashed border-x-line border-t-line-dashed">
      <div className="grid grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div className="col-span-2 grid content-start gap-3 sm:col-span-1">
          <Link href={`/${locale}`} className="w-fit font-mono text-lg font-bold tracking-tight" aria-label={dict.nav.home}>
            VO<span className="text-accent">.</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{dict.footer.tagline}</p>
          <LocalTime locale={locale} city={dict.footer.city} />
        </div>

        <Column title={dict.footer.pages}>
          {pages.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className={linkCls}>
                {p.label}
              </Link>
            </li>
          ))}
        </Column>

        <Column title={dict.footer.elsewhere}>
          {social.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer me" className={`group ${linkCls}`}>
                {s.label}
                <ArrowUpRight className="size-3 text-subtle transition-colors group-hover:text-accent" aria-hidden />
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${settings.links.email}`} className={linkCls}>
              <Mail className="size-3.5" aria-hidden />
              {settings.links.email}
            </a>
          </li>
        </Column>
      </div>

      <div className="flex flex-col gap-3 border-t border-dashed border-line-dashed px-4 py-4 font-mono text-[11px] text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {settings.name}. {dict.footer.rights}
        </p>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p>{dict.footer.builtWith}</p>
          <BackToTop label={dict.footer.backToTop} />
        </div>
      </div>
    </footer>
  );
}
