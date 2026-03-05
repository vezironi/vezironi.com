import Navbar from "@/components/navbar";
import JsonLd from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
    title: "About",
    description: "Who I am and how I build modern web products.",
    alternates: {
        canonical: "/about",
    },
};

const focusAreas = [
    "Fast frontend architecture",
    "Business websites and portfolio systems",
    "FiveM script development and refactoring",
    "Long-term maintainable codebase setup",
];

const equipmentItems = [
    {
        category: "Laptop",
        name: "MacBook Pro / Custom Setup",
        note: "Main development machine",
        href: "#",
    },
    {
        category: "Monitor",
        name: "27-inch 1440p",
        note: "Primary workspace display",
        href: "#",
    },
    {
        category: "Keyboard",
        name: "Mechanical Keyboard",
        note: "Daily coding driver",
        href: "#",
    },
    {
        category: "Mouse",
        name: "Performance Wireless Mouse",
        note: "Design and navigation",
        href: "#",
    },
    {
        category: "Audio",
        name: "Studio Headphones",
        note: "Focus and calls",
        href: "#",
    },
    {
        category: "Other",
        name: "Desk + Lighting Setup",
        note: "Comfort and consistency",
        href: "#",
    },
];

export default function AboutPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    name: "About vezironi",
                    url: `${SITE_URL}/about`,
                    mainEntity: {
                        "@type": "Person",
                        name: "vezironi",
                        url: SITE_URL,
                    },
                }}
            />
            <Navbar />
            <main className="container mx-auto min-h-screen px-12 py-8">
                <section className="relative w-full overflow-hidden">
                    <div className="relative flex items-center justify-between mb-5">
                        <h1 className="text-lg uppercase text-neutral-50">
                            <span className="tracking-[0.02px] text-blue-500">{"//"}</span> About
                        </h1>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Profile</span>
                    </div>

                    <div className="border border-neutral-400/20 border-dashed p-5 md:p-6">
                        <p className="text-sm text-neutral-300 leading-7 max-w-4xl">
                            I build modern web products and custom backend-focused systems with a strong focus on clarity,
                            performance and long-term maintainability. My goal is simple: ship reliable work that looks
                            clean, loads fast and stays easy to improve as your product grows.
                        </p>
                        <p className="text-sm text-neutral-300 leading-7 max-w-4xl mt-3">
                            I usually work on portfolio sites, business websites, custom interfaces and FiveM server logic.
                            In every project, I keep the same approach: understand the core need first, simplify the
                            technical structure, then deliver a stable and scalable implementation.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <section className="border border-neutral-400/20 border-dashed p-4 md:p-5">
                            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Focus Areas</p>
                            <ul className="mt-3 space-y-2">
                                {focusAreas.map((item) => (
                                    <li key={item} className="text-sm text-neutral-300 flex items-start gap-2">
                                        <span className="text-blue-400 mt-0.5">+</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="border border-neutral-400/20 border-dashed p-4 md:p-5">
                            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">How I Work</p>
                            <div className="mt-3 space-y-3">
                                <div>
                                    <p className="text-sm text-neutral-100">1. Discovery</p>
                                    <p className="text-xs text-neutral-400 mt-1">Define the actual problem, not just the requested feature.</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-100">2. Build</p>
                                    <p className="text-xs text-neutral-400 mt-1">Create modular and readable implementation with practical UX decisions.</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-100">3. Deliver</p>
                                    <p className="text-xs text-neutral-400 mt-1">Ship stable output with a structure that is easy to maintain.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <section className="border border-neutral-400/20 border-dashed p-4 md:p-5 mt-4">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Equipment</p>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Setup</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {equipmentItems.map((item) => (
                                <article
                                    key={item.category + item.name}
                                    className="border border-neutral-400/20 border-dashed p-3 hover:border-neutral-300/60 hover:bg-neutral-400/5 transition-all duration-200"
                                >
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-blue-400">{item.category}</p>
                                    <p className="text-sm text-neutral-100 mt-1">{item.name}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{item.note}</p>

                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-100 transition-colors duration-200"
                                    >
                                        Product Link
                                        <i className="fa-light fa-arrow-up-right text-[10px]" />
                                    </a>
                                </article>
                            ))}
                        </div>
                    </section>

                </section>
            </main>
        </>
    );
}
