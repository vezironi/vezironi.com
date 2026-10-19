import { formatDate } from "@/lib/format";
import type { Contributions } from "@/lib/github";
import type { Locale } from "@/lib/i18n/config";

const CELL = 10;
const GAP = 3;
const TOP = 16;
const LEVEL_FILL = [
  "var(--grid)",
  "color-mix(in oklab, var(--accent) 30%, var(--bg))",
  "color-mix(in oklab, var(--accent) 55%, var(--bg))",
  "color-mix(in oklab, var(--accent) 80%, var(--bg))",
  "var(--accent)",
];
const MONTH_FMT: Record<Locale, Intl.DateTimeFormat> = {
  tr: new Intl.DateTimeFormat("tr-TR", { month: "short", timeZone: "UTC" }),
  en: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }),
};

export function GitHubGraph({
  data,
  locale,
  labels,
  profileUrl,
}: {
  data: Contributions | null;
  locale: Locale;
  labels: { total: string; unavailable: string };
  profileUrl: string;
}) {
  const width = 53 * (CELL + GAP) - GAP;
  const height = TOP + 7 * (CELL + GAP) - GAP;

  if (!data) {
    return (
      <div className="grid place-items-center rounded-md border border-dashed border-line-dashed text-xs text-subtle" style={{ aspectRatio: `${width} / ${height}` }}>
        {labels.unavailable}
      </div>
    );
  }

  const weeks = data.weeks.slice(-53);
  // Label a column when its first day starts a new month (skip the last two to avoid clipping).
  const months: { x: number; label: string }[] = [];
  let lastMonth = "";
  weeks.forEach((week, i) => {
    const first = week.find((d) => d !== null);
    if (!first) return;
    const month = first.date.slice(0, 7);
    if (month !== lastMonth && i > 0 && i < weeks.length - 2) {
      months.push({ x: i * (CELL + GAP), label: MONTH_FMT[locale].format(new Date(`${first.date}T00:00:00Z`)) });
    }
    lastMonth = month;
  });

  return (
    <div>
      <a href={profileUrl} target="_blank" rel="noopener" className="block" aria-label={`GitHub: ${data.total} ${labels.total}`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-hidden>
          {months.map((m) => (
            <text key={`${m.x}-${m.label}`} x={m.x} y={10} className="fill-subtle font-mono" fontSize="9">
              {m.label}
            </text>
          ))}
          {weeks.map((week, wi) =>
            week.map((day, di) =>
              day ? (
                <rect
                  key={day.date}
                  x={wi * (CELL + GAP)}
                  y={TOP + di * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  style={{ fill: LEVEL_FILL[day.level] }}
                >
                  <title>{`${day.count} ${labels.total} · ${formatDate(day.date, locale)}`}</title>
                </rect>
              ) : null,
            ),
          )}
        </svg>
      </a>
      <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-subtle">
        <span>
          <span className="text-fg">{data.total.toLocaleString(locale === "tr" ? "tr-TR" : "en-US")}</span> {labels.total}
        </span>
        <span className="flex items-center gap-1" aria-hidden>
          {LEVEL_FILL.map((fill) => (
            <span key={fill} className="size-2.5 rounded-[2px]" style={{ background: fill }} />
          ))}
        </span>
      </div>
    </div>
  );
}
