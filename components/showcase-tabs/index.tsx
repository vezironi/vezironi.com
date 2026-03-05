"use client";

import Image from "next/image";
import { useState } from "react";

type ProjectItem = {
    id: string;
    title: string;
    subtitle: string;
    bannerStyle: string;
    bannerImage?: string;
    stack: string;
    href: string;
    status: string;
};

type ReferenceItem = {
    id: string;
    brand: string;
    project: string;
    note: string;
    bannerStyle: string;
    bannerImage?: string;
    logoImage?: string;
    href: string;
    year: string;
};

type PublicProjectItem = {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    htmlUrl: string;
    updatedAt: string;
};

type ShowcaseTabsProps = {
    publicProjects: PublicProjectItem[];
};

const projectItems: ProjectItem[] = [
    {
        id: "0resmon_website",
        title: "0Resmon Studio Website",
        subtitle: "Official website for 0Resmon Studio, showcasing their FiveM Tebex store design and integration services.",
        bannerStyle: "linear-gradient(135deg, #be123c 0%, #111827 70%)",
        bannerImage: "/projects/0resmon_banner.png",
        stack: "Twig / JavaScript / Tailwind / GSAP",
        href: "https://0resmon.tebex.io/",
        status: "Completed",
    },
    {
        id: "whitebilisim_website",
        title: "White Bilişim Website",
        subtitle: "Official website for White Bilişim, showcasing their web and VDS hosting services.",
        bannerStyle: "linear-gradient(135deg, #6d28d9 0%, #111827 70%)",
        bannerImage: "/projects/whitebilisim_banner.png",
        stack: "AstroJS / ReactJS / Tailwind",
        href: "https://whitebilisim.com/",
        status: "Completed",
    },
];

const referenceItems: ReferenceItem[] = [
    {
        id: "0resmon",
        brand: "0Resmon Studio",
        project: "Fivem Tebex Store",
        note: "Custom Tebex store design and integration for a popular FiveM server.",
        bannerStyle: "linear-gradient(135deg, #be123c 0%, #111827 70%)",
        bannerImage: "/references/0resmon_banner.webp",
        logoImage: "/references/0resmon_logo.webp",
        href: "https://0resmon.tebex.io/",
        year: "2024-2026",
    },
    {
        id: "whitebilisim",
        brand: "White Bilişim",
        project: "Web and VDS hosting services",
        note: "Provided web hosting and virtual dedicated server (VDS) services for various clients, ensuring reliable and scalable hosting solutions.",
        bannerStyle: "linear-gradient(135deg, #6d28d9 0%, #111827 70%)",
        bannerImage: "/references/whitebilisim_banner.webp",
        logoImage: "/references/whitebilisim_logo.webp",
        href: "https://whitebilisim.com/",
        year: "2025-2025",
    },
    {
        id: "fast",
        brand: "Fast Script",
        project: "Fivem Tebex Store",
        note: "Custom Tebex store design and integration for a popular FiveM server.",
        bannerStyle: "linear-gradient(135deg, #be123c 0%, #111827 70%)",
        bannerImage: "/references/fastscript_banner.webp",
        logoImage: "/references/fastscript_logo.webp",
        href: "https://fastscripts.tebex.io/",
        year: "2025-2025",
    },
    {
        id: "borp",
        brand: "BORP",
        project: "Fivem Roleplay Server",
        note: "Provided custom script development and server optimization for a growing FiveM roleplay community.",
        bannerStyle: "linear-gradient(135deg, #6d28d9 0%, #111827 70%)",
        bannerImage: "/references/borp_banner.webp",
        logoImage: "/references/borp_logo.webp",
        href: "https://discord.gg/sXQusRBmwh",
        year: "2025-2025",
    },
    {
        id: "night",
        brand: "NightV",
        project: "Fivem Roleplay Server",
        note: "Provided custom script development and server optimization for a growing FiveM roleplay community.",
        bannerStyle: "linear-gradient(135deg, #6d28d9 0%, #111827 70%)",
        bannerImage: "/references/night_banner.webp",
        logoImage: "/references/night_logo.webp",
        href: "https://discord.gg/nightvrp",
        year: "2025-2025",
    },
];

