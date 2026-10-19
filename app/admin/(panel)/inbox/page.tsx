import { Inbox, type InboxMessage } from "@/components/admin/inbox";
import { PageHeader } from "@/components/admin/page-header";
import { listMessages } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Gelen Kutusu" };

const full = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" });
const short = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" });

export default async function InboxPage({ searchParams }: PageProps<"/admin/inbox">) {
  await requireAdminPage();
  const params = await searchParams;
  const filter = params.filter === "unread" ? "unread" : "all";
  const id = Number(params.id);

  const all: InboxMessage[] = (await listMessages()).map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    body: m.body,
    read: m.read,
    date: full.format(m.createdAt),
    shortDate: short.format(m.createdAt),
  }));
  // The open message stays visible under "Okunmamış" even after it is marked read.
  const messages = filter === "unread" ? all.filter((m) => !m.read || m.id === id) : all;
  const selected = all.find((m) => m.id === id) ?? null;
  const unread = all.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader title="Gelen Kutusu" description={`${all.length} mesaj · ${unread} okunmamış`} />
      <Inbox messages={messages} selected={selected} filter={filter} />
    </>
  );
}
