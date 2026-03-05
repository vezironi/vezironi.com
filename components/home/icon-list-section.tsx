import type { KnownItem } from "@/components/home/types";

type IconListSectionProps = {
    title: string;
    label: string;
    items: KnownItem[];
    gridClassName: string;
    emptyText: string;
};

export default function IconListSection({ title, label, items, gridClassName, emptyText }: IconListSectionProps) {
    return (
        <section className="relative w-full mt-10 overflow-hidden">
            <div className="relative flex items-center justify-between mb-4">
                <h2 className="text-lg uppercase text-neutral-50"><span className="tracking-[0.02px] text-blue-500">{"//"}</span> {title}</h2>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{label}</span>
            </div>

            {items.length > 0 ? (
                <div className={`relative ${gridClassName}`}>
                {items.map((item) => (
                    <div
                        key={item.name}
                        className="group/project border border-neutral-400/20 border-dashed p-3 hover:border-neutral-300/60 hover:bg-neutral-400/5 transition-all duration-200"
                    >
                        <div className="flex items-center gap-2.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.icon}
                                alt={`${item.name} logo`}
                                width={16}
                                height={16}
                                className="size-4 object-contain"
                                loading="lazy"
                                decoding="async"
                            />
                            <p className="text-sm font-medium text-neutral-100 tracking-tight truncate">{item.name}</p>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="relative text-sm text-neutral-500 font-mono">{emptyText}</p>
            )}
        </section>
    );
}
