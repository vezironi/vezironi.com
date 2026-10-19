"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/content/queries";

type Labels = { close: string; previous: string; next: string };

export function GalleryGrid({ items, labels, dates }: { items: GalleryItem[]; labels: Labels; dates: Record<number, string> }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const current = index === null ? null : items[index];

  return (
    <>
      <ul className="columns-2 gap-2 sm:columns-3 [&>li]:mb-2">
        {items.map((item, i) => (
          <li key={item.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full overflow-hidden rounded-md border border-line bg-surface focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Image
                src={item.imageUrl}
                alt={item.caption ?? ""}
                width={item.width}
                height={item.height}
                sizes="(min-width: 640px) 240px, 50vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto max-h-[92dvh] max-w-[min(92vw,1100px)] border-0 bg-transparent p-0 backdrop:bg-black/85"
      >
        {current && (
          <figure className="relative">
            <Image
              src={current.imageUrl}
              alt={current.caption ?? ""}
              width={current.width}
              height={current.height}
              sizes="92vw"
              className="h-auto max-h-[80dvh] w-auto rounded-md object-contain"
            />
            <figcaption className="mt-2 flex items-center justify-between gap-4 font-mono text-xs text-white/70">
              <span>{current.caption}</span>
              {current.takenAt && <span>{dates[current.id]}</span>}
            </figcaption>
            <div className="absolute top-2 right-2 flex gap-1">
              {items.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className="grid size-8 place-items-center rounded-md bg-black/60 text-white hover:bg-black/80">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label={labels.next} className="grid size-8 place-items-center rounded-md bg-black/60 text-white hover:bg-black/80">
                    <ChevronRight className="size-4" />
                  </button>
                </>
              )}
              <button type="button" onClick={close} aria-label={labels.close} className="grid size-8 place-items-center rounded-md bg-black/60 text-white hover:bg-black/80">
                <X className="size-4" />
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
