# vezironi.com v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual Blueprint-style portfolio for Vezir Oni with live widgets, SEO, and a Discord-gated admin panel, deployable first to `v2.vezironi.com`.

**Architecture:** Next.js App Router with `/[locale]` routes rendered statically from a Postgres database (Drizzle) and refreshed by tag-based on-demand revalidation when the admin saves. Live data (Discord via Lanyard, Spotify via our own API route) loads client-side into fixed-size cards. In local dev without `DATABASE_URL`, Drizzle runs on embedded PGlite and uploads go to `public/uploads`, so the user can run `bun dev` with no external accounts.

**Tech Stack:** Next.js (latest stable, App Router, `proxy.ts`), React 19, TypeScript, Tailwind CSS v4, Bun, Drizzle ORM + `@neondatabase/serverless` / `@electric-sql/pglite`, Vercel Blob, Auth.js v5 (Discord), Resend, `next-themes`, `cmdk`, `unified`/remark/rehype + Shiki, `@vercel/analytics`, Vitest, Playwright (screenshot script only).

**Spec:** `docs/superpowers/specs/2026-10-19-portfolio-v2-design.md`

## Global Constraints

- **Never copy chanhdai.com code, SVG paths, text or assets.** The VO figure is drawn from scratch.
- **No commits until the user has seen the site in dev mode and approved** (user preference). Every "Commit" step below is a gated checkpoint: ask the user first; if they haven't reviewed yet, skip it and keep changes in the working tree.
- Ask the user before any product decision not settled in the spec (user preference: "inisiyatif alma, bana sor").
- Locales: `tr`, `en`. `x-default` → `en`. No `Accept-Language` → `en`. Cookie `NEXT_LOCALE` overrides header.
- Page slugs are identical across locales: `/{locale}`, `/{locale}/blog`, `/{locale}/blog/[slug]`, `/{locale}/gallery`, `/{locale}/contact`. `/admin/**` has no locale, Turkish UI, `noindex`.
- Legacy redirects (301): `/about`, `/services` → `/{locale}`; `/blog`, `/blog/:slug`, `/gallery`, `/contact` → locale-prefixed; legacy blog slugs with no match → `/{locale}/blog`.
- Admin = Discord user ID `1517800496029630556` (`ADMIN_DISCORD_ID`). Check on the server in every admin page and server action.
- Site owner data: name `Vezir Oni`; title `Full Stack Developer`; GitHub `vezironi`; email `contact@vezironi.com`; Discord `vezironi.` / `1517800496029630556`; X `https://x.com/vezir_oni`.
- Theme: system default plus a toggle. Blueprint dark: bg `#0a0a0b`, accent lime `#a3e635`, accent shadow `#3f6212`, dashed section dividers, grid background on the figure.
- Contact rate limit: 3 messages per IP hash per 10 minutes. Mail goes to `CONTACT_TO_EMAIL` with `reply-to` set to the visitor.
- `SITE_NOINDEX=true` (staging) → every page `noindex` and robots `Disallow: /`.
- Spotify cache: ~30 s. GitHub contributions revalidate: 86400 s.

## Review Focus

1. **Spotify edge responses.** `currently-playing` returns 204, returns an ad or podcast with `item: null`, or the token refresh fails. Expected: fall back to recently-played, or hide the card. No 500 error, no layout shift. (Tests: Task 10.)
2. **`Accept-Language` variety.** Headers like `tr-TR,tr;q=0.9,en;q=0.8`, `en-US`, `de`, `*` or empty must resolve correctly, and the cookie must win. (Tests: Task 2.)
3. **One-language blog post.** A post with only TR content appears only under `/tr`. It has no `en` hreflang alternate, is excluded from the EN sitemap, and returns 404 on `/en/blog/slug`. (Tests: Tasks 5 and 15.)
4. **Direct server action call by a non-admin** (or a signed-out user) must be rejected even though the proxy redirect was bypassed. (Tests: Task 16.)
5. **Lanyard unavailable.** If the user is not in the Lanyard server (API `success:false`) or the WebSocket drops, the card shows a neutral "offline" state at the same size and the page must not break. (Tests: Task 10.)

---

## File Structure

```
proxy.ts                         locale negotiation, legacy redirects, optimistic /admin gate
app/layout.tsx                   root <html> shell (lang from params via [locale] layout)
app/globals.css                  Tailwind v4 + Blueprint tokens (light/dark)
app/[locale]/layout.tsx          html lang, ThemeProvider, Header, Footer, Analytics
app/[locale]/page.tsx            home sections in spec §7 order
app/[locale]/blog/page.tsx, blog/[slug]/page.tsx
app/[locale]/gallery/page.tsx
app/[locale]/contact/page.tsx
app/[locale]/opengraph-image.tsx (+ per-route variants)
app/admin/login/page.tsx
app/admin/(panel)/layout.tsx + {page,settings,projects,references,experience,stack,blog,gallery,inbox}/page.tsx
app/api/auth/[...nextauth]/route.ts
app/api/spotify/route.ts
app/sitemap.ts, app/robots.ts
lib/env.ts                       typed env access
lib/i18n/{config.ts,negotiate.ts,dictionaries/tr.ts,dictionaries/en.ts,get-dictionary.ts}
lib/db/{client.ts,schema.ts,seed.ts}
lib/content/{tags.ts,queries.ts,localize.ts}
lib/markdown.ts
lib/seo/{metadata.ts,json-ld.ts}
lib/spotify.ts, lib/github.ts, lib/lanyard.ts
lib/contact/{schema.ts,rate-limit.ts,mailer.ts,action.ts}
lib/auth.ts, lib/admin-guard.ts
lib/storage.ts
lib/admin/actions/{settings,projects,references,experience,stack,posts,gallery,messages}.ts
components/site/{header,footer,theme-toggle,locale-switcher,command-menu,section}.tsx
components/home/{vo-figure,intro,status-discord,status-spotify,projects,references,experience,stack,github-graph,latest-posts}.tsx
components/blog/post-body.tsx
components/gallery/{masonry,lightbox}.tsx
components/contact/contact-form.tsx
components/admin/{field,i18n-field,sortable-list,image-upload,markdown-editor,dropzone}.tsx
public/seed/{projects,logos,references,stack}/*      captured/fetched assets
scripts/{capture-screenshots.ts,fetch-logos.ts,restore-references.ts,spotify-token.ts}
docs/setup.md                    user-facing setup guide (Turkish)
tests/**                         Vitest
```

