import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { GameProjects } from "@/components/home/game-projects";
import { Section } from "@/components/site/section";
import { getGameProjects } from "@/lib/content/queries";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[locale]/games">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const games = await getGameProjects(locale);
  return buildMetadata({
    locale,
    path: "/games",
    title: dict.meta.gamesTitle,
    description: dict.meta.gamesDescription,
    noindex: games.length === 0,
  });
}

export default async function GamesPage({ params }: PageProps<"/[locale]/games">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const games = await getGameProjects(locale);

  return (
    <main>
      <div className="px-4 pt-10 pb-6 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{dict.meta.gamesTitle}</h1>
        <p className="mt-2 text-sm text-muted">{dict.meta.gamesDescription}</p>
      </div>
      <Section title={dict.sections.games} meta={String(games.length).padStart(2, "0")}>
        {games.length === 0 ? (
          <p className="text-sm text-subtle">{dict.games.empty}</p>
        ) : (
          <GameProjects games={games} locale={locale} priority />
        )}
      </Section>
    </main>
  );
}
