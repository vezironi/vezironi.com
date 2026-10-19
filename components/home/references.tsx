import { LogoTile } from "@/components/site/logo-tile";
import type { Reference } from "@/lib/content/queries";

export function References({ references }: { references: Reference[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {references.map((r) => {
        const body = (
          <>
            <LogoTile src={r.logoUrl} alt="" size={28} className="grayscale transition-[filter] duration-300 group-hover:grayscale-0" />
            <span className="text-sm">{r.name}</span>
          </>
        );
        const cls = "group flex items-center gap-2.5 rounded-lg border border-line bg-surface py-1.5 pr-3 pl-1.5";
        return (
          <li key={r.id}>
            {r.url ? (
              <a href={r.url} target="_blank" rel="noopener" className={`${cls} transition-colors hover:border-accent`}>
                {body}
              </a>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
