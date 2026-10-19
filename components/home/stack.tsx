import type { StackItem } from "@/lib/content/queries";

function Chip({ item }: { item: StackItem }) {
  // Icons are monochrome SVGs tinted with the current text color via CSS mask.
  const mask = `url("${item.iconUrl}") center / contain no-repeat`;
  return (
    <li className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-xs text-muted">
      <span aria-hidden className="size-3.5 bg-current" style={{ mask, WebkitMask: mask }} />
      {item.name}
    </li>
  );
}

export function Stack({ tech, tools, labels }: { tech: StackItem[]; tools: StackItem[]; labels: { tech: string; tools: string } }) {
  return (
    <div className="grid gap-5">
      {[
        { label: labels.tech, items: tech },
        { label: labels.tools, items: tools },
      ].map((group) => (
        <div key={group.label}>
          <h3 className="mb-2 font-mono text-[11px] text-subtle">{group.label}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <Chip key={item.id} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
