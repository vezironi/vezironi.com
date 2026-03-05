export default function SiteFooter() {
    return (
        <footer className="relative w-full mt-10 pb-10 pt-6">
            <div className="mt-6 border border-neutral-400/20 border-dashed p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-neutral-200 tracking-tight">Vezironi</p>
                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                            Building modern web experiences.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="https://github.com/vezironi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/foot border border-neutral-400/20 border-dashed px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-100 hover:border-neutral-300/70 transition-all duration-200"
                        >
                            GitHub
                            <i className="fa-light fa-arrow-up-right ml-2 text-[10px] opacity-60 group-hover/foot:opacity-100 group-hover/foot:translate-x-0.5 group-hover/foot:-translate-y-0.5 transition-transform duration-200" />
                        </a>
                        <a
                            href="mailto:hello@vezironi.com"
                            className="group/foot border border-neutral-400/20 border-dashed px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-100 hover:border-neutral-300/70 transition-all duration-200"
                        >
                            Contact
                            <i className="fa-light fa-arrow-up-right ml-2 text-[10px] opacity-60 group-hover/foot:opacity-100 group-hover/foot:translate-x-0.5 group-hover/foot:-translate-y-0.5 transition-transform duration-200" />
                        </a>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-400/15 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                        © {new Date().getFullYear()} Vezironi. All rights reserved.
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                        Next.js • TypeScript • Tailwind
                    </p>
                </div>
            </div>
        </footer>
    );
}