---

## Phase 1: Public site on seed data (ends with a dev review)

### Task 1: Scaffold, tooling, Blueprint tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `app/globals.css`, `app/layout.tsx`, `.env.example`, `lib/env.ts`
- Modify: `.gitignore` (add `.superpowers/`, `.data/`, `public/uploads/`)
- Test: `tests/env.test.ts`

**Interfaces:**
- Produces: `env` object from `lib/env.ts` exposing `env.siteUrl: string`, `env.noindex: boolean`, `env.databaseUrl?: string`, `env.adminDiscordId: string` (default `"1517800496029630556"`), plus the remaining spec §16 vars as optional strings. Scripts `dev`, `build`, `start`, `lint`, `test` (`vitest run`), `db:seed`.
- CSS tokens on `:root` / `.dark`: `--bg`, `--fg`, `--muted`, `--line`, `--grid`, `--accent`, `--accent-shadow`, exposed to Tailwind via `@theme inline` as `bg-bg`, `text-fg`, `text-muted`, `border-line`, `text-accent`, and so on.

- [ ] **Step 1:** If `bun` is not on PATH, stop and ask the user to install it (`powershell -c "irm bun.sh/install.ps1 | iex"`). Then run `bunx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-bun` (the repo root holds only `.git`, `.gitignore`, `docs`, `.superpowers`; move `docs`/`.superpowers` aside if the CLI refuses a non-empty dir, then move them back). Add `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths` as dev deps.
- [ ] **Step 2: Write failing test** `tests/env.test.ts`: with `NEXT_PUBLIC_SITE_URL` unset, `env.siteUrl === "https://vezironi.com"`; with `SITE_NOINDEX="true"`, `env.noindex === true`; `env.adminDiscordId === "1517800496029630556"` by default.
- [ ] **Step 3:** Run `bun run test tests/env.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 4:** Implement `lib/env.ts`. Write the Blueprint tokens in `app/globals.css`: dark values from Global Constraints; light values are the builder's call (near-white bg, faint grid, darker lime such as `#4d7c0f` for accessible contrast). Load Geist Sans and Geist Mono via `next/font`.
- [ ] **Step 5:** Run `bun run test` and `bun run build`. Expected: PASS, and the build succeeds.
- [ ] **Step 6: Commit checkpoint** (gated, see Global Constraints): `chore: scaffold next app with blueprint tokens`.

### Task 2: i18n routing and proxy

**Files:**
- Create: `lib/i18n/config.ts`, `lib/i18n/negotiate.ts`, `lib/i18n/dictionaries/tr.ts`, `lib/i18n/dictionaries/en.ts`, `lib/i18n/get-dictionary.ts`, `proxy.ts`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx` (placeholder)
- Test: `tests/i18n/negotiate.test.ts`, `tests/proxy.test.ts`

**Interfaces:**
- Produces: `locales = ["tr","en"] as const`; `type Locale`; `defaultLocale: Locale = "en"`; `isLocale(x: string): x is Locale`; `negotiateLocale(acceptLanguage: string | null, cookie?: string): Locale`; `getDictionary(locale: Locale): Dictionary`, where `Dictionary` is typed from `en.ts` and `tr.ts` must satisfy it. Also `resolveRedirect(pathname: string, locale: Locale): string | null`, which returns the legacy/locale redirect target or null. `app/[locale]/layout.tsx` exports `generateStaticParams` → both locales and calls `notFound()` for anything else.

- [ ] **Step 1: Failing tests** for `negotiateLocale`: `"tr-TR,tr;q=0.9,en;q=0.8"`→`tr`; `"en-US"`→`en`; `"de-DE,de;q=0.9"`→`en`; `"de;q=1, tr;q=0.5"`→`tr`; `"*"`→`en`; `null`→`en`; `""`→`en`; cookie `"tr"` with header `"en"`→`tr`; cookie `"xx"` is ignored.
- [ ] **Step 2: Failing tests** for `resolveRedirect`: `/`→`/tr` (locale tr); `/about`→`/tr`; `/services`→`/en` (locale en); `/blog`→`/en/blog`; `/blog/foo`→`/en/blog/foo`; `/gallery`→`/tr/gallery`; `/contact`→`/tr/contact`; `/en/blog`→`null`; `/admin`→`null`; `/api/spotify`→`null`.
- [ ] **Step 3:** Run `bun run test tests/i18n tests/proxy.test.ts`. Expected: FAIL.
- [ ] **Step 4:** Implement the modules above. `proxy.ts` uses `negotiateLocale(req.headers.get("accept-language"), req.cookies.get("NEXT_LOCALE")?.value)` and returns a 301 for legacy paths and a 307 for `/`. Its matcher excludes `_next`, `api`, `admin`, static files and the `opengraph-image` routes. The "legacy slug with no match → blog index" rule lives in the blog post page (Task 11), not here.
- [ ] **Step 5:** Run the tests. Expected: PASS. Run `bun dev`, then `curl -I -H "Accept-Language: tr" http://localhost:3000/` and check for `location: /tr`.
- [ ] **Step 6: Commit checkpoint:** `feat: locale negotiation and legacy redirects`.

### Task 3: Database schema, client, seed

**Files:**
- Create: `lib/db/schema.ts`, `lib/db/client.ts`, `lib/db/seed.ts`, `drizzle.config.ts`
- Test: `tests/db/seed.test.ts`

