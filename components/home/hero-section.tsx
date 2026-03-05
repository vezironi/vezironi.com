import Image from "next/image";

type HeroSectionProps = {
    avatarUrl: string;
    discordStatus: string;
    userDescription: string | null;
};

export default function HeroSection({ avatarUrl, discordStatus, userDescription }: HeroSectionProps) {
    return (
        <section className="relative h-max w-full flex items-center justify-between py-12 px-1.5 group/hero">
            <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                    <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t border-l border-neutral-400/50" />
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 border-t border-r border-neutral-400/50" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 border-b border-l border-neutral-400/50" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b border-r border-neutral-400/50" />

                    <Image
                        src={avatarUrl}
                        alt="Profile Picture"
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover grayscale-15 hover:grayscale-0 transition-all duration-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600">- {discordStatus}</span>
                    <p className="text-xl font-medium tracking-tight text-neutral-50 leading-none">No.1</p>
                    <p className="text-sm text-neutral-500 font-mono mt-0.5">{userDescription}</p>
                </div>
            </div>

            <div className="flex flex-col items-stretch gap-2 min-w-35">
                <button className="relative group/btn flex items-center justify-between border border-neutral-400/25 border-dashed px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:border-neutral-400/60 hover:text-neutral-100 cursor-pointer transition-all duration-200">
                    Contact
                    <i className="fa-light fa-arrow-up-right text-[10px] opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </button>

                <button className="relative group/btn flex items-center justify-between bg-blue-600 px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-white hover:bg-blue-500 cursor-pointer transition-all duration-200 overflow-hidden">
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-in-out" />
                    <span className="relative">Hire Me</span>
                    <i className="relative fa-light fa-arrow-up-right text-[10px] opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </button>
            </div>
        </section>
    );
}
