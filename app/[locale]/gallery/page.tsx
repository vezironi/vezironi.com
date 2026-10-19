import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { galleryJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Section } from "@/components/site/section";
import { getGallery } from "@/lib/content/queries";
import { formatDate } from "@/lib/format";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const items = await getGallery(locale);
  return buildMetadata({
    locale,
    path: "/gallery",
    title: dict.meta.galleryTitle,
    description: dict.meta.galleryDescription,
    noindex: items.length === 0,
  });
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const items = await getGallery(locale);
  const dates = Object.fromEntries(items.filter((i) => i.takenAt).map((i) => [i.id, formatDate(i.takenAt!, locale)]));

  return (
    <main>
      {items.length > 0 && (
        <JsonLd data={galleryJsonLd(dict.meta.galleryTitle, locale, items.map((i) => ({ url: i.imageUrl, caption: i.caption })))} />
      )}
      <div className="px-4 pt-10 pb-6 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{dict.meta.galleryTitle}</h1>
        <p className="mt-2 text-sm text-muted">{dict.meta.galleryDescription}</p>
      </div>
      <Section title={dict.meta.galleryTitle} meta={String(items.length).padStart(2, "0")}>
        {items.length === 0 ? (
          <p className="text-sm text-subtle">{dict.gallery.empty}</p>
        ) : (
          <GalleryGrid items={items} labels={dict.gallery} dates={dates} />
        )}
      </Section>
    </main>
  );
}