**Interfaces:**
- Produces Drizzle tables (bilingual fields use `_tr`/`_en` columns):
  - `siteSettings` (single row, `id=1`): `name`, `titleTr`, `titleEn`, `bioTr`, `bioEn`, `github`, `email`, `discordUsername`, `discordId`, `x`
  - `projects`: `id`, `name`, `url`, `logoUrl`, `screenshotUrl`, `bannerUrl?`, `descriptionTr`, `descriptionEn`, `tech text[]`, `year int`, `sortOrder`, `visible bool`
  - `references`: `id`, `name`, `logoUrl`, `url?`, `sortOrder`
  - `experiences`: `id`, `company`, `roleTr`, `roleEn`, `descriptionTr`, `descriptionEn`, `startYear int`, `endYear int?` (null = "now"), `sortOrder`
  - `stackItems`: `id`, `category ('tech'|'tool')`, `name`, `iconUrl`, `sortOrder`
  - `posts`: `id`, `slug unique`, `titleTr?`, `titleEn?`, `excerptTr?`, `excerptEn?`, `bodyTr?`, `bodyEn?`, `tags text[]`, `publishedAt date`, `status ('draft'|'published')`, `updatedAt`
  - `galleryItems`: `id`, `imageUrl`, `width`, `height`, `captionTr?`, `captionEn?`, `takenAt date?`, `sortOrder`
  - `messages`: `id`, `name`, `email`, `subject?`, `body`, `ipHash`, `read bool`, `createdAt`
- `db` from `lib/db/client.ts`: Neon HTTP driver when `env.databaseUrl` is set, otherwise PGlite at `.data/pglite`. The schema is applied with `drizzle-kit push` (Neon) or with migrations generated by `drizzle-kit generate` and applied programmatically on PGlite startup.
- `seed(db): Promise<void>` is idempotent (upsert by natural key). `bun run db:seed` runs it.

- [ ] **Step 1: Failing test** `tests/db/seed.test.ts` on an in-memory PGlite. After `seed()` runs twice: there are 6 projects with names `Keyra, Mazlum Admin, Veyra, White Bilişim, 0Resmon, Hype Scripts` in that sort order. There are 5 references `0Resmon, White Bilişim, BORP, FastScript, Night`. There are 6 experiences, and the first by sortOrder is `Hype Scripts`, `startYear 2026`, `endYear null`. Stack has 9 `tech` and 8 `tool` items. There is 1 post with `status "published"`, non-empty `bodyTr` and `bodyEn`. There are 0 gallery items. `siteSettings.bioTr` equals the spec §9.1 text verbatim.
- [ ] **Step 2:** Run `bun run test tests/db`. Expected: FAIL.
- [ ] **Step 3:** Implement the schema, the client and `seed.ts`. Seed content comes verbatim from spec §9.1–§9.6. Experience rows: Hype Scripts 2026–null "Kurucu/Founder"; 0Resmon 2024–2026 Full Stack Developer; 88Studios 2024–2024 Full Stack Developer; HDScripts 2023–2024 "Kurucu (Tebex mağazası)/Founder (Tebex store)"; BiOnluk 2022–2024 "Freelance Web Developer"; Kobi Bilişim Güvenlik 2021–2022 "Siber Güvenlik Stajyeri/Cybersecurity Intern". Draft TR/EN descriptions, the EN bio and the test blog post (headings, list, code block, table, link, image) are written by the builder and **flagged as drafts in the dev review**. Asset URLs point to `/seed/...` paths produced in Task 4.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5: Commit checkpoint:** `feat: drizzle schema and seed content`.

### Task 4: Seed assets (screenshots, logos, references, stack icons)

**Files:**
- Create: `scripts/capture-screenshots.ts`, `scripts/fetch-logos.ts`, `scripts/restore-references.ts`, `public/seed/**`

**Interfaces:**
- Produces files referenced by the seed: `public/seed/projects/{keyra,mazlumadmin,veyra,whitebilisim,0resmon,hypescripts}.webp` (1440×900 viewport, WebP q80), `public/seed/logos/{same-ids}.webp|svg|png`, `public/seed/references/{0resmon,whitebilisim,borp,fastscript,night}_logo.webp`, and `public/seed/stack/{slug}.svg` (Simple Icons, fill `currentColor`).

- [ ] **Step 1:** `restore-references.ts` runs `git show 3485855:public/references/<name>_logo.webp` for the 5 references. It also copies `0resmon` and `whitebilisim` into `public/seed/logos/`.
- [ ] **Step 2:** `capture-screenshots.ts` uses Playwright Chromium. For each URL in spec §9.2 it waits for `networkidle` plus 1.5 s and captures the viewport, then converts to WebP with `sharp`. Run it, then look at every image. If a site shows a cookie banner, a captcha or a blank page, report it to the user rather than silently keeping a bad shot.
- [ ] **Step 3:** `fetch-logos.ts` handles keyra, mazlumadmin, veyra and hypescripts. It parses each homepage for `<link rel="icon"|"apple-touch-icon">`, a header `<img>` logo, or an `og:image` fallback, and saves the largest candidate. Look at each logo. If one is a generic or unsuitable image, list it for the user.
- [ ] **Step 4:** Copy Simple Icons SVGs for the 17 stack items. HeidiSQL and Termius may be missing from Simple Icons: use the closest official icon or a neutral monogram, and mention it at review.
- [ ] **Step 5:** Verify with `ls public/seed/*`: 6 screenshots, 6 logos, 5 references, 17 stack icons.
- [ ] **Step 6: Commit checkpoint:** `chore: seed assets`.

### Task 5: Content queries with cache tags

**Files:**
- Create: `lib/content/tags.ts`, `lib/content/localize.ts`, `lib/content/queries.ts`
- Test: `tests/content/localize.test.ts`, `tests/content/queries.test.ts`

**Interfaces:**
- Produces: `TAGS = { settings, projects, references, experiences, stack, posts, gallery } as const`. `pick<T>(row: T, field: string, locale: Locale): string | null` returns `row[field+"Tr"|"En"]`. Query functions are wrapped with `unstable_cache`/`"use cache"` + `cacheTag(TAGS.x)`, as the installed Next version supports:
  - `getSettings(locale) → { name, title, bio, links: {github,email,discord,discordId,x} }`
  - `getProjects(locale) → Project[]` (visible only, sorted)
  - `getReferences() → Reference[]`
  - `getExperiences(locale) → { company, role, description, start, end: number | null }[]`
  - `getStack() → { tech: StackItem[], tools: StackItem[] }`
  - `getPosts(locale, opts?: {limit?: number}) → PostSummary[]`: published only, has content in `locale`, newest first
  - `getPost(locale, slug) → Post | null`: null if not published or no content in `locale`; includes `availableLocales: Locale[]`
  - `getGallery(locale) → GalleryItem[]`
  - `listPostSlugs() → { slug, locales: Locale[], updatedAt }[]` (for the sitemap)

