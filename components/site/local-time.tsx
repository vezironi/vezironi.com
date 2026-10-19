"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

/** Live clock for Istanbul; renders a fixed-width placeholder until mounted to avoid hydration drift. */
export function LocalTime({ locale, city }: { locale: Locale; city: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Istanbul",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [locale]);

  return (
    <p className="flex items-center gap-1.5 font-mono text-[11px] text-subtle">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
      </span>
      {city} · <time className="tabular-nums">{time ?? "--:--"}</time> <span>(GMT+3)</span>
    </p>
  );
}
