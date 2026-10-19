"use client";

import { Check, ImageUp, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState, useTransition } from "react";
import { addGalleryItemsAction, deleteGalleryItemAction, reorderGalleryAction, updateGalleryItemAction } from "@/lib/admin/actions/gallery";
import { uploadAction } from "@/lib/admin/actions/upload";
import type { SaveResult } from "@/lib/admin/content";
import { uploadFile } from "@/lib/client/compress-image";
import { inputCls } from "./fields";
import { SortableList } from "./sortable-list";

export type GalleryAdminItem = {
  id: number;
  imageUrl: string;
  width: number;
  height: number;
  captionTr: string | null;
  captionEn: string | null;
  takenAt: string | null;
};

type QueueEntry = { key: string; name: string; status: "waiting" | "uploading" | "done" | "error"; error?: string };

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/avif";

/** Multi-file drop target; files upload one by one and each lands in the gallery as soon as it is stored. */
function Dropzone({ onUploaded }: { onUploaded: () => void }) {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [over, setOver] = useState(false);
  const busy = useRef(false);
  const pending = useRef<{ key: string; file: File }[]>([]);
  const input = useRef<HTMLInputElement>(null);

  const patch = (key: string, next: Partial<QueueEntry>) => setQueue((q) => q.map((e) => (e.key === key ? { ...e, ...next } : e)));

  async function drain() {
    if (busy.current) return;
    busy.current = true;
    while (pending.current.length > 0) {
      const { key, file } = pending.current.shift()!;
      patch(key, { status: "uploading" });
      try {
        const result = await uploadFile(file, "gallery", uploadAction);
        if (!result.ok) {
          patch(key, { status: "error", error: result.error });
          continue;
        }
        await addGalleryItemsAction([{ url: result.url, width: result.width, height: result.height }]);
        patch(key, { status: "done" });
        onUploaded();
      } catch {
        patch(key, { status: "error", error: "Yükleme başarısız oldu." });
      }
    }
    busy.current = false;
    // Finished files drop off the list; failures stay so they can be read.
    setTimeout(() => setQueue((q) => q.filter((e) => e.status !== "done")), 1500);
  }

  function enqueue(files: FileList | null) {
    if (!files?.length) return;
    const entries = Array.from(files).map((file) => ({ key: crypto.randomUUID(), file }));
    pending.current.push(...entries);
    setQueue((q) => [...q, ...entries.map(({ key, file }) => ({ key, name: file.name, status: "waiting" as const }))]);
    void drain();
    if (input.current) input.current.value = "";
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          enqueue(e.dataTransfer.files);
        }}
        className={`grid place-items-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center transition-colors ${
          over ? "border-accent bg-accent/5 text-fg" : "border-line-dashed text-muted hover:border-accent hover:text-fg"
        }`}
      >
        <ImageUp className="size-6" aria-hidden />
        <span className="text-sm">Fotoğrafları buraya sürükle ya da seçmek için tıkla</span>
        <span className="font-mono text-[11px] text-subtle">PNG, JPEG, WebP, GIF, AVIF · en fazla 8 MB</span>
      </button>
      <input ref={input} type="file" multiple hidden accept={ACCEPT} onChange={(e) => enqueue(e.target.files)} />

      {queue.length > 0 && (
        <ul className="grid gap-1 rounded-lg border border-line bg-surface p-2">
          {queue.map((e) => (
            <li key={e.key} className="flex items-center gap-2 px-1.5 py-1 text-xs">
              {e.status === "uploading" && <Loader2 className="size-3.5 shrink-0 animate-spin text-accent" />}
              {e.status === "waiting" && <span className="size-3.5 shrink-0 rounded-full border border-line" />}
              {e.status === "done" && <Check className="size-3.5 shrink-0 text-accent" />}
              {e.status === "error" && <TriangleAlert className="size-3.5 shrink-0 text-red-500" />}
              <span className="min-w-0 flex-1 truncate">{e.name}</span>
              <span className={`shrink-0 font-mono text-[11px] ${e.status === "error" ? "text-red-500" : "text-subtle"}`}>
                {e.status === "waiting" && "sırada"}
                {e.status === "uploading" && "yükleniyor…"}
                {e.status === "done" && "eklendi"}
                {e.status === "error" && e.error}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GalleryCard({ item, onChanged }: { item: GalleryAdminItem; onChanged: () => void }) {
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(updateGalleryItemAction.bind(null, item.id), null);
  const [deleting, startDelete] = useTransition();
  const [, startSave] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState<SaveResult | null>(null);
  const errors = state && !state.ok ? state.errors : {};

  // A successful save clears the "unsaved" marker once per result.
  if (state !== saved) {
    setSaved(state);
    if (state?.ok) setDirty(false);
  }

  function remove() {
    if (!confirm("Bu fotoğraf silinsin mi? Bu işlem geri alınamaz.")) return;
    startDelete(async () => {
      await deleteGalleryItemAction(item.id);
      onChanged();
    });
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-line bg-surface ${deleting ? "opacity-50" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.imageUrl} alt="" width={item.width} height={item.height} className="aspect-4/3 w-full bg-[#111113] object-cover" />
      {/* onSubmit instead of action={…}: React resets uncontrolled forms after an action, which would flash the old values. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startSave(() => action(data));
        }}
        onChange={() => setDirty(true)}
        className="grid gap-2 p-3"
      >
        <input name="captionTr" defaultValue={item.captionTr ?? ""} placeholder="Açıklama (TR)" aria-label="Açıklama (TR)" aria-invalid={!!errors.captionTr} className={`${inputCls} py-1.5 text-xs`} />
        <input name="captionEn" defaultValue={item.captionEn ?? ""} placeholder="Caption (EN)" aria-label="Açıklama (EN)" aria-invalid={!!errors.captionEn} className={`${inputCls} py-1.5 text-xs`} />
        <input type="date" name="takenAt" defaultValue={item.takenAt ?? ""} aria-label="Çekim tarihi" aria-invalid={!!errors.takenAt} className={`${inputCls} py-1.5 font-mono text-xs`} />
        {Object.values(errors).length > 0 && <p className="text-xs text-red-500">{Object.values(errors)[0]}</p>}
        <div className="flex items-center gap-2">
          <button type="submit" disabled={pending || !dirty} className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-bg disabled:opacity-50">
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
          {state?.ok && !dirty && <span className="font-mono text-[11px] text-subtle">kaydedildi</span>}
          <button type="button" onClick={remove} disabled={deleting} className="ml-auto grid size-7 place-items-center rounded text-subtle hover:bg-red-500/10 hover:text-red-500" aria-label="Sil" title="Sil">
            <Trash2 className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

/** Upload, reorder, caption and delete gallery photos. */
export function GalleryManager({ items: initial }: { items: GalleryAdminItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [synced, setSynced] = useState(initial);
  const [, startTransition] = useTransition();

  // Take fresh server data after router.refresh() (optimistic reorder state is replaced).
  if (initial !== synced) {
    setSynced(initial);
    setItems(initial);
  }

  function reorder(next: GalleryAdminItem[]) {
    setItems(next);
    startTransition(async () => {
      await reorderGalleryAction(next.map((i) => i.id));
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 p-6">
      <Dropzone onUploaded={() => router.refresh()} />
      {items.length === 0 ? (
        <p className="text-sm text-subtle">Henüz fotoğraf yok. Galeri sayfası ilk fotoğraf eklenince sitede görünür.</p>
      ) : (
        <SortableList
          grid
          items={items}
          onReorder={reorder}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          render={(item) => <GalleryCard item={item} onChanged={() => router.refresh()} />}
        />
      )}
    </div>
  );
}
