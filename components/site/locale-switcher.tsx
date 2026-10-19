"use client";

import { Check, Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, locales, type Locale } from "@/lib/i18n/config";
import { Dropdown, menuItemCls } from "./dropdown";

const NAMES: Record<Locale, string> = { tr: "Türkçe", en: "English" };

export function swapLocale(pathname: string, target: Locale): string {
  const parts = pathname.split("/");
  if ((locales as readonly string[]).includes(parts[1])) parts[1] = target;
  else parts.splice(1, 0, target);
  return parts.join("/").replace(/\/$/, "") || `/${target}`;
}

export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  return (
    <Dropdown
      label={label}
      iconOnlyOnMobile
      trigger={
        <>
          <Languages className="size-3.5" aria-hidden />
          <span className="hidden font-mono text-[11px] uppercase sm:inline">{locale}</span>
        </>
      }
    >
      {(close) =>
        locales.map((l) => (
          <a
            key={l}
            role="menuitemradio"
            aria-checked={l === locale}
            href={swapLocale(pathname, l)}
            hrefLang={l}
            lang={l}
            onClick={() => {
              rememberLocale(l);
              close();
            }}
            className={menuItemCls}
          >
            <span className="w-5 font-mono text-[10px] text-subtle uppercase">{l}</span>
            {NAMES[l]}
            {l === locale && <Check className="ml-auto size-3.5 text-accent" aria-hidden />}
          </a>
        ))
      }
    </Dropdown>
  );
}
