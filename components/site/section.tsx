import type { ReactNode } from "react";
import clsx from "clsx";

/** A blueprint block: dashed top rule with crosshair ticks and a `// Title` heading. */
export function Section({
  id,
  title,
  meta,
  children,
  className,
  flush = false,
}: {
  id?: string;
  title?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section id={id} className={clsx("relative border-t border-dashed border-line-dashed", className)}>
      <span aria-hidden className="pointer-events-none absolute -top-[5px] -left-[5px] hidden font-mono lg:block text-[10px] leading-none text-subtle">+</span>
      <span aria-hidden className="pointer-events-none absolute -top-[5px] -right-[5px] hidden font-mono lg:block text-[10px] leading-none text-subtle">+</span>
      <div className={flush ? undefined : "px-4 py-6 sm:px-6"}>
        {title && (
          <div className="mb-4 flex items-baseline justify-between gap-4 font-mono text-xs tracking-[0.12em] uppercase">
            <h2 className="text-accent">
              <span aria-hidden>{"// "}</span>
              {title}
            </h2>
            {meta != null && <span className="text-subtle normal-case tracking-normal">{meta}</span>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
