type StatusItem = {
    label: string;
    value: string;
};

const statusItems: StatusItem[] = [
    { label: "Location", value: "Istanbul, TR" },
    { label: "Timezone", value: "GMT+3" },
    { label: "Availability", value: "Open for freelance" },
    { label: "Focus", value: "Web Apps + Fivem Scripts" },
];

export default function StatusStrip() {
    return (
        <section className="relative w-full mb-6 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {statusItems.map((item) => (
                    <div
                        key={item.label}
                        className="border border-neutral-400/20 border-dashed px-3 py-2.5 bg-neutral-900/20"
                    >
                        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{item.label}</p>
                        <p className="text-xs text-neutral-200 mt-1 truncate">{item.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
