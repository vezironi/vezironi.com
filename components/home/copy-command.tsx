"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCommand({ command, label }: { command: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(command).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        })
      }
      aria-label={label}
      title={label}
      className="grid size-6 shrink-0 place-items-center rounded text-subtle transition-colors hover:bg-grid hover:text-fg"
    >
      {copied ? <Check className="size-3.5 text-accent" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
    </button>
  );
}
