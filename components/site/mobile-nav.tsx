"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isActivePath } from "./nav-links";

/** Below `sm` the header links move into this right-hand drawer. */
export function MobileNav({
  links,
  home,
  labels,
}: {
  links: { href: string; label: string }[];
  home: { href: string; label: string };
  labels: { open: string; close: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const items = [home, ...links];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-8 place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-fg sm:hidden"
        aria-label={labels.open}
        aria-expanded={open}
      >
        <Menu className="size-3.5" aria-hidden />
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="m-0 ml-auto h-dvh max-h-none w-[min(80vw,288px)] border-l border-line bg-surface p-0 text-fg outline-none backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <Link href={home.href} onClick={() => setOpen(false)} className="font-mono text-sm font-bold tracking-tight" aria-label={home.label}>
            VO<span className="text-accent">.</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-8 place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-fg"
            aria-label={labels.close}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
        <nav className="grid p-2">
          {items.map((l) => {
            const active = l.href === home.href ? pathname === home.href : isActivePath(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className="group flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted transition-colors hover:bg-grid hover:text-fg aria-[current=page]:text-fg"
              >
                <span aria-hidden className="font-mono text-xs text-accent opacity-0 group-aria-[current=page]:opacity-100">
                  {"//"}
                </span>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </dialog>
    </>
  );
}
