import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function Header({
  locale,
  dict,
  hasGallery,
  commandMenu,
}: {
  locale: Locale;
  dict: Dictionary;
  hasGallery: boolean;
  commandMenu?: ReactNode;
}) {
  const links = [
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/games`, label: dict.nav.games },
    ...(hasGallery ? [{ href: `/${locale}/gallery`, label: dict.nav.gallery }] : []),
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 border-x border-line px-4 sm:px-6">
        <Link href={`/${locale}`} className="font-mono text-sm font-bold tracking-tight" aria-label={dict.nav.home}>
          VO<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <NavLinks links={links} />
          </div>
          <div className="flex items-center gap-1.5">
            {commandMenu}
            <LocaleSwitcher locale={locale} label={dict.nav.language} />
            <ThemeToggle
              label={dict.nav.theme}
              names={{ light: dict.command.light, dark: dict.command.dark, system: dict.command.system }}
            />
            <MobileNav
              links={links}
              home={{ href: `/${locale}`, label: dict.nav.home }}
              labels={{ open: dict.nav.openMenu, close: dict.nav.closeMenu }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