- [ ] **Step 1: Failing tests** on PGlite with seeded data plus a TR-only post `sadece-tr`: `getPosts("en")` excludes `sadece-tr`; `getPosts("tr")` includes it; `getPost("en","sadece-tr")` → `null`; `getPost("tr","sadece-tr").availableLocales` → `["tr"]`; a draft post is excluded everywhere; `getProjects("en")[0].description` is the EN text; `getExperiences("tr")[0].end` → `null`.
- [ ] **Step 2:** Run `bun run test tests/content`. Expected: FAIL.
- [ ] **Step 3:** Implement. Tests call the uncached inner functions, which are exported as `*Uncached`.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5: Commit checkpoint:** `feat: localized content queries`.

### Task 6: Site shell (header, footer, theme, locale switcher, section frame)

**Files:**
- Create: `components/site/header.tsx`, `footer.tsx`, `theme-toggle.tsx`, `locale-switcher.tsx`, `section.tsx`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `<Section title="Projeler" meta="06" id="projects">children</Section>` renders the dashed-bordered block with a `// Title` mono accent heading and a muted meta label on the right. `<LocaleSwitcher locale pathname />` sets the `NEXT_LOCALE` cookie and links to the same path in the other locale. `<ThemeToggle />` cycles system → light → dark via `next-themes` (`attribute="class"`). The header leaves a slot for `<CommandMenuTrigger />` (Task 14).

- [ ] **Step 1:** Implement the components to match the approved mockup `home-layout.html`: `VO` monogram link, nav items from the dictionary (Blog, Galeri/Gallery, İletişim/Contact; hide Gallery when `getGallery` is empty), the ⌘K button, TR/EN, and the theme toggle. Use a single centered column (`max-w-3xl`). The footer shows `© {year} Vezir Oni` and the social links.
- [ ] **Step 2:** Verify by running `bun dev` and opening `/tr` and `/en`. Header and footer render, the toggle switches themes without a flash (`suppressHydrationWarning` on `<html>`), and the locale switch keeps the path.
- [ ] **Step 3: Commit checkpoint:** `feat: site shell`.

### Task 7: VO isometric figure

**Files:**
- Create: `components/home/vo-figure.tsx`, `lib/vo-geometry.ts`
- Test: `tests/vo-geometry.test.ts`

**Interfaces:**
- Produces: `iso(x: number, y: number, z: number): [number, number]`, the isometric projection (30°); `buildVO(): { top: string[]; sides: string[]; edges: string }` returns SVG path data for the extruded letters V and O built from grid cells; `<VOFigure />` is a client component.