export default function ShowcaseTabs({ publicProjects }: ShowcaseTabsProps) {
    const [activeTab, setActiveTab] = useState<"projects" | "references" | "public">("public");

    return (
        <section className="relative w-full mt-10 overflow-hidden">
            <div className="relative flex items-center justify-between mb-4">
                <h2 className="text-lg uppercase text-neutral-50">
                    <span className="tracking-[0.02px] text-blue-500">{"//"}</span> Showcase
                </h2>

                <div className="flex items-center gap-2 border border-neutral-400/20 border-dashed p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("public")}
                        className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        activeTab === "public"
                            ? "bg-blue-600 text-white"
                            : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700/40"
                        }`}
                    >
                        Public Projects
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("projects")}
                        className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        activeTab === "projects"
                            ? "bg-blue-600 text-white"
                            : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700/40"
                        }`}
                    >
                        Projects
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("references")}
                        className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        activeTab === "references"
                            ? "bg-blue-600 text-white"
                            : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700/40"
                        }`}
                    >
                        References
                    </button>
                </div>
            </div>

            {activeTab === "projects" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projectItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border border-neutral-400/20 border-dashed overflow-hidden hover:border-neutral-300/60 transition-all duration-300"
                        >
                            <div className="h-24 w-full relative" style={{ backgroundImage: item.bannerStyle }}>
                                {item.bannerImage ? (
                                    <Image
                                        src={item.bannerImage}
                                        alt={`${item.title} banner`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="absolute inset-0 h-full w-full object-cover object-top"
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/70 to-transparent" />
                                <div className="absolute left-3 bottom-2 text-[10px] font-mono uppercase tracking-widest text-white/85">
                                    {item.status}
                                </div>
                            </div>

                            <div className="p-3">
                                <p className="text-sm font-medium text-neutral-100 truncate">{item.title}</p>
                                <p className="text-xs text-neutral-500 font-mono mt-1 truncate">{item.stack}</p>
                                <p className="text-xs text-neutral-400 mt-3 line-clamp-2">{item.subtitle}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {activeTab === "references" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {referenceItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border border-neutral-400/20 border-dashed overflow-hidden hover:border-neutral-300/60 transition-all duration-300"
                        >
                            <div className="h-24 w-full relative" style={{ backgroundImage: item.bannerStyle }}>
                                {item.bannerImage ? (
                                    <Image
                                        src={item.bannerImage}
                                        alt={`${item.brand} banner`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/70 to-transparent" />
                                <div className="absolute left-3 bottom-2 text-[10px] font-mono uppercase tracking-widest text-white/85">
                                    {item.year}
                                </div>
                            </div>

                            <div className="p-3">
                                <div className="flex items-center gap-2">
                                    {item.logoImage ? (
                                        <Image
                                            src={item.logoImage}
                                            alt={`${item.brand} logo`}
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 rounded-sm object-cover border border-neutral-600/40"
                                        />
                                    ) : null}
                                    <p className="text-sm font-medium text-neutral-100 truncate">{item.brand}</p>
                                </div>
                                <p className="text-xs text-neutral-500 font-mono mt-1 truncate">{item.project}</p>
                                <p className="text-xs text-neutral-400 mt-3 line-clamp-2">{item.note}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {activeTab === "public" && (
                <>
                {publicProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {publicProjects.map((repo) => (
                            <a
                                key={repo.id}
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/project border border-neutral-400/20 border-dashed p-3 hover:border-neutral-300/60 hover:bg-neutral-400/5 transition-all duration-200"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-medium text-neutral-100 tracking-tight truncate">{repo.name}</p>
                                    <i className="fa-light fa-arrow-up-right text-[10px] text-neutral-500 group-hover/project:text-neutral-200 group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5 transition-all duration-200" />
                                </div>

                                <p className="text-xs text-neutral-500 font-mono mt-2 line-clamp-2 min-h-8">
                                    {repo.description ?? "No description provided."}
                                </p>

                                <div className="flex items-center gap-4 mt-3 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                                    <span>{repo.language}</span>
                                    <span>Stars {repo.stars}</span>
                                    <span>Forks {repo.forks}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500 font-mono">Public projects could not be loaded right now.</p>
                )}
            </>
        )}
        </section>
    );
}