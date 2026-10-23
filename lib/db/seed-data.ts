import { launchPostsSeed } from "./seed-posts";

// Initial content (spec §9). Entries marked DRAFT were written by Claude and
// must be reviewed by the owner before launch.

export const settingsSeed = {
  id: 1,
  name: "Vezir Oni",
  titleTr: "Full Stack Developer",
  titleEn: "Full Stack Developer",
  bioTr:
    "Full Stack Developer ve bağımsız yazılım girişimcisiyim. Web uygulamaları, backend sistemleri ve FiveM scriptleri geliştiriyor; kendi dijital ürünlerimi ve platformlarımı oluşturarak fikirleri ölçeklenebilir, gerçek dünya çözümlerine dönüştürüyorum.",
  // DRAFT translation
  bioEn:
    "I'm a full stack developer and independent software entrepreneur. I build web applications, backend systems and FiveM scripts, and I turn ideas into scalable, real-world solutions by creating my own digital products and platforms.",
  github: "https://github.com/vezironi",
  email: "contact@vezironi.com",
  discordUsername: "vezironi.",
  discordId: "1517800496029630556",
  x: "https://x.com/vezir_oni",
};

// DRAFT: descriptions, tech and years.
export const projectsSeed = [
  {
    name: "Keyra",
    url: "https://keyra.live/",
    slug: "keyra",
    descriptionTr:
      "Windows ve macOS için yerel öncelikli şifre kasası ve abonelik takipçisi. Şifreler, kartlar ve notlar bilgisayarda tek bir şifreli dosyada tutulur; abonelikler ödeme takvimi ve hatırlatıcılarla izlenir.",
    descriptionEn:
      "A local-first password vault and subscription tracker for Windows and macOS. Logins, cards and notes live in one encrypted file on your machine; subscriptions are tracked with payment calendars and reminders.",
    tech: ["Rust", "TypeScript", "React"],
    year: 2026,
  },
  {
    name: "Mazlum Admin",
    url: "https://demo.mazlumadmin.com/",
    slug: "mazlumadmin",
    descriptionTr:
      "FiveM roleplay sunucuları için yönetim paneli: oyuncular, ekonomi, araçlar, meslekler, çeteler, raporlar ve sunucu istatistikleri tek ekranda.",
    descriptionEn:
      "An admin panel for FiveM roleplay servers: players, economy, vehicles, jobs, gangs, reports and server stats on one screen.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Lua"],
    year: 2025,
  },
  {
    name: "Veyra",
    url: "https://veyra.vezironi.com/",
    slug: "veyra",
    descriptionTr:
      "Vue 3 için temalanabilir, erişilebilir ve kullanıma hazır bileşen kütüphanesi. Tailwind CSS v4 ile yazıldı; tema değiştirme ve sınıf bazlı özelleştirme destekler.",
    descriptionEn:
      "A themeable, accessible, ready-to-use component library for Vue 3. Built with Tailwind CSS v4, with theme switching and class-level overrides.",
    tech: ["Vue", "TypeScript", "Tailwind CSS"],
    year: 2026,
  },
  {
    name: "White Bilişim",
    url: "https://whitebilisim.com/",
    slug: "whitebilisim",
    descriptionTr:
      "İstanbul lokasyonlu VDS, fiziksel sunucu ve colocation hizmetleri sunan White Bilişim'in web sitesi ve müşteri platformu.",
    descriptionEn:
      "Website and customer platform for White Bilişim, an Istanbul-based provider of VDS, dedicated servers and colocation.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    year: 2025,
  },
  {
    name: "0Resmon",
    url: "https://0resmon.tebex.io/",
    slug: "0resmon",
    descriptionTr: "FiveM sunucuları için performans odaklı premium scriptlerin satıldığı Tebex mağazası. Full Stack Developer olarak çalıştım.",
    descriptionEn: "A Tebex store selling performance-focused premium FiveM scripts, where I worked as a full stack developer.",
    tech: ["Lua", "JavaScript", "Vue"],
    year: 2024,
  },
  {
    name: "Hype Scripts",
    url: "https://hypescripts.net/",
    slug: "hypescripts",
    descriptionTr: "Kurucusu olduğum premium FiveM script ve paket mağazası.",
    descriptionEn: "The premium FiveM scripts and bundles store I founded.",
    tech: ["Lua", "TypeScript", "Next.js"],
    year: 2026,
  },
  {
    name: "Vatan Sağ Olsun",
    url: "https://vatansagolsun.vezironi.com/",
    slug: "vatansagolsun",
    descriptionTr:
      "2000 yılından bu yana görev başında şehit düşen asker, polis ve diğer kamu görevlilerini anan dijital bir arşiv. 88 binden fazla kaydı yıllara göre listeliyor, her gün o tarihe denk gelen yıl dönümlerini gösteriyor ve herkese açık bir API sunuyor.",
    descriptionEn:
      "A digital memorial for soldiers, police officers and other public servants who have fallen on duty since 2000. It lists more than 88,000 records by year, shows the anniversaries that fall on each day and offers a public API.",
    tech: ["Python", "FastAPI"],
    year: 2026,
  },
];

