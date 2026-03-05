export type LanyardResponse = {
    data: {
        discord_user: {
            id: string;
            avatar: string;
            username: string;
            discriminator: string;
            public_flags: number;
        };
        activities: {
            id: string;
            name: string;
            type: number;
            state: string;
        }[];
        listening_to_spotify: boolean;
        discord_status: "online" | "idle" | "dnd" | "offline";
        spotify: {
            track_id: string;
            timestamps: {
                start: number;
                end: number;
            };
            song: string;
            artist: string;
            album_art_url: string;
        } | null;
    };
};

export type GithubRepo = {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    fork: boolean;
};

export type KnownItem = {
    name: string;
    icon: string;
};
