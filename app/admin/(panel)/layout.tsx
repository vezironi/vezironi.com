import { Suspense } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { getUnreadCount } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Every admin page reads the session at request time; instant (prefetched) navigation
// can't apply to private pages, so opt the panel out of that validation.
export const instant = false;

function avatarUrl(id: string, avatar: string | null) {
  return avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=64` : null;
}

// The session read sits behind Suspense (a request-time read can't be prerendered).
async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPage();
  const unread = await getUnreadCount();
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <Sidebar user={{ name: user.name, avatarUrl: avatarUrl(user.id, user.avatar) }} unread={unread} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center font-mono text-xs text-subtle">yükleniyor…</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
