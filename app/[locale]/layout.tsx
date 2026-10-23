import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { env } from "@/lib/env";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/footer";
import { GuncelBantBanner } from "@/components/site/guncel-bant-banner";
import { Header } from "@/components/site/header";
import { ThemeProvider } from "@/components/site/theme-provider";
import { CommandMenu, type CommandItems } from "@/components/site/command-menu";
import { getGallery, getPosts, getProjects, getSettings } from "@/lib/content/queries";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: dict.meta.siteTitle, template: "%s — Vezir Oni" },
    description: dict.meta.siteDescription,
    authors: [{ name: "Vezir Oni", url: env.siteUrl }],
    creator: "Vezir Oni",
  };
}

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [settings, gallery, year, posts, projects] = await Promise.all([
    getSettings(locale),
    getGallery(locale),
    currentYear(),
    getPosts(locale),
    getProjects(locale),
  ]);
  const commandItems: CommandItems = {
    posts: posts.map(({ slug, title }) => ({ slug, title })),
    projects: projects.map(({ name, url }) => ({ name, url })),
    hasGallery: gallery.length > 0,
    email: settings.links.email,
  };

  return (
    <html lang={locale} className={`${jakarta.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col overflow-x-clip font-sans">
        <ThemeProvider>
          <GuncelBantBanner />
          <Header
            locale={locale}
            dict={dict}
            hasGallery={gallery.length > 0}
            commandMenu={<CommandMenu locale={locale} dict={dict} items={commandItems} />}
          />
          <div className="mx-auto w-full max-w-3xl flex-1 border-x border-line">{children}</div>
          <Footer settings={settings} dict={dict} locale={locale} year={year} hasGallery={gallery.length > 0} />
        </ThemeProvider>
        {/* The analytics script is served by Vercel only; skip it elsewhere to avoid a 404. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
