"use client";

import { CheckCircle2, ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { deletePostAction, savePostAction } from "@/lib/admin/actions/posts";
import type { SaveResult } from "@/lib/admin/content";
import { slugify } from "@/lib/admin/slugify";
import { inputCls } from "./fields";
import { MarkdownEditor } from "./markdown-editor";

export type EditablePost = {
  id: number | null;
  slug: string;
  publishedAt: string;
  status: "draft" | "published";
  tags: string[];
  titleTr: string;
  excerptTr: string;
  bodyTr: string;
  titleEn: string;
  excerptEn: string;
  bodyEn: string;
};

const LANGS = [
  { key: "Tr", label: "Türkçe" },
  { key: "En", label: "English" },
] as const;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-red-500">{message}</p> : null;
}

export function PostEditor({ post }: { post: EditablePost }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(savePostAction, null);
  const errors = state && !state.ok ? state.errors : {};
  const [tab, setTab] = useState<"Tr" | "En">("Tr");
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(post.id));
  const [titles, setTitles] = useState({ Tr: post.titleTr, En: post.titleEn });
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state?.ok && !post.id) router.replace(`/admin/blog/${state.id}`);
    else if (state?.ok) router.refresh();
  }, [state, post.id, router]);

  function onTitle(lang: "Tr" | "En", value: string) {
    const next = { ...titles, [lang]: value };
    setTitles(next);
    if (!slugTouched) setSlug(slugify(next.Tr || next.En));
  }

  function remove() {
    if (!post.id || !confirm("Bu yazı silinsin mi? Bu işlem geri alınamaz.")) return;
    startTransition(async () => {
      await deletePostAction(post.id!);
      router.replace("/admin/blog");
    });
  }

  const langHasError = (lang: string) => Boolean(errors[`title${lang}`] || errors[`body${lang}`] || errors[`excerpt${lang}`]);

  return (
    <form action={action} className="grid gap-5 p-6">
      {post.id && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-4 rounded-lg border border-line bg-surface p-4 md:grid-cols-[2fr_1fr_1fr]">
        <div className="grid gap-1.5">
          <label htmlFor="f-slug" className="font-mono text-[11px] text-subtle">
            Adres (slug)
          </label>
          <div className="flex items-center rounded-md border border-line bg-bg focus-within:border-accent">
            <span className="pl-3 font-mono text-xs text-subtle">/blog/</span>
            <input
              id="f-slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="w-full bg-transparent px-1 py-2 font-mono text-sm outline-none"
              aria-invalid={!!errors.slug}
            />
          </div>
          <FieldError message={errors.slug} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="f-date" className="font-mono text-[11px] text-subtle">
            Yayın tarihi
          </label>
          <input id="f-date" type="date" name="publishedAt" defaultValue={post.publishedAt} className={inputCls} />
          <FieldError message={errors.publishedAt} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="f-status" className="font-mono text-[11px] text-subtle">
            Durum
          </label>
          <select id="f-status" name="status" defaultValue={post.status} className={inputCls}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
        <div className="grid gap-1.5 md:col-span-3">
          <label htmlFor="f-tags" className="font-mono text-[11px] text-subtle">
            Etiketler (virgülle ayır)
          </label>
          <input id="f-tags" name="tags" defaultValue={post.tags.join(", ")} placeholder="nextjs, seo" className={inputCls} />
        </div>
      </div>

      <div>
        <div role="tablist" className="flex gap-1 border-b border-line">
          {LANGS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className="-mb-px flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-sm text-muted aria-selected:border-accent aria-selected:text-fg"
            >
              {label}
              {langHasError(key) && <span className="size-1.5 rounded-full bg-red-500" aria-label="hata" />}
              {!titles[key] && <span className="font-mono text-[10px] text-subtle">(boş)</span>}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-subtle">
          Bir dili boş bırakırsan yazı sadece diğer dilde yayınlanır.
        </p>

        {LANGS.map(({ key }) => (
          <div key={key} role="tabpanel" hidden={tab !== key} className="mt-4 grid gap-4">
            <div className="grid gap-1.5">
              <label htmlFor={`f-title${key}`} className="font-mono text-[11px] text-subtle">
                Başlık
              </label>
              <input
                id={`f-title${key}`}
                name={`title${key}`}
                value={titles[key]}
                onChange={(e) => onTitle(key, e.target.value)}
                className={`${inputCls} text-base`}
                aria-invalid={!!errors[`title${key}`]}
              />
              <FieldError message={errors[`title${key}`]} />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor={`f-excerpt${key}`} className="font-mono text-[11px] text-subtle">
                Özet (liste ve paylaşım görselinde görünür)
              </label>
              <textarea id={`f-excerpt${key}`} name={`excerpt${key}`} rows={2} defaultValue={post[`excerpt${key}`]} className={inputCls} />
            </div>
            <MarkdownEditor name={`body${key}`} defaultValue={post[`body${key}`]} label="İçerik (Markdown)" />
            <FieldError message={errors[`body${key}`]} />
          </div>
        ))}
      </div>

      {errors._ && (
        <p role="alert" className="text-sm text-red-500">
          {errors._}
        </p>
      )}

      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-3 border-t border-line bg-bg/90 px-6 py-3 backdrop-blur">
        <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-60">
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {state?.ok && (
          <span role="status" className="flex items-center gap-1.5 text-sm text-accent">
            <CheckCircle2 className="size-4" /> Kaydedildi
          </span>
        )}
        {post.id && post.status === "published" && (
          <a href={`/${post.titleTr ? "tr" : "en"}/blog/${post.slug}`} target="_blank" rel="noopener" className="flex items-center gap-1 text-sm text-muted hover:text-fg">
            Sitede gör <ExternalLink className="size-3.5" />
          </a>
        )}
        {post.id && (
          <button type="button" onClick={remove} className="ml-auto flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-subtle hover:bg-red-500/10 hover:text-red-500">
            <Trash2 className="size-4" /> Sil
          </button>
        )}
      </div>
    </form>
  );
}