- [ ] **Step 1: Failing tests:** `iso(0,0,0)` → `[0,0]`; `iso(1,0,0)` → `[cos30°, sin30°]` within 1e-6; `buildVO().top.length > 0`; every path string starts with `M` and contains no `NaN`.
- [ ] **Step 2:** Run `bun run test tests/vo-geometry.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement. Draw V and O as block letters on a voxel grid (the builder chooses the cell layout; O is a ring). Extrude them by 1 unit and project with `iso`. Fill the top faces with a hatch `<pattern>`, give side faces the bg fill, and stroke edges with `--line`. A second stroke layer uses a `radialGradient` whose `cx/cy` follow the pointer (rAF-throttled `pointermove` on the figure, coordinates converted to viewBox space). On click, play a short synthesized "tok" (Web Audio: sine about 220→110 Hz, 120 ms, gain envelope) and run a 150 ms press-down translate on the letter group. Add a background grid, 2–3 dashed guide lines, a `Fig. 01` caption and, at `xl` with a fine pointer, a small annotation "imleci takip eder · tıkla" / "follows your cursor · click". `aria-hidden`. Disable the animation under `prefers-reduced-motion`. Touch devices: no follow, tap triggers the click effect.
- [ ] **Step 4:** Run the tests. Expected: PASS. Visually check in `bun dev`: the glow follows the cursor, clicking plays a sound, and the figure looks good in both themes.
- [ ] **Step 5: Commit checkpoint:** `feat: interactive VO figure`.

### Task 8: Home static sections

**Files:**
- Create: `components/home/intro.tsx`, `projects.tsx`, `references.tsx`, `experience.tsx`, `stack.tsx`, `latest-posts.tsx`
- Modify: `app/[locale]/page.tsx`
- Test: `tests/format.test.ts`, `lib/format.ts`

**Interfaces:**
- Consumes: Task 5 queries, Task 6 `<Section>`.
- Produces: `formatRange(start: number, end: number | null, locale: Locale): string` → `"2026 — Şimdi"` / `"2026 — Present"`; `start===end` gives `"2024"`.

- [ ] **Step 1: Failing tests:** `formatRange(2026,null,"tr")` → `"2026 — Şimdi"`; `formatRange(2026,null,"en")` → `"2026 — Present"`; `formatRange(2024,2024,"tr")` → `"2024"`; `formatRange(2022,2024,"en")` → `"2022 — 2024"`.
- [ ] **Step 2:** Run `bun run test tests/format.test.ts`. Expected: FAIL, then implement it and the test PASSES.
- [ ] **Step 3:** Implement the sections in spec §7 order (status, GitHub and blog slots are filled by Tasks 9–11). Project card: `next/image` screenshot (16:10, explicit size, `alt="{name} ekran görüntüsü"`), logo, name, description, tech chips and year. The whole card is an `<a target="_blank" rel="noopener">` to the URL. The grid is 3 columns on desktop, 2 on tablet, 1 on mobile. References show logo plus name, linked if `url` is set. Experience is a timeline. Stack shows tech and tools chips with icons.
- [ ] **Step 4:** Verify in `bun dev` that `/tr` and `/en` show all content in the right language, and that `view-source` contains project names and the bio (server-rendered).
- [ ] **Step 5: Commit checkpoint:** `feat: home sections`.

### Task 9: GitHub contributions graph

**Files:**
- Create: `lib/github.ts`, `components/home/github-graph.tsx`
- Test: `tests/github.test.ts`

**Interfaces:**
- Produces: `toLevels(days: {date: string; count: number}[]): {date: string; count: number; level: 0|1|2|3|4}[]`; `getContributions(login = "vezironi"): Promise<{ total: number; weeks: {date, count, level}[][] } | null>`. It uses the GraphQL `contributionsCollection.contributionCalendar` with `GITHUB_TOKEN` and `next: { revalidate: 86400 }`, and returns null when there is no token or the request fails.

- [ ] **Step 1: Failing tests:** `toLevels` gives level 0 for count 0; with max count 20, counts are bucketed into quartiles of the non-zero max (1–5→1, 6–10→2, 11–15→3, 16–20→4). `getContributions` with a mocked `fetch` returning a 500 → `null`; with `GITHUB_TOKEN` unset → `null`, and no fetch is made.
- [ ] **Step 2:** Run `bun run test tests/github.test.ts`. Expected: FAIL, then implement it and the test PASSES.
- [ ] **Step 3:** Render a 53×7 grid as server-rendered SVG using lime levels. Each cell gets a `<title>` with date and count (tooltip without JS). Show the total in the section meta. When `null`, show a muted "GitHub verisi şu an alınamadı" line at the same height.
- [ ] **Step 4: Commit checkpoint:** `feat: github contributions graph`.

### Task 10: Live status (Discord via Lanyard, Spotify API)

**Files:**
- Create: `lib/spotify.ts`, `app/api/spotify/route.ts`, `lib/lanyard.ts`, `components/home/status-discord.tsx`, `components/home/status-spotify.tsx`, `scripts/spotify-token.ts`
- Test: `tests/spotify.test.ts`, `tests/lanyard.test.ts`

**Interfaces:**
- Produces:
  - `type NowPlaying = { state: "playing" | "recent"; title; artists: string; albumArt; url; progressMs?; durationMs? } | null`
  - `getNowPlaying(fetchImpl = fetch): Promise<NowPlaying>`: refresh-token grant → `GET /v1/me/player/currently-playing` → on 204, `item:null`, or `currently_playing_type !== "track"` → `GET /v1/me/player/recently-played?limit=1`. Any error → `null`.
  - `GET /api/spotify` → JSON `NowPlaying`, `Cache-Control: s-maxage=30, stale-while-revalidate=30`.
  - `parseLanyard(json): { status: "online"|"idle"|"dnd"|"offline"; activity: string | null }`. On `success:false` or malformed input → `{status:"offline", activity:null}`. Ignore activity type 4 (custom status) and Spotify (type 2) for the activity text.
  - `scripts/spotify-token.ts`: a one-time local helper. It starts a localhost:8888 callback, prints the authorize URL with scopes `user-read-currently-playing user-read-recently-played`, exchanges the code and prints the refresh token.

- [ ] **Step 1: Failing tests (Spotify)** with a mocked fetch: playing track → `state:"playing"` with title/artists joined by `", "`; 204 → falls back to recent → `state:"recent"`; `item:null` (ad) → recent; token endpoint 400 → `null`; recently-played empty `items:[]` → `null`; env vars missing → `null` and no fetch.
- [ ] **Step 2: Failing tests (Lanyard):** `{success:false}` → offline; online with activity `{type:0,name:"Visual Studio Code"}` → `activity:"Visual Studio Code"`; only Spotify and custom status → `activity:null`.
- [ ] **Step 3:** Run `bun run test tests/spotify.test.ts tests/lanyard.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 4:** Build the client cards. Both have a fixed height and a skeleton state, so there is no CLS. Spotify polls `/api/spotify` every 30 s and shows "Şu an dinliyor / Now playing" or "En son dinlenen / Last played", plus a progress bar when playing. If `null`, it shows a neutral "Spotify" placeholder. Discord uses the Lanyard WebSocket `wss://api.lanyard.rest/socket` (op 2 subscribe, heartbeat), with REST `https://api.lanyard.rest/v1/users/1517800496029630556` as the initial fetch and as the fallback on socket error.
- [ ] **Step 5:** Run `bun dev` without Spotify env and confirm the cards render their neutral states with no console errors.
- [ ] **Step 6: Commit checkpoint:** `feat: live discord and spotify status`.

### Task 11: Blog (list, post, markdown)

**Files:**
- Create: `lib/markdown.ts`, `components/blog/post-body.tsx`, `app/[locale]/blog/page.tsx`, `app/[locale]/blog/[slug]/page.tsx`, `components/home/latest-posts.tsx` (fill)
- Test: `tests/markdown.test.ts`

**Interfaces:**
- Produces: `renderMarkdown(md: string): Promise<string>` (remark-gfm → rehype → rehype-shiki with themes for light and dark → rehype-slug → rehype-autolink-headings → rehype-sanitize allowing shiki classes and styles). External links get `target="_blank" rel="noopener noreferrer"`. Images get `loading="lazy"`.

