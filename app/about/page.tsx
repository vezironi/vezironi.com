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
        category: "PC",
        name: "Custom-built Desktop",
        note: "Intel i5-13400F CPU, 32GB DDR5 RAM, NVIDIA RTX 4060TI GPU",
        href: "#",
    },
    {
        category: "Monitor",
        name: "LG UltraGear 27GS75Q-B",
        note: "27-inch 180Hz 1ms 1440p gaming monitor",
        href: "https://www.vatanbilgisayar.com/lg-27-ultragear-27gs75q-b-apd-1ms-180hz-full-hd-ips-gaming-monitor.html",
    },
    {
        category: "Secondary Monitor",
        name: "Twisted Minds TM27FHD100IPS",
        note: "27-inch 100Hz 1ms 1080p office monitor",
        href: "#",
    },
    {
        category: "Keyboard",
        name: "Logitech G G915 X LIGHTSPEED TKL",
        note: "Low-profile wireless mechanical keyboard",
        href: "https://www.vatanbilgisayar.com/logitech-g-g915-x-lightspeed-tkl-us-layout-kablosuz-oyuncu-klavyesi-siyah.html",
    },
    {
        category: "Secondary Keyboard",
        name: "AKKO 5075B Plus Air",
        note: "Piano Pro Switch RGB wireless mechanical keyboard",
        href: "https://en.akkogear.com/product/5075b-plus-air-mechanical-keyboard/",
    },
    {
        category: "Mouse",
        name: "ATK Blazing Sky U2 Ultimate",
        note: "PAW 3950 Ultra sensor, Nordic 52840 wireless chipset, 8000Hz polling rate",
        href: "https://www.atk.store/products/atk-blazing-sky-u2-v2-superlight-wireless-gaming-mouse",
    },
    {
        category: "Microphone",
        name: "FIFINE AmpliGame AM8W USB/XLR",
        note: "Versatile microphone with both USB and XLR connectivity options",
        href: "https://fifinemicrophone.com/products/fifine-ampligame-am8-microphone",
    },
    {
        category: "Audio Mixer",
        name: "MaonoCaster AMG1 NEO Audio Mixer",
        note: "Compact audio mixer designed for streamers, podcasters and content creators with multiple input options and built-in sound effects",
        href: "https://www.maono.com/collections/maonocaster-audio-interface-and-mixer/products/maonocaster-amg1-neo-audio-mixer-for-game-streaming",
    },
    {
        category: "Headphones",
        name: "HyperX Cloud III Wireless",
        note: "Wireless gaming headphones with superior sound quality and comfort",
        href: "https://row.hyperx.com/products/hyperx-cloud-iii-wireless-gaming-headset",
    },
    {
        category: "Headphones",
        name: "EPZ G30 Gaming IEMs",
        note: "High-fidelity in-ear monitors designed for gaming with a hybrid driver configuration for immersive sound",
        href: "https://epzaudio.com/products/epz-g30-hybrid-1dd-1ba-hifi-gaming-iems",
    }
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
