import Navbar from "@/components/navbar";
import JsonLd from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Services",
    description: "Website development and FiveM script development services.",
    alternates: {
        canonical: "/services",
    },
};

const services = [
    {
        title: "Website Development",
        detail: "Custom business websites, landing pages and portfolio platforms with modern UI and strong performance.",
        deliverables: ["Design implementation", "Responsive layout", "Deployment setup"],
    },
    {
        title: "FiveM Script Development",
        detail: "Custom scripts, existing resource optimization and stable server-side integration for FiveM projects.",
        deliverables: ["Custom scripting", "Bug fixes", "Performance tuning"],
    },
];

export default function ServicesPage() {
    return (
        <>
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "Service",
                provider: {
                    "@type": "Person",
                    name: "vezironi",
                    url: SITE_URL,
                },
                serviceType: ["Website Development", "FiveM Script Development"],
                areaServed: "Worldwide",
                url: `${SITE_URL}/services`,
            }}
        />
        <Navbar />
            <main className="container mx-auto min-h-screen px-12 py-8">
                <section className="relative w-full overflow-hidden">
                    <div className="relative flex items-center justify-between mb-5">
                        <h1 className="text-lg uppercase text-neutral-50">
                            <span className="tracking-[0.02px] text-blue-500">{"//"}</span> Services
                        </h1>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Offerings</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {services.map((service) => (
                            <article
                                key={service.title}
                                className="border border-neutral-400/20 border-dashed p-5 hover:border-neutral-300/70 hover:bg-neutral-400/5 transition-all duration-200"
                            >
                                <p className="text-base text-neutral-100">{service.title}</p>
                                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{service.detail}</p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {service.deliverables.map((item) => (
                                        <span
                                            key={item}
                                            className="border border-neutral-400/20 border-dashed px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
