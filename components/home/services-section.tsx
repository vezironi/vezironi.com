type ServiceItem = {
  title: string;
  detail: string;
  tag: string;
};

const services: ServiceItem[] = [
  {
    title: "Website Development",
    detail: "Modern, fast and responsive websites delivered from design to production.",
    tag: "Web",
  },
  {
    title: "FiveM Script Development",
    detail: "Custom server scripts, performance optimization and existing script refactoring.",
    tag: "Script",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative w-full mt-6 overflow-hidden">
      <div className="relative flex items-center justify-between mb-4">
        <h2 className="text-lg uppercase text-neutral-50"><span className="tracking-[0.02px] text-blue-500">{"//"}</span> Services</h2>
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">What I Do</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {services.map((service) => (
          <article
            key={service.title}
            className="border border-neutral-400/20 border-dashed p-4 hover:border-neutral-300/60 hover:bg-neutral-400/5 transition-all duration-200"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">{service.tag}</span>
            <p className="text-sm text-neutral-100 mt-2">{service.title}</p>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{service.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