- [ ] **Step 1: Failing tests:** `renderMarkdown("## Hi")` contains `<h2 id="hi"`; a GFM table renders as `<table>`; `` ```ts\nconst a=1\n``` `` output contains `shiki`; `<script>alert(1)</script>` is stripped; `[x](https://a.com)` gets `rel="noopener noreferrer"`.
- [ ] **Step 2:** Run `bun run test tests/markdown.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** Build the pages. `generateStaticParams` uses `listPostSlugs()` filtered per locale. For the post page: when `getPost` returns null, if the slug exists in the other locale, render `notFound()`. If the slug is unknown, `redirect(`/${locale}/blog`)` (legacy rule, spec §9.6). Show title, date, tags, reading time and body styled with prose-like Blueprint typography. The home "latest posts" shows the 3 newest.
- [ ] **Step 4:** Verify in `bun dev`: `/tr/blog/<test-slug>` and `/en/blog/<test-slug>` render all the markdown features, and `/en/blog/welcome-to-my-blog` redirects to `/en/blog`.
- [ ] **Step 5: Commit checkpoint:** `feat: blog`.

### Task 12: Gallery page

**Files:**
- Create: `components/gallery/masonry.tsx`, `components/gallery/lightbox.tsx`, `app/[locale]/gallery/page.tsx`

**Interfaces:**
- Consumes: `getGallery(locale)`.

- [ ] **Step 1:** Implement the page. When empty, render a short "Yakında / Coming soon" message, set `robots: { index: false }`, and hide the page from nav, ⌘K and the sitemap (Tasks 6, 14, 15 read `getGallery().length`). Masonry uses CSS columns with `next/image` and stored width/height. Lightbox: a `<dialog>` with keyboard ←/→/Esc, caption and date.
- [ ] **Step 2:** Temporarily insert 5 rows in local PGlite and check the masonry layout and the lightbox. Delete them afterwards.
- [ ] **Step 3: Commit checkpoint:** `feat: gallery`.

### Task 13: Contact form

**Files:**
- Create: `lib/contact/schema.ts`, `lib/contact/rate-limit.ts`, `lib/contact/mailer.ts`, `lib/contact/action.ts`, `components/contact/contact-form.tsx`, `app/[locale]/contact/page.tsx`
- Test: `tests/contact/action.test.ts`

**Interfaces:**
- Produces: `contactSchema` (zod: name 1–100, email, subject optional ≤150, body 10–5000, `website` honeypot must be empty). `hashIp(ip: string): string` (SHA-256 with `AUTH_SECRET` salt). `isRateLimited(db, ipHash, now = new Date()): Promise<boolean>` (≥3 messages in the last 10 min). `sendContactMail(msg): Promise<void>` (Resend; no-op with a console warning when `RESEND_API_KEY` is unset). `submitContact(prev, formData): Promise<{ ok: true } | { ok: false; error: "invalid" | "rate_limited" | "server"; fields?: Record<string,string> }>`, a server action.

- [ ] **Step 1: Failing tests** with PGlite and a mocked mailer: a valid submission → `{ok:true}`, 1 row in `messages`, mailer called with `replyTo` = visitor email and `to` = `CONTACT_TO_EMAIL`. A filled honeypot → `{ok:true}`, but no row and no mail (silent drop). The 4th submission from the same IP within 10 min → `rate_limited`. The same IP after 11 min → ok. A body of 5 chars → `invalid` with `fields.body`. Mailer throws → the row is still saved and the result is `{ok:true}` (the inbox is the fallback).
- [ ] **Step 2:** Run `bun run test tests/contact`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** Build the form with `useActionState`, localized labels and errors, the honeypot hidden with CSS (not `type=hidden`), and success and error states. The page also lists the email and social links.
- [ ] **Step 4: Commit checkpoint:** `feat: contact form`.

### Task 14: ⌘K command menu

**Files:**
- Create: `components/site/command-menu.tsx`
- Modify: `components/site/header.tsx`, `app/[locale]/layout.tsx` (pass the search index)

**Interfaces:**
- Consumes: `getPosts(locale)`, `getProjects(locale)`, `getGallery(locale).length`.
- Produces: `<CommandMenu locale items={{ posts: {slug,title}[], projects: {name,url}[], hasGallery: boolean }} />`.

- [ ] **Step 1:** Implement with `cmdk` in a dialog. It opens on ⌘K/Ctrl+K and from the header button. Groups: Pages (Home, Blog, Gallery if `hasGallery`, Contact); Blog posts; Projects (open in a new tab); Theme (Light/Dark/System); Language (TR/EN); "E-postayı kopyala / Copy email" (clipboard, then a brief "Kopyalandı" state). Labels come from the dictionary.
- [ ] **Step 2:** Verify in `bun dev`: open with the keyboard, search "keyra", select it, and check that the project opens. Copy email works.
- [ ] **Step 3: Commit checkpoint:** `feat: command menu`.

### Task 15: SEO (metadata, sitemap, robots, JSON-LD, OG)

**Files:**
- Create: `lib/seo/metadata.ts`, `lib/seo/json-ld.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/[locale]/opengraph-image.tsx`, `app/[locale]/blog/[slug]/opengraph-image.tsx`
- Modify: every `app/[locale]/**/page.tsx` (`generateMetadata`), `app/[locale]/layout.tsx` (Analytics)
- Test: `tests/seo.test.ts`

**Interfaces:**
- Produces: `buildMetadata({ locale, path, title, description, availableLocales = locales, image? }): Metadata`. It sets canonical `${siteUrl}/${locale}${path}`, `alternates.languages` for each available locale plus `x-default` → the `en` URL if available (else the only locale), openGraph/twitter, and `robots: noindex` when `env.noindex`. Also `personJsonLd(settings)`, `blogPostingJsonLd(post, locale)`, `galleryJsonLd(items, locale)`, `contactPageJsonLd(locale)`, and `<JsonLd data />`.

- [ ] **Step 1: Failing tests:** `buildMetadata({locale:"tr", path:"/blog"})` gives canonical `https://vezironi.com/tr/blog`, `languages.en` `https://vezironi.com/en/blog` and `languages["x-default"]` `https://vezironi.com/en/blog`. With `availableLocales:["tr"]` there is no `en` key and `x-default` points to the tr URL. With `SITE_NOINDEX=true`, `robots.index === false`. `sitemap()` (with seeded DB plus the TR-only post) includes `/tr/blog/sadece-tr` but not `/en/blog/sadece-tr`, excludes `/tr/gallery` while the gallery is empty, and gives each entry `alternates.languages`. `robots()` disallows `/admin` and `/api`, and disallows `/` when `SITE_NOINDEX=true`.
- [ ] **Step 2:** Run `bun run test tests/seo.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** Build the OG images with `next/og` at 1200×630 in Blueprint style (dark grid, lime accent, title, "vezironi.com"). Use `Person` JSON-LD with `sameAs` on home, plus `WebSite`. Add `<Analytics />` from `@vercel/analytics/next`.
- [ ] **Step 4:** Verify with `bun run build && bun start`, then `curl -s localhost:3000/en | grep -E 'hreflang|canonical|application/ld\+json'` and `curl -s localhost:3000/sitemap.xml`.
- [ ] **Step 5: Commit checkpoint:** `feat: seo metadata, sitemap, robots, og`.

### CHECKPOINT A: user dev review (stop here)

- [ ] Run `bun run db:seed && bun dev`. Give the user `http://localhost:3000`. Point out what to check: the draft texts (project descriptions, tech, years, EN bio, experience descriptions, test post), logos and screenshots flagged in Task 4, the light theme, and the VO figure.
- [ ] Apply the user's corrections to `lib/db/seed.ts`.
- [ ] **Ask the user** whether to commit now (spec + plan + Phase 1). Commit only on yes.

