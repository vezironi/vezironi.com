"use client";

import { Eye, ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { previewMarkdownAction } from "@/lib/admin/actions/posts";
import { uploadAction } from "@/lib/admin/actions/upload";
import { uploadFile } from "@/lib/client/compress-image";
import { inputCls } from "./fields";

/** Markdown textarea with a debounced server-rendered preview and image upload (button, paste or drop). */
export function MarkdownEditor({ name, defaultValue, label }: { name: string; defaultValue: string; label: string }) {
  const [value, setValue] = useState(defaultValue);
  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showPreview) return;
    const id = setTimeout(() => {
      previewMarkdownAction(value).then(setHtml).catch(() => setHtml("<p>Önizleme alınamadı.</p>"));
    }, 400);
    return () => clearTimeout(id);
  }, [value, showPreview]);

  function insertAtCursor(text: string) {
    const el = area.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = value.slice(0, start) + text + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + text.length, start + text.length);
    });
  }

  async function upload(files: FileList | File[] | null | undefined) {
    const images = [...(files ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setUploading(true);
    setError(null);
    for (const file of images) {
      const result = await uploadFile(file, "blog", uploadAction).catch(() => ({ ok: false as const, error: "Yükleme başarısız oldu." }));
      if (result.ok) insertAtCursor(`\n![${file.name.replace(/\.\w+$/, "")}](${result.url})\n`);
      else setError(result.error);
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-subtle">{label}</span>
        <div className="flex items-center gap-1.5">
          {error && <span className="text-xs text-red-500">{error}</span>}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex h-7 items-center gap-1.5 rounded-md border border-line px-2 text-xs text-muted hover:border-accent hover:text-fg disabled:opacity-60"
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
            Görsel ekle
          </button>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            aria-pressed={showPreview}
            className="flex h-7 items-center gap-1.5 rounded-md border border-line px-2 text-xs text-muted hover:border-accent hover:text-fg aria-pressed:border-accent aria-pressed:text-fg"
          >
            <Eye className="size-3.5" /> Önizleme
          </button>
        </div>
      </div>
      <div className={`grid gap-3 ${showPreview ? "lg:grid-cols-2" : ""}`}>
        <textarea
          ref={area}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPaste={(e) => {
            if (e.clipboardData.files.length) {
              e.preventDefault();
              upload(e.clipboardData.files);
            }
          }}
          onDrop={(e) => {
            if (e.dataTransfer.files.length) {
              e.preventDefault();
              upload(e.dataTransfer.files);
            }
          }}
          rows={22}
          spellCheck
          placeholder="## Başlık&#10;&#10;Markdown ile yaz. Görselleri buraya sürükleyip bırakabilir ya da yapıştırabilirsin."
          className={`${inputCls} min-h-[420px] resize-y font-mono text-[13px] leading-relaxed`}
        />
        {showPreview && (
          <div className="min-h-[420px] overflow-auto rounded-md border border-line bg-bg px-4 py-3">
            {value.trim() ? (
              <div className="prose-blueprint" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-sm text-subtle">Önizleme burada görünecek.</p>
            )}
          </div>
        )}
      </div>
      <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
    </div>
  );
}
