import type { Experience as ExperienceItem } from "@/lib/content/queries";
import { formatRange } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

export function Experience({ items, locale }: { items: ExperienceItem[]; locale: Locale }) {
  return (
    <ol className="relative">
      {items.map((item, i) => (
        <li key={item.id} className="relative grid gap-1 pb-6 pl-6 last:pb-0 sm:grid-cols-[120px_1fr] sm:gap-4 sm:pl-0">
          {i < items.length - 1 && (
            <span aria-hidden className="absolute top-3 bottom-0 left-[5px] w-px bg-line sm:left-[129px]" />
          )}
          <span
            aria-hidden
            className={`absolute top-1.5 left-0 size-[11px] rounded-full border sm:left-[124px] ${
              item.end === null ? "border-accent bg-accent/30" : "border-line-dashed bg-bg"
            }`}
          />
          <span className="font-mono text-xs text-subtle sm:pt-0.5">{formatRange(item.start, item.end, locale)}</span>
          <div className="sm:pl-6">
            <p className="text-sm">
              <span className="font-medium">{item.company}</span>
              <span className="text-subtle"> · </span>
              <span className="text-muted">{item.role}</span>
            </p>
            {item.description && <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
