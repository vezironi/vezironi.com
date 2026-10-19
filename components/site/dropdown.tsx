"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const menuItemCls =
  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-muted outline-none hover:bg-grid hover:text-fg focus-visible:bg-grid focus-visible:text-fg aria-checked:text-fg";

/** Header dropdown: a trigger button and a menu that closes on outside click, Escape or selection. */
export function Dropdown({
  label,
  trigger,
  children,
  iconOnlyOnMobile = false,
}: {
  label: string;
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  /** Below `sm`, render a square icon button without the chevron. */
  iconOnlyOnMobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    root.current?.querySelector<HTMLElement>('[role="menu"] [aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={`flex h-8 items-center gap-1.5 rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-fg aria-expanded:border-accent aria-expanded:text-fg ${
          iconOnlyOnMobile ? "w-8 justify-center sm:w-auto sm:px-2" : "px-2"
        }`}
      >
        {trigger}
        <ChevronDown
          className={`size-3 transition-transform ${open ? "rotate-180" : ""} ${iconOnlyOnMobile ? "hidden sm:block" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute top-full right-0 z-50 mt-1.5 w-40 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-xl"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
