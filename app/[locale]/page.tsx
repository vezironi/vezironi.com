import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, personJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { Experience } from "@/components/home/experience";
import { GitHubGraph } from "@/components/home/github-graph";
import { DiscordCard } from "@/components/home/status-discord";
import { SpotifyCard } from "@/components/home/status-spotify";
import { getContributions } from "@/lib/github";
import { getNpmPackage } from "@/lib/npm";
import { Intro } from "@/components/home/intro";
import { PostList } from "@/components/home/latest-posts";
import { GameProjects } from "@/components/home/game-projects";
import { Projects } from "@/components/home/projects";
import { Packages } from "@/components/home/packages";
import { References } from "@/components/home/references";
import { Stack } from "@/components/home/stack";
import { VOFigure } from "@/components/home/vo-figure";
import { Section } from "@/components/site/section";
import { getExperiences, getGameProjects, getPackages, getPosts, getProjects, getReferences, getSettings, getStack } from "@/lib/content/queries";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/** Game projects shown on the home page; the rest are on /games. */
const HOME_GAMES = 4;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    ...buildMetadata({ locale, path: "", title: dict.meta.siteTitle, description: dict.meta.siteDescription }),
    title: { absolute: dict.meta.siteTitle },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [settings, projects, games, packages, references, experiences, stack, posts, contributions] = await Promise.all([
    getSettings(locale),
    getProjects(locale),
    getGameProjects(locale),
    getPackages(locale),
    getReferences(),
    getExperiences(locale),
    getStack(),
    getPosts(locale, { limit: 3 }),
    getContributions("vezironi"),
  ]);
  const npm = Object.fromEntries(await Promise.all(packages.map(async (p) => [p.name, await getNpmPackage(p.name)] as const)));

  return (
    <main>
      <JsonLd data={personJsonLd(settings, locale)} />
      <VOFigure caption={dict.figure.caption} note={dict.figure.note} />
      <Section flush>
        <Intro settings={settings} />
      </Section>
      <Section id="status">
        <div className="grid gap-3 sm:grid-cols-2">
          <DiscordCard userId={settings.links.discordId} username={settings.links.discord} labels={dict.status} />
          <SpotifyCard labels={dict.status} />
        </div>
      </Section>
      <Section id="projects" title={dict.sections.projects} meta={String(projects.length).padStart(2, "0")}>
        <Projects projects={projects} locale={locale} />
      </Section>
      {games.length > 0 && (
        <Section
          id="games"
          title={dict.sections.games}
          meta={
            <Link href={`/${locale}/games`} className="transition-colors hover:text-accent">
              {dict.sections.allGames}
            </Link>
          }
        >
          <GameProjects games={games.slice(0, HOME_GAMES)} locale={locale} />
        </Section>
      )}
      {packages.length > 0 && (
        <Section id="packages" title={dict.sections.packages} meta={String(packages.length).padStart(2, "0")}>
          <Packages packages={packages} npm={npm} locale={locale} labels={dict.packages} />
        </Section>
      )}
      <Section id="references" title={dict.sections.references} meta={String(references.length).padStart(2, "0")}>
        <References references={references} />
      </Section>
      <Section id="experience" title={dict.sections.experience}>
        <Experience items={experiences} locale={locale} />
      </Section>
      <Section id="stack" title={dict.sections.stack}>
        <Stack tech={stack.tech} tools={stack.tools} labels={{ tech: dict.sections.tech, tools: dict.sections.tools }} />
      </Section>
      <Section id="github" title={dict.sections.github} meta={dict.sections.githubMeta}>
        <GitHubGraph
          data={contributions}
          locale={locale}
          labels={{ total: dict.sections.githubTotal, unavailable: dict.sections.githubUnavailable }}
          profileUrl={settings.links.github}
        />
      </Section>
      <Section
        id="blog"
        title={dict.sections.blog}
        meta={
          <Link href={`/${locale}/blog`} className="transition-colors hover:text-accent">
            {dict.sections.allPosts}
          </Link>
        }
      >
        <PostList posts={posts} locale={locale} empty={dict.blog.empty} />
      </Section>
    </main>
  );
}