// DRAFT descriptions.
export const packagesSeed = [
  {
    name: "@vezironi/veyra-ui",
    descriptionTr: "Vue 3 için koyu ve açık temalı bileşen kiti. Tailwind CSS v4 ile yazıldı, Veyra UI'ın npm paketi.",
    descriptionEn: "A Vue 3 component kit with dark and light themes, built with Tailwind CSS v4. The npm package behind Veyra UI.",
    homepageUrl: "https://veyra.vezironi.com/",
    repoUrl: "https://github.com/vezironi/veyra-ui",
  },
];

export const referencesSeed = [
  { name: "0Resmon", file: "0resmon", url: "https://0resmon.tebex.io/" },
  { name: "White Bilişim", file: "whitebilisim", url: "https://whitebilisim.com/" },
  { name: "BORP", file: "borp", url: null },
  { name: "FastScript", file: "fastscript", url: null },
  { name: "Night", file: "night", url: null },
];

// Roles from the owner; descriptions are DRAFT.
export const experiencesSeed = [
  {
    company: "Hype Scripts",
    roleTr: "Kurucu",
    roleEn: "Founder",
    descriptionTr: "FiveM sunucuları için premium script ve paketler geliştirip satan kendi markamı kurdum.",
    descriptionEn: "Founded my own brand that builds and sells premium scripts and bundles for FiveM servers.",
    startYear: 2026,
    endYear: null,
  },
  {
    company: "0Resmon",
    roleTr: "Full Stack Developer",
    roleEn: "Full Stack Developer",
    descriptionTr: "FiveM scriptleri, mağaza altyapısı ve web arayüzleri üzerinde uçtan uca geliştirme yaptım.",
    descriptionEn: "Worked end to end on FiveM scripts, store infrastructure and web interfaces.",
    startYear: 2024,
    endYear: 2026,
  },
  {
    company: "88Studios",
    roleTr: "Full Stack Developer",
    roleEn: "Full Stack Developer",
    descriptionTr: "Stüdyonun web projelerinde frontend ve backend geliştirme yaptım.",
    descriptionEn: "Built frontend and backend features for the studio's web projects.",
    startYear: 2024,
    endYear: 2024,
  },
  {
    company: "HDScripts",
    roleTr: "Kurucu (Tebex mağazası)",
    roleEn: "Founder (Tebex store)",
    descriptionTr: "FiveM scriptleri sattığım kendi Tebex mağazamı açıp yönettim.",
    descriptionEn: "Opened and ran my own Tebex store selling FiveM scripts.",
    startYear: 2023,
    endYear: 2024,
  },
  {
    company: "BiOnluk",
    roleTr: "Freelance Web Developer",
    roleEn: "Freelance Web Developer",
    descriptionTr: "BiOnluk üzerinden müşteriler için web siteleri tasarlayıp geliştirdim.",
    descriptionEn: "Designed and built websites for clients through BiOnluk.",
    startYear: 2022,
    endYear: 2024,
  },
  {
    company: "Kobi Bilişim Güvenlik",
    roleTr: "Siber Güvenlik Stajyeri",
    roleEn: "Cybersecurity Intern",
    descriptionTr: "Siber güvenlik alanında staj yaparak ağ ve sistem güvenliği üzerine deneyim kazandım.",
    descriptionEn: "Gained hands-on experience in network and system security during a cybersecurity internship.",
    startYear: 2021,
    endYear: 2022,
  },
];

