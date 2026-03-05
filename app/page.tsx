import Navbar from "@/components/navbar";
import JsonLd from "@/components/seo/json-ld";
import ShowcaseTabs from "@/components/showcase-tabs";
import { KNOWN_TECHS, KNOWN_TOOLS } from "@/components/home/constants";
import PinnedProject from "@/components/home/pinned-project";
import ExperienceSection from "@/components/home/experience-section";
import HeroSection from "@/components/home/hero-section";
import IconListSection from "@/components/home/icon-list-section";
import ServicesSection from "@/components/home/services-section";
import SiteFooter from "@/components/home/site-footer";
import SpotifySection from "@/components/home/spotify-section";
import StatusStrip from "@/components/home/status-strip";
import type { GithubRepo, LanyardResponse } from "@/components/home/types";
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Portfolio`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Portfolio`,
    description: SITE_DESCRIPTION,
  },
};

async function getLanyard() {
  const res = await fetch(absoluteUrl("/api/lanyard"), {
    cache: "no-store",
  });

  return res.json() as Promise<LanyardResponse>;
}

async function getGithubProjects() {
  const res = await fetch("https://api.github.com/users/vezironi/repos?sort=updated&per_page=100", {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    return [] as GithubRepo[];
  }

  const repos = (await res.json()) as GithubRepo[];

  return repos
    .filter((repo) => !repo.fork)
    .filter((repo) => Boolean(repo.language))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);
}

export default async function Home() {
  const discordData = await getLanyard();
  const publicProjects = await getGithubProjects();

  const userDescription =
    discordData.data?.activities?.find((activity) => activity.id === "custom")?.state ?? null;

  const avatarUrl = `https://cdn.discordapp.com/avatars/${discordData.data.discord_user.id}/${discordData.data.discord_user.avatar}.webp?size=512`;
  const mappedPublicProjects = publicProjects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    language: project.language,
    stars: project.stargazers_count,
    forks: project.forks_count,
    htmlUrl: project.html_url,
    updatedAt: project.updated_at,
  }));

  const pinnedProjects = [
    {
      id: "vezironi-com",
      name: "vezironi.com",
      description: "Personal portfolio website and showcase platform.",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      htmlUrl: "https://github.com/vezironi/vezironi.com",
    },
    {
      id: "no1-legaljobs",
      name: "no1-legaljobs",
      description: "Legal jobs platform project.",
      language: "Lua",
      stars: 0,
      forks: 0,
      htmlUrl: "https://github.com/vezironi/no1-legaljobs",
    },
    {
      id: "no1-multicharacter",
      name: "no1-multicharacter",
      description: "FiveM multi-character system project.",
      language: "Lua",
      stars: 0,
      forks: 0,
      htmlUrl: "https://github.com/vezironi/no1-multicharacter",
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "vezironi",
          url: SITE_URL,
          sameAs: ["https://github.com/vezironi"],
          knowsAbout: ["Next.js", "TypeScript", "FiveM", "Lua", "Web Development"],
        }}
      />
      <Navbar />
      <main className="container mx-auto flex flex-col min-h-screen px-12">
        <HeroSection
          avatarUrl={avatarUrl}
          discordStatus={discordData.data.discord_status}
          userDescription={userDescription}
        />

        <StatusStrip />

        <SpotifySection
          isListening={discordData.data.listening_to_spotify}
          spotify={discordData.data.spotify}
        />

        <PinnedProject projects={pinnedProjects} />

        <ShowcaseTabs publicProjects={mappedPublicProjects} />

        <IconListSection
          title="Languages"
          label="Known Stack"
          items={KNOWN_TECHS}
          gridClassName="grid grid-cols-2 md:grid-cols-4 gap-3"
          emptyText="Known languages could not be loaded right now."
        />

        <IconListSection
          title="Technologies"
          label="Tooling"
          items={KNOWN_TOOLS}
          gridClassName="grid grid-cols-2 md:grid-cols-3 gap-3"
          emptyText="Known technologies could not be loaded right now."
        />

        <ServicesSection />

        <ExperienceSection />

        <SiteFooter />
      </main>
    </>
  );
}