---

## Phase 2: Admin panel

### Task 16: Discord auth and admin guard

**Files:**
- Create: `lib/auth.ts`, `lib/admin-guard.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/admin/login/page.tsx`, `app/admin/(panel)/layout.tsx`, `app/admin/(panel)/page.tsx` (dashboard: counts and unread messages)
- Modify: `proxy.ts` (an optimistic redirect from `/admin/*` to `/admin/login` when there is no session cookie)
- Test: `tests/admin-guard.test.ts`

**Interfaces:**
- Produces: `auth`, `signIn`, `signOut`, `handlers` (Auth.js v5, Discord provider, JWT session). The `signIn` callback returns false unless `profile.id === env.adminDiscordId`. The `jwt`/`session` callbacks carry `discordId`. `isAdminSession(session): boolean`. `requireAdmin(): Promise<Session>` throws `UnauthorizedError` (pages: `redirect("/admin/login")`). **Every admin server action calls `await requireAdmin()` as its first line.** Admin layout: Turkish sidebar (Genel, Ayarlar, Projeler, Referanslar, Deneyim, Stack, Blog, Galeri, Gelen Kutusu), `robots: noindex`.

- [ ] **Step 1: Failing tests:** `isAdminSession(null)` → false; a session with `discordId "123"` → false; a session with `discordId "1517800496029630556"` → true. The `requireAdmin` mocked `auth()` returns a non-admin → throws `UnauthorizedError`. The signIn callback with a non-admin profile → `false`.
- [ ] **Step 2:** Run `bun run test tests/admin-guard.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** Add a Turkish section to `docs/setup.md`: create a Discord application, add the redirect URIs `http://localhost:3000/api/auth/callback/discord` and `https://v2.vezironi.com/api/auth/callback/discord`, and set `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` and `AUTH_SECRET` (`bunx auth secret`).
- [ ] **Step 4: Commit checkpoint:** `feat: discord admin auth`.

### Task 17: Storage helper

**Files:**
- Create: `lib/storage.ts`, `lib/admin/actions/upload.ts`
- Test: `tests/storage.test.ts`

**Interfaces:**
- Produces: `uploadImage(file: File, folder: "gallery"|"projects"|"logos"|"references"|"stack"|"blog"): Promise<{ url: string; width: number; height: number }>`. It validates type (`image/png|jpeg|webp|gif|svg+xml`, SVG only for logos and stack) and size ≤ 8 MB. Non-SVG, non-GIF images are converted to WebP with `sharp` (max 2400 px). It writes with `@vercel/blob` `put` when `BLOB_READ_WRITE_TOKEN` is set, otherwise to `public/uploads/<folder>/`. Also `deleteImage(url: string): Promise<void>` (no-op for `/seed/` URLs). `uploadAction(formData)` is a server action wrapping `uploadImage` after `requireAdmin()`.

- [ ] **Step 1: Failing tests:** rejects `application/pdf`; rejects 9 MB; rejects SVG for `gallery`; a PNG in local mode returns `/uploads/gallery/<id>.webp` with the correct width/height; `deleteImage("/seed/x.webp")` touches nothing.
- [ ] **Step 2:** Run `bun run test tests/storage.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3: Commit checkpoint:** `feat: image storage helper`.

### Task 18: Admin CRUD (settings, projects, references, experience, stack)

**Files:**
- Create: `components/admin/{field,i18n-field,sortable-list,image-upload}.tsx`, `lib/admin/actions/{settings,projects,references,experience,stack}.ts`, `app/admin/(panel)/{settings,projects,references,experience,stack}/page.tsx`
- Test: `tests/admin/actions.test.ts`

**Interfaces:**
- Consumes: `requireAdmin`, `uploadAction`, `TAGS`.
- Produces, per entity: `save<Entity>(input): Promise<{ok:true,id}|{ok:false,errors}>`, `delete<Entity>(id)`, `reorder<Entity>(ids: number[])`. Each validates with zod, writes, then calls `revalidateTag(TAGS.x)`. `<I18nField name label multiline? />` renders side-by-side TR | EN inputs. `<SortableList items onReorder />` uses `@dnd-kit/sortable`.

- [ ] **Step 1: Failing tests** (PGlite, `requireAdmin` and `revalidateTag` mocked): `saveProject` with a missing `url` → errors.url; a valid save → a row exists and `revalidateTag("projects")` was called; `reorderProjects([3,1,2])` → sortOrder 0,1,2 in that order; `saveExperience({endYear:null})` persists null; non-admin (mock throws) → no DB write.
- [ ] **Step 2:** Run `bun run test tests/admin`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** Build the admin pages. Each is a list with drag-reorder, an edit form and delete with confirm. Projects include the optional banner field and a visible toggle. Experience has a "Şimdi" checkbox that nulls `endYear`. Settings is a single form.
- [ ] **Step 4:** Verify by logging in locally (Discord app needed; if the user hasn't created it yet, ask them, and otherwise defer verification to Checkpoint B). Edit a project description, save, reload `/tr`, and confirm the change is visible.
- [ ] **Step 5: Commit checkpoint:** `feat: admin crud for site content`.

### Task 19: Admin blog editor

**Files:**
- Create: `components/admin/markdown-editor.tsx`, `lib/admin/actions/posts.ts`, `app/admin/(panel)/blog/page.tsx`, `app/admin/(panel)/blog/[id]/page.tsx`, `app/api/admin/preview/route.ts`
- Test: `tests/admin/posts.test.ts`

**Interfaces:**
- Produces: `savePost(input)` validates: slug matches `^[a-z0-9-]+$` and is unique; if `published`, at least one locale has title and body; per-locale title, excerpt and body must be all filled or all empty. It revalidates `TAGS.posts`. Also `deletePost(id)`. `POST /api/admin/preview` (admin only) `{ md } → { html }` via `renderMarkdown`. `<MarkdownEditor value onChange />`: a textarea plus a debounced (300 ms) preview pane, TR/EN tabs, and image paste/drop → `uploadAction(folder:"blog")` → inserts `![](url)`.

- [ ] **Step 1: Failing tests:** slug `"Merhaba Dünya"` → error; duplicate slug → error; published with both locales empty → error; TR title without TR body → error; a TR-only published post saves; the preview route rejects non-admin with 401.
- [ ] **Step 2:** Run `bun run test tests/admin/posts.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** Build the editor UI: list (title, status, date, languages), and edit with slug auto-suggested from the TR or EN title (Turkish chars transliterated: ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u), tags, date and a draft/published switch.
- [ ] **Step 4: Commit checkpoint:** `feat: admin blog editor`.

