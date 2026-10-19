import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { getDashboardCounts, recentMessages } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Genel" };

export default async function DashboardPage() {
  const user = await requireAdminPage();
  const [counts, messages] = await Promise.all([getDashboardCounts(), recentMessages()]);
  const cards = [
    { label: "Proje", value: counts.projects, href: "/admin/projects" },
    { label: "Paket", value: counts.packages, href: "/admin/packages" },
    { label: "Blog yazısı", value: counts.posts, href: "/admin/blog" },
    { label: "Fotoğraf", value: counts.gallery, href: "/admin/gallery" },
    { label: "Okunmamış mesaj", value: counts.unread, href: "/admin/inbox" },
  ];

  return (
    <>
      <PageHeader title={`Merhaba, ${user.name}`} description="Sitedeki içeriklerin özeti." />
      <div className="grid gap-6 p-6">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent">
                <p className="font-mono text-2xl">{c.value}</p>
                <p className="mt-1 text-xs text-muted">{c.label}</p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="rounded-lg border border-line bg-surface">
          <h2 className="border-b border-line px-4 py-3 text-sm font-medium">Son mesajlar</h2>
          {messages.length === 0 ? (
            <p className="px-4 py-6 text-sm text-subtle">Henüz mesaj yok.</p>
          ) : (
            <ul className="divide-y divide-line">
              {messages.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/inbox?id=${m.id}`} className="flex items-baseline gap-3 px-4 py-3 text-sm hover:bg-grid">
                    {!m.read && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="okunmamış" />}
                    <span className={m.read ? "text-muted" : "font-medium"}>{m.name}</span>
                    <span className="min-w-0 flex-1 truncate text-subtle">{m.subject || m.body}</span>
                    <time className="shrink-0 font-mono text-[11px] text-subtle">
                      {m.createdAt.toLocaleDateString("tr-TR")}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
