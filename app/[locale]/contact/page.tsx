import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contactPageJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ContactForm } from "@/components/contact/contact-form";
import { Section } from "@/components/site/section";
import { SocialLinks } from "@/components/site/social-links";
import { getSettings } from "@/lib/content/queries";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/contact", title: dict.meta.contactTitle, description: dict.meta.contactDescription });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const settings = await getSettings(locale);

  return (
    <main>
      <JsonLd data={contactPageJsonLd(dict.meta.contactTitle, locale)} />
      <div className="px-4 pt-10 pb-6 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{dict.contact.heading}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">{dict.contact.intro}</p>
      </div>
      <Section title={dict.contact.message}>
        <div className="relative">
          <ContactForm labels={dict.contact} />
        </div>
      </Section>
      <Section title={dict.contact.orReach.replace(/:$/, "")}>
        <SocialLinks links={settings.links} />
      </Section>
    </main>
  );
}
