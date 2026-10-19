"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
      }
      className="flex h-7 items-center gap-1 rounded-md border border-line px-2 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-fg"
    >
      <ArrowUp className="size-3" aria-hidden />
      {label}
    </button>
  );
}
