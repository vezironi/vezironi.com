"use client";

import { Command } from "cmdk";
import { ArrowUpRight, FileText, Gamepad2, Globe, Home, Image as ImageIcon, Mail, Monitor, Moon, Search, Send, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { rememberLocale, swapLocale } from "./locale-switcher";

export type CommandItems = {
  posts: { slug: string; title: string }[];
  projects: { name: string; url: string }[];
  hasGallery: boolean;
  email: string;
};

function Item({ onSelect, icon, children, value }: { onSelect: () => void; icon: ReactNode; children: ReactNode; value?: string }) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted data-[selected=true]:bg-grid data-[selected=true]:text-fg"
    >
      <span className="text-subtle [&>svg]:size-4">{icon}</span>
      {children}
    </Command.Item>
  );
}

const groupCls =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle [&_[cmdk-group-heading]]:uppercase";

export function CommandMenu({ locale, dict, items }: { locale: Locale; dict: Dictionary; items: CommandItems }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const dialog = useRef<HTMLDialogElement>(null);
  const t = dict.command;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector("input")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };
  const go = (href: string) => run(() => router.push(href));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 items-center gap-1.5 rounded-md border border-line px-2 text-muted transition-colors hover:border-accent hover:text-fg"
        aria-label={dict.nav.search}
      >
        <Search className="size-3.5" aria-hidden />
        <kbd className="hidden font-mono text-[10px] sm:inline">⌘K</kbd>
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="mx-auto mt-[12vh] w-[min(92vw,560px)] overflow-hidden outline-none rounded-xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        {open && (
          <Command label={t.placeholder} loop>
            <div className="flex items-center gap-2 border-b border-line px-3">
              <Search className="size-4 text-subtle" aria-hidden />
              <Command.Input autoFocus placeholder={t.placeholder} className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle" />
              <kbd className="font-mono text-[10px] text-subtle">ESC</kbd>
            </div>
            <Command.List className="max-h-[60vh] overflow-y-auto p-1.5">
              <Command.Empty className="px-3 py-6 text-center text-sm text-subtle">{t.empty}</Command.Empty>

              <Command.Group heading={t.pages} className={groupCls}>
                <Item icon={<Home />} onSelect={go(`/${locale}`)}>{dict.nav.home}</Item>
                <Item icon={<FileText />} onSelect={go(`/${locale}/blog`)}>{dict.nav.blog}</Item>
                <Item icon={<Gamepad2 />} onSelect={go(`/${locale}/games`)}>{dict.nav.games}</Item>
                {items.hasGallery && (
                  <Item icon={<ImageIcon />} onSelect={go(`/${locale}/gallery`)}>{dict.nav.gallery}</Item>
                )}
                <Item icon={<Send />} onSelect={go(`/${locale}/contact`)}>{dict.nav.contact}</Item>
              </Command.Group>

              {items.posts.length > 0 && (
                <Command.Group heading={t.posts} className={groupCls}>
                  {items.posts.map((p) => (
                    <Item key={p.slug} value={`post ${p.title}`} icon={<FileText />} onSelect={go(`/${locale}/blog/${p.slug}`)}>
                      {p.title}
                    </Item>
                  ))}
                </Command.Group>
              )}

              <Command.Group heading={t.projects} className={groupCls}>
                {items.projects.map((p) => (
                  <Item key={p.url} value={`project ${p.name}`} icon={<ArrowUpRight />} onSelect={run(() => window.open(p.url, "_blank", "noopener"))}>
                    {p.name}
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading={t.theme} className={groupCls}>
                <Item icon={<Sun />} onSelect={run(() => setTheme("light"))}>{t.light}</Item>
                <Item icon={<Moon />} onSelect={run(() => setTheme("dark"))}>{t.dark}</Item>
                <Item icon={<Monitor />} onSelect={run(() => setTheme("system"))}>{t.system}</Item>
              </Command.Group>

              <Command.Group heading={t.language} className={groupCls}>
                <Item icon={<Globe />} onSelect={run(() => { rememberLocale("tr"); router.push(swapLocale(pathname, "tr")); })}>Türkçe</Item>
                <Item icon={<Globe />} onSelect={run(() => { rememberLocale("en"); router.push(swapLocale(pathname, "en")); })}>English</Item>
              </Command.Group>

              <Command.Group heading={t.general} className={groupCls}>
                <Item
                  icon={<Mail />}
                  onSelect={() => {
                    navigator.clipboard?.writeText(items.email).then(() => {
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                        setOpen(false);
                      }, 900);
                    });
                  }}
                >
                  {copied ? t.copied : t.copyEmail}
                  <span className="ml-auto font-mono text-[11px] text-subtle">{items.email}</span>
                </Item>
              </Command.Group>
            </Command.List>
          </Command>
        )}
      </dialog>
    </>
  );
}
