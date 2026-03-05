type ExperienceItem = {
  year: string;
  title: string;
  detail: string;
};

const experienceItems: ExperienceItem[] = [
  {
    year: "2026",
    title: "Freelance Frontend Engineer",
    detail: "Built high-performance portfolio, SaaS and marketing interfaces.",
  },
  {
    year: "2025",
    title: "UI System Development",
    detail: "Created reusable design blocks and consistent frontend architecture.",
  },
  {
    year: "2024",
    title: "Web Product Projects",
    detail: "Delivered full-stack web products from concept to deployment.",
  },
];

export default function ExperienceSection() {
  return (
    <section className="relative w-full mt-6 overflow-hidden">
      <div className="relative flex items-center justify-between mb-4">
        <h2 className="text-lg uppercase text-neutral-50"><span className="tracking-[0.02px] text-blue-500">{"//"}</span> Experience</h2>
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Timeline</span>
      </div>

      <div className="border border-neutral-400/20 border-dashed p-4 md:p-5">
        <div className="flex flex-col gap-4">
          {experienceItems.map((item, index) => (
            <div key={`${item.year}-${item.title}`} className="relative pl-6">
              {index !== experienceItems.length - 1 && (
                <span className="absolute left-1.75 top-4 -bottom-5 w-px bg-neutral-400/20" />
              )}
              <span className="absolute left-0 top-1.5 size-3 rounded-full border border-blue-400/70 bg-blue-500/20" />

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{item.year}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">Log</span>
              </div>
              <p className="text-sm text-neutral-100 mt-1">{item.title}</p>
              <p className="text-xs text-neutral-400 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