### Task 20: Admin gallery

**Files:**
- Create: `components/admin/dropzone.tsx`, `lib/admin/actions/gallery.ts`, `app/admin/(panel)/gallery/page.tsx`
- Test: `tests/admin/gallery.test.ts`

**Interfaces:**
- Produces: `addGalleryItems(uploads: {url,width,height}[])` appends to the end of sortOrder. `updateGalleryItem(id, {captionTr?, captionEn?, takenAt?})`. `deleteGalleryItem(id)` (also `deleteImage`). `reorderGallery(ids)`. All revalidate `TAGS.gallery`.

- [ ] **Step 1: Failing tests:** add 3 → sortOrder continues from the existing max; delete calls `deleteImage` with the row URL; reorder persists.
- [ ] **Step 2:** Run `bun run test tests/admin/gallery.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** Dropzone: multi-file drag & drop with per-file progress. Uploads run sequentially through `uploadAction`, then `addGalleryItems`. The grid supports drag-reorder and inline caption/date editing.
- [ ] **Step 4: Commit checkpoint:** `feat: admin gallery`.

### Task 21: Admin inbox

**Files:**
- Create: `lib/admin/actions/messages.ts`, `app/admin/(panel)/inbox/page.tsx`
- Test: `tests/admin/messages.test.ts`

**Interfaces:**
- Produces: `listMessages({ unreadOnly? })`, `setMessageRead(id, read)`, `deleteMessage(id)`, all after `requireAdmin()`.

- [ ] **Step 1: Failing tests:** list is newest first; `unreadOnly` filters; mark read persists; a non-admin is rejected.
- [ ] **Step 2:** Run `bun run test tests/admin/messages.test.ts`. Expected: FAIL, then implement and PASS.
- [ ] **Step 3:** UI: list (unread bold), detail view, a "Yanıtla" `mailto:` link, read/unread toggle and delete. The dashboard shows the unread count.
- [ ] **Step 4: Commit checkpoint:** `feat: admin inbox`.

### CHECKPOINT B: user dev review of admin

- [ ] The user creates the Discord app (`docs/setup.md`), logs in at `http://localhost:3000/admin` and tries every module. A non-admin Discord account must be refused.
- [ ] Ask whether to commit Phase 2. Commit only on yes.

---

## Phase 3: Staging deploy to v2.vezironi.com

### Task 22: Setup guide and staging deploy

**Files:**
- Create/Modify: `docs/setup.md` (complete, Turkish), `.env.example`, `scripts/spotify-token.ts` (from Task 10)

- [ ] **Step 1:** Finish `docs/setup.md` with step-by-step instructions for the user:
  - Vercel project on branch `v2.0.0`, domain `v2.vezironi.com`, env `SITE_NOINDEX=true` and `NEXT_PUBLIC_SITE_URL=https://v2.vezironi.com`
  - Neon via Vercel Marketplace → `DATABASE_URL`, then `bunx drizzle-kit push` + `bun run db:seed` against Neon
  - Vercel Blob → `BLOB_READ_WRITE_TOKEN`. The seed's `/seed/*` assets keep working from `public/`.
  - Resend: verify the vezironi.com domain (DNS records), `RESEND_API_KEY`, `CONTACT_TO_EMAIL=contact@vezironi.com`, `CONTACT_FROM_EMAIL=no-reply@vezironi.com`
  - Spotify Developer app: redirect `http://127.0.0.1:8888/callback`, run `bun scripts/spotify-token.ts`, set the three env vars. Re-check Spotify's current Development Mode rules (owner has Premium).
  - GitHub fine-grained token (read-only public data) → `GITHUB_TOKEN`
  - Join the Lanyard Discord server
  - Discord OAuth redirect for `v2.vezironi.com`
  - Enable Vercel Web Analytics
- [ ] **Step 2:** Ask the user before running any `vercel` CLI command or pushing the branch (deploys are outward-facing). Walk them through the dashboard steps they must do themselves.
- [ ] **Step 3:** Verify on `https://v2.vezironi.com`: home in both locales, `/robots.txt` → `Disallow: /`, a page `<meta name="robots" content="noindex">`, the contact form delivers to contact@vezironi.com, Spotify and Discord cards are live, admin login works and a non-admin is refused.

### CHECKPOINT C: content review on staging, then production (separate approval)

- [ ] The user reviews and fixes content on staging.
- [ ] Only after explicit user approval: merge `v2.0.0` → `main`, point vezironi.com to the project, set `NEXT_PUBLIC_SITE_URL=https://vezironi.com`, remove `SITE_NOINDEX`, add the Discord OAuth redirect for vezironi.com, submit `sitemap.xml` in Google Search Console, and remove or redirect `v2.vezironi.com` to vezironi.com (301).
