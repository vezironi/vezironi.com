import { SocialLinks } from "@/components/site/social-links";
import type { Settings } from "@/lib/content/queries";

export function Intro({ settings }: { settings: Settings }) {
  return (
    <div className="px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{settings.name}</h1>
      <p className="mt-1 font-mono text-sm text-accent">{settings.title}</p>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted text-pretty">{settings.bio}</p>
      <div className="mt-5">
        <SocialLinks links={settings.links} />
      </div>
    </div>
  );
}
