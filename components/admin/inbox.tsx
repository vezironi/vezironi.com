"use client";

import { ArrowLeft, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { deleteMessageAction, setMessageReadAction } from "@/lib/admin/actions/messages";

export type InboxMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  /** Pre-formatted on the server (Europe/Istanbul) so server and client render the same text. */
  date: string;
  shortDate: string;
};

type Filter = "all" | "unread";

function href(filter: Filter, id?: number) {
  const params = new URLSearchParams();
  if (filter === "unread") params.set("filter", "unread");
  if (id) params.set("id", String(id));
  const qs = params.toString();
  return qs ? `/admin/inbox?${qs}` : "/admin/inbox";
}

function Detail({ message, filter }: { message: InboxMessage; filter: Filter }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const autoRead = useRef(new Set<number>());

  // Opening an unread message marks it read once; "mark unread" afterwards sticks.
  useEffect(() => {
    if (message.read || autoRead.current.has(message.id)) return;
    autoRead.current.add(message.id);
    startTransition(async () => {
      await setMessageReadAction(message.id, true);
      router.refresh();
    });
  }, [message.id, message.read, router]);

  function toggleRead() {
    startTransition(async () => {
      await setMessageReadAction(message.id, !message.read);
      router.refresh();
    });
  }

  function remove() {
    if (!confirm(`${message.name} adlı kişinin mesajı silinsin mi? Bu işlem geri alınamaz.`)) return;
    startTransition(async () => {
      await deleteMessageAction(message.id);
      router.push(href(filter));
      router.refresh();
    });
  }

  const replySubject = `Re: ${message.subject || "vezironi.com"}`;
  const btn = "flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-xs text-muted hover:border-accent hover:text-fg disabled:opacity-60";

  return (
    <article className="grid gap-4">
      <Link href={href(filter)} className="flex w-fit items-center gap-1 font-mono text-xs text-subtle hover:text-fg md:hidden">
        <ArrowLeft className="size-3.5" /> tüm mesajlar
      </Link>
      <header className="grid gap-1 border-b border-line pb-4">
        <h2 className="text-lg font-semibold tracking-tight">{message.subject || <span className="text-muted">Konusuz</span>}</h2>
        <p className="text-sm">
          {message.name}{" "}
          <a href={`mailto:${message.email}`} className="font-mono text-xs text-accent hover:underline">
            {message.email}
          </a>
        </p>
        <time className="font-mono text-[11px] text-subtle">{message.date}</time>
      </header>
      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.body}</p>
      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <a href={`mailto:${message.email}?subject=${encodeURIComponent(replySubject)}`} className={btn}>
          <Reply className="size-3.5" /> Yanıtla
        </a>
        <button type="button" onClick={toggleRead} disabled={pending} className={btn}>
          {message.read ? <Mail className="size-3.5" /> : <MailOpen className="size-3.5" />}
          {message.read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
        </button>
        <button type="button" onClick={remove} disabled={pending} className={`${btn} hover:border-red-500 hover:text-red-500`}>
          <Trash2 className="size-3.5" /> Sil
        </button>
      </div>
    </article>
  );
}

/** Message list with a reading pane; selection and filter live in the URL. */
export function Inbox({ messages, selected, filter }: { messages: InboxMessage[]; selected: InboxMessage | null; filter: Filter }) {
  const tab = "rounded-md px-2.5 py-1 font-mono text-[11px] aria-[current=page]:bg-grid aria-[current=page]:text-fg text-subtle hover:text-fg";

  return (
    <div className="grid md:grid-cols-[20rem_1fr] md:divide-x md:divide-line">
      <section className={`border-line md:min-h-[calc(100dvh-7.5rem)] ${selected ? "hidden md:block" : ""}`}>
        <nav className="flex gap-1 border-b border-line px-4 py-2">
          <Link href={href("all", selected?.id)} aria-current={filter === "all" ? "page" : undefined} className={tab}>
            Tümü
          </Link>
          <Link href={href("unread", selected?.id)} aria-current={filter === "unread" ? "page" : undefined} className={tab}>
            Okunmamış
          </Link>
        </nav>
        {messages.length === 0 ? (
          <p className="px-4 py-6 text-sm text-subtle">{filter === "unread" ? "Okunmamış mesaj yok." : "Henüz mesaj yok."}</p>
        ) : (
          <ul className="divide-y divide-line">
            {messages.map((m) => (
              <li key={m.id}>
                <Link
                  href={href(filter, m.id)}
                  aria-current={selected?.id === m.id ? "page" : undefined}
                  className="grid gap-0.5 px-4 py-3 hover:bg-grid aria-[current=page]:bg-grid"
                >
                  <span className="flex items-baseline gap-2">
                    {!m.read && <span className="size-2 shrink-0 self-center rounded-full bg-accent" aria-label="okunmamış" />}
                    <span className={`min-w-0 flex-1 truncate text-sm ${m.read ? "text-muted" : "font-medium"}`}>{m.name}</span>
                    <time className="shrink-0 font-mono text-[11px] text-subtle">{m.shortDate}</time>
                  </span>
                  <span className="truncate text-xs text-subtle">{m.subject || m.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className={`p-6 ${selected ? "" : "hidden md:block"}`}>
        {selected ? (
          <Detail key={selected.id} message={selected} filter={filter} />
        ) : (
          <p className="text-sm text-subtle">Okumak için soldan bir mesaj seç.</p>
        )}
      </section>
    </div>
  );
}
