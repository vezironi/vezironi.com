"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-3 text-sm sm:gap-4">
      {links.map((l) => {
        const active = isActivePath(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-14 items-center transition-colors ${active ? "text-fg" : "text-muted hover:text-fg"}`}
          >
            {l.label}
            {/* Sits on the header's bottom border. */}
            <span
              aria-hidden
              className={`absolute inset-x-0 -bottom-px h-px bg-accent transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
