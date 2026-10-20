"use client";

import {
  Boxes,
  Briefcase,
  ExternalLink,
  FileText,
  FolderKanban,
  Gamepad2,
  Handshake,
  Images,
  Inbox,
  LayoutDashboard,
  Layers,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Genel", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { href: "/admin/games", label: "Oyun Projeleri", icon: Gamepad2 },
  { href: "/admin/packages", label: "Paketler", icon: Boxes },
  { href: "/admin/references", label: "Referanslar", icon: Handshake },
  { href: "/admin/experience", label: "Deneyim", icon: Briefcase },
  { href: "/admin/stack", label: "Stack", icon: Layers },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/gallery", label: "Galeri", icon: Images },
  { href: "/admin/inbox", label: "Gelen Kutusu", icon: Inbox },
];

export function Sidebar({ user, unread }: { user: { name: string; avatarUrl: string | null }; unread: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="flex shrink-0 flex-col border-line bg-surface md:sticky md:top-0 md:h-dvh md:w-56 md:border-r">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 md:py-4">
        <Link href="/admin" className="font-mono text-sm font-bold">
          VO<span className="text-accent">.</span> <span className="font-normal text-subtle">panel</span>
        </Link>
        <a href="/" target="_blank" rel="noopener" className="text-subtle hover:text-fg" aria-label="Siteyi aç" title="Siteyi aç">
          <ExternalLink className="size-4" />
        </a>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:overflow-visible">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className="flex shrink-0 items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-grid hover:text-fg aria-[current=page]:bg-grid aria-[current=page]:text-fg"
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
            {href === "/admin/inbox" && unread > 0 && (
              <span className="ml-auto rounded-full bg-accent px-1.5 font-mono text-[10px] text-bg">{unread}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-2 border-t border-line p-3 md:flex">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" width={28} height={28} className="size-7 rounded-full" />
        ) : (
          <span className="size-7 rounded-full bg-grid" />
        )}
        <span className="min-w-0 flex-1 truncate text-sm">{user.name}</span>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="grid size-7 place-items-center rounded-md text-subtle hover:bg-grid hover:text-fg" aria-label="Çıkış yap" title="Çıkış yap">
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
