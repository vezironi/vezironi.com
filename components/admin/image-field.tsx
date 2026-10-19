"use client";

import { ImageUp, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { uploadAction } from "@/lib/admin/actions/upload";
import { uploadFile } from "@/lib/client/compress-image";
import { inputCls } from "./fields";

/** Upload or paste an image URL; the value is submitted through a hidden input. */
export function ImageField({
  name,
  folder,
  defaultValue,
  allowSvg = false,
  optional = false,
}: {
  name: string;
  folder: string;
  defaultValue: string;
  allowSvg?: boolean;
  optional?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    const result = await uploadFile(file, folder, uploadAction).catch(() => ({ ok: false as const, error: "Yükleme başarısız oldu." }));
    setBusy(false);
    if (result.ok) setValue(result.url);
    else setError(result.error);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="flex items-start gap-3">
      <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-[#111113]">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-contain" />
        ) : (
          <ImageUp className="size-5 text-subtle" aria-hidden />
        )}
      </div>
      <div className="grid min-w-0 flex-1 gap-1.5">
        <input type="hidden" name={name} value={value} />
        <input
          aria-label={`${name} adresi`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="/uploads/… veya https://…"
          className={`${inputCls} font-mono text-xs`}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="flex h-7 items-center gap-1.5 rounded-md border border-line px-2 text-xs text-muted hover:border-accent hover:text-fg disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImageUp className="size-3.5" />}
            {busy ? "Yükleniyor…" : "Görsel yükle"}
          </button>
          {optional && value && (
            <button type="button" onClick={() => setValue("")} className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-subtle hover:text-fg">
              <X className="size-3.5" /> Kaldır
            </button>
          )}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <input
          ref={input}
          type="file"
          hidden
          accept={allowSvg ? "image/*,.svg" : "image/png,image/jpeg,image/webp,image/gif,image/avif"}
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
