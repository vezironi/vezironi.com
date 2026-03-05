"use client";

import { useState } from "react";

type ProjectItem = {
    id: string;
    title: string;
    subtitle: string;
    bannerStyle: string;
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
        id: "project-1",
        title: "Project Name",
        subtitle: "Short project summary you can update later.",
        bannerStyle: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 70%)",
        stack: "Next.js / TypeScript / Tailwind",
        href: "#",
        status: "In Progress",
    },
    {
        id: "project-2",
        title: "Landing System",
        subtitle: "Reusable page blocks and CMS-ready structure.",
        bannerStyle: "linear-gradient(135deg, #0f766e 0%, #111827 70%)",
        stack: "Astro / Vue / API",
        href: "#",
        status: "Completed",
    },
    {
        id: "project-3",
        title: "Dashboard Kit",
        subtitle: "Admin panel starter with auth and analytics.",
        bannerStyle: "linear-gradient(135deg, #7c2d12 0%, #111827 70%)",
        stack: "React / Express / PostgreSQL",
        href: "#",
        status: "Private",
    },
];

const referenceItems: ReferenceItem[] = [
    {
        id: "ref-1",
        brand: "Brand Name",
        project: "E-commerce Revamp",
        note: "Performance-focused storefront and checkout rebuild.",
        bannerStyle: "linear-gradient(135deg, #6d28d9 0%, #111827 70%)",
        href: "#",
        year: "2026",
    },
    {
        id: "ref-2",
        brand: "Studio Name",
        project: "Portfolio Platform",
        note: "Visual direction, responsive design and deployment.",
        bannerStyle: "linear-gradient(135deg, #be123c 0%, #111827 70%)",
        href: "#",
        year: "2025",
    },
    {
        id: "ref-3",
        brand: "Agency Name",
        project: "Marketing Site",
        note: "Conversion-first redesign with new content flow.",
        bannerStyle: "linear-gradient(135deg, #0369a1 0%, #111827 70%)",
        href: "#",
        year: "2024",
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
                                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/70 to-transparent" />
                                <div className="absolute left-3 bottom-2 text-[10px] font-mono uppercase tracking-widest text-white/85">
                                    {item.year}
                                </div>
                            </div>

                            <div className="p-3">
                                <p className="text-sm font-medium text-neutral-100 truncate">{item.brand}</p>
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