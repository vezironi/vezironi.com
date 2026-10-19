import type { Post, Settings } from "@/lib/content/queries";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";
import { localeUrl } from "./metadata";

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  // Escape "<" so content can never close the script tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

const personId = () => `${env.siteUrl}/#person`;

export function personJsonLd(settings: Settings, locale: Locale): Json[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId(),
      name: settings.name,
      jobTitle: settings.title,
      description: settings.bio,
      url: localeUrl(locale, ""),
      email: `mailto:${settings.links.email}`,
      sameAs: [settings.links.github, settings.links.x, `https://discord.com/users/${settings.links.discordId}`],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.name,
      url: env.siteUrl,
      inLanguage: ["tr-TR", "en-US"],
      author: { "@id": personId() },
    },
  ];
}

export function blogPostingJsonLd(post: Post, locale: Locale, authorName: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    keywords: post.tags.join(", "),
    url: localeUrl(locale, `/blog/${post.slug}`),
    mainEntityOfPage: localeUrl(locale, `/blog/${post.slug}`),
    author: { "@type": "Person", "@id": personId(), name: authorName },
  };
}

export function galleryJsonLd(name: string, locale: Locale, images: { url: string; caption: string | null }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name,
    url: localeUrl(locale, "/gallery"),
    image: images.map((i) => ({
      "@type": "ImageObject",
      contentUrl: i.url.startsWith("http") ? i.url : `${env.siteUrl}${i.url}`,
      ...(i.caption ? { caption: i.caption } : {}),
    })),
  };
}

export function contactPageJsonLd(name: string, locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    url: localeUrl(locale, "/contact"),
    about: { "@id": personId() },
  };
}