export const stackSeed: { category: "tech" | "tool"; name: string; icon: string }[] = [
  { category: "tech", name: "Next.js", icon: "nextdotjs" },
  { category: "tech", name: "Astro", icon: "astro" },
  { category: "tech", name: "React", icon: "react" },
  { category: "tech", name: "Vue", icon: "vuedotjs" },
  { category: "tech", name: "TypeScript", icon: "typescript" },
  { category: "tech", name: "JavaScript", icon: "javascript" },
  { category: "tech", name: "SQL", icon: "mysql" },
  { category: "tech", name: "Lua", icon: "lua" },
  { category: "tech", name: "Express.js", icon: "express" },
  { category: "tool", name: "Docker", icon: "docker" },
  { category: "tool", name: "Postman", icon: "postman" },
  { category: "tool", name: "Termius", icon: "termius" },
  { category: "tool", name: "Figma", icon: "figma" },
  { category: "tool", name: "Git", icon: "git" },
  { category: "tool", name: "GitHub", icon: "github" },
  { category: "tool", name: "HeidiSQL", icon: "heidisql" },
  { category: "tool", name: "MariaDB", icon: "mariadb" },
];

const testPostTr = `Bu yazı, blogun markdown görünümünü baştan sona test etmek için var.

## Liste

- bileşenleri küçük ve odaklı tut
- sunucuda gereğinden fazla veri çekme
- önbelleği bilinçli kullan

## Kod

\`\`\`ts
export async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Veri alınamadı");
  return res.json();
}
\`\`\`

Satır içi kod da çalışır: \`revalidateTag("posts")\`.

## Tablo

| Strateji | En uygun | Not |
| --- | --- | --- |
| SSG | Çoğunlukla statik sayfalar | Hızlı ve önbelleklenebilir |
| ISR | Yarı dinamik içerik | İçerik güncellemeleri için ideal |
| SSR | Çok dinamik veri | Daha fazla sunucu yükü |

## Bağlantı ve görsel

Resmi dokümanlar: [Next.js](https://nextjs.org/docs)

![Örnek görsel](/seed/projects/keyra.webp)

> Performans, tek seferlik numaralardan çok tutarlı alışkanlıklarla ilgilidir.
`;

const testPostEn = `This post exists to test the blog's markdown rendering end to end.

## List

- keep components small and focused
- avoid over-fetching on the server
- use caching intentionally

## Code

\`\`\`ts
export async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
\`\`\`

Inline code works too: \`revalidateTag("posts")\`.

## Table

| Strategy | Best for | Note |
| --- | --- | --- |
| SSG | Mostly static pages | Fast and cacheable |
| ISR | Semi-dynamic content | Great for content updates |
| SSR | Highly dynamic data | More server load |

## Link and image

Official docs: [Next.js](https://nextjs.org/docs)

![Sample image](/seed/projects/keyra.webp)

> Performance is mostly about consistent habits, not one-time tricks.
`;

export const postsSeed = [
  {
    slug: "markdown-test",
    titleTr: "Markdown Test Yazısı",
    titleEn: "Markdown Test Post",
    excerptTr: "Başlık, liste, kod, tablo, bağlantı ve görsel içeren deneme yazısı.",
    excerptEn: "A test post with headings, lists, code, a table, a link and an image.",
    bodyTr: testPostTr,
    bodyEn: testPostEn,
    tags: ["test", "nextjs"],
    publishedAt: "2026-10-19",
    // Kept for checking markdown rendering; not shown on the live site.
    status: "draft" as const,
  },
  ...launchPostsSeed,
];
