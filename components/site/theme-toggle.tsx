"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Dropdown, menuItemCls } from "./dropdown";

const OPTIONS = [
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
  { value: "system", Icon: Monitor },
] as const;

type ThemeValue = (typeof OPTIONS)[number]["value"];

const subscribe = () => () => {};

export function ThemeToggle({ label, names }: { label: string; names: Record<ThemeValue, string> }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const current: ThemeValue = mounted && OPTIONS.some((o) => o.value === theme) ? (theme as ThemeValue) : "system";
  const CurrentIcon = OPTIONS.find((o) => o.value === current)!.Icon;

  return (
    <Dropdown label={label} trigger={<CurrentIcon className="size-3.5" aria-hidden />}>
      {(close) =>
        OPTIONS.map(({ value, Icon }) => (
          <button
            key={value}
            type="button"
            role="menuitemradio"
            aria-checked={value === current}
            onClick={() => {
              setTheme(value);
              close();
            }}
            className={menuItemCls}
          >
            <Icon className="size-3.5 text-subtle" aria-hidden />
            {names[value]}
            {value === current && <Check className="ml-auto size-3.5 text-accent" aria-hidden />}
          </button>
        ))
      }
    </Dropdown>
  );
}
