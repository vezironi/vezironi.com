import Image from "next/image";

type SpotifyData = {
    track_id: string;
    song: string;
    artist: string;
    album_art_url: string;
};

type SpotifySectionProps = {
    isListening: boolean;
    spotify: SpotifyData | null;
};

export default function SpotifySection({ isListening, spotify }: SpotifySectionProps) {
    if (!isListening || !spotify) {
        return null;
    }

    return (
        <section className="relative w-full border border-green-400/30 border-dashed p-4 overflow-hidden group">
            <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                        <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-green-400/70" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-green-400/70" />
                        <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-green-400/70" />
                        <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-green-400/70" />
                        <Image
                            src={spotify.album_art_url}
                            alt="Album Art"
                            width={88}
                            height={88}
                            className="w-22 h-22 object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-green-400/60 font-mono">Now Playing</span>
                        </div>

                        <p className="text-base font-medium text-green-300 truncate leading-tight">{spotify.song}</p>
                        <p className="text-sm text-green-400/60 truncate font-mono">{spotify.artist}</p>
                    </div>
                </div>

                <a
                    href={`https://open.spotify.com/track/${spotify.track_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative shrink-0 group/btn border border-green-400/40 border-dashed px-4 py-2.5 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-green-400 hover:bg-green-400/10 hover:border-green-400/80 hover:text-green-300 transition-all duration-200"
                >
                    <i className="fa-brands fa-spotify text-sm" />
                    <span>Listen</span>
                    <i className="fa-light fa-arrow-up-right text-[10px] opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </a>
            </div>
        </section>
    );
}
