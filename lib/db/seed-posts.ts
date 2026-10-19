// Launch blog posts (DRAFTS written by Claude from the actual implementation;
// the owner reviews them before launch). Slugs are shared by both languages.

type SeedPost = {
  slug: string;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  bodyTr: string;
  bodyEn: string;
  tags: string[];
  publishedAt: string;
  status: "draft" | "published";
};

const howIBuiltThisSiteTr = `Yeni portfolyomu yaparken üç şey istedim: hızlı açılsın, arama motorları içeriği eksiksiz görsün ve içerikleri koda dokunmadan güncelleyebileyim. Bu yazıda sitenin nasıl kurulduğunu özetliyorum.

## Altyapı

Site **Next.js 16** üzerinde çalışıyor. Sayfalar derleme sırasında hazır HTML olarak üretiliyor; yani ziyaretçi ya da arama motoru botu geldiğinde sunucunun bir şey hesaplamasına gerek kalmıyor.

İçerikler (projeler, deneyimler, blog yazıları) bir **Postgres** veritabanında duruyor. Canlıda Neon kullanıyorum; bilgisayarımda ise hiçbir kurulum gerektirmeyen gömülü bir Postgres (PGlite) açılıyor ve ilk çalıştırmada kendini başlangıç içeriğiyle dolduruyor.

## Önbellek: sayfa ne zaman yenilenir?

Veriyi okuyan her fonksiyon önbelleğe alınıyor ve bir etiketle işaretleniyor:

\`\`\`ts
export async function getProjects(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  return getProjectsUncached(await getDb(), locale);
}
\`\`\`

Bir projeyi güncellediğimde sadece \`projects\` etiketini geçersiz kılmak yetiyor; o veriyi kullanan sayfalar yeniden üretiliyor, geri kalan her şey önbellekte kalıyor.

## Tasarım

Tasarımda teknik çizim (blueprint) hissi istedim: ince ızgara, kesikli bölüm çizgileri, tek bir vurgu rengi ve monospace başlıklar. Yazılar Plus Jakarta Sans, kod ve etiketler Geist Mono ile. Tema sistem ayarını takip ediyor; istersen üstten açık ya da koyu seçebiliyorsun.

## Canlı parçalar

Bazı bölümler her ziyarette değişiyor: Discord durumum, Spotify'da dinlediğim şarkı ve GitHub katkı grafiğim. Bunlar sayfanın geri kalanını yavaşlatmasın diye sabit boyutlu kutularda ve tarayıcı tarafında yükleniyor; bir servis cevap vermezse sayfa bozulmuyor, kutu sade bir duruma geçiyor.

## Sırada ne var?

İçerikleri Discord hesabımla girdiğim bir yönetim panelinden düzenlemek. Blog, galeri ve projeler oradan yönetilecek; kaydettiğim anda ilgili sayfa yenilenecek.
`;

const howIBuiltThisSiteEn = `When I started my new portfolio I wanted three things: it should load fast, search engines should see all of the content, and I should be able to update it without touching code. Here is how the site is put together.

## Foundation

The site runs on **Next.js 16**. Pages are generated as plain HTML at build time, so when a visitor or a crawler arrives the server has nothing to compute.

Content (projects, experience, blog posts) lives in a **Postgres** database. In production that's Neon; on my machine an embedded Postgres (PGlite) starts with zero setup and seeds itself on the first run.

## Caching: when does a page refresh?

Every function that reads data is cached and tagged:

\`\`\`ts
export async function getProjects(locale: Locale) {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  return getProjectsUncached(await getDb(), locale);
}
\`\`\`

When I update a project, invalidating the \`projects\` tag is enough: only the pages that use that data are regenerated, and everything else stays cached.

## Design

I wanted a technical-drawing (blueprint) feel: a faint grid, dashed section dividers, a single accent colour and monospace headings. Text is set in Plus Jakarta Sans, code and labels in Geist Mono. The theme follows your system setting, and you can pick light or dark from the header.

## Live parts

A few sections change on every visit: my Discord status, what I'm playing on Spotify and my GitHub contribution graph. They load in the browser inside fixed-size boxes so they never slow down the rest of the page; if a service doesn't answer, nothing breaks and the box falls back to a quiet state.

## What's next

An admin panel I sign into with Discord, where I'll edit the blog, gallery and projects. Saving will refresh the affected pages immediately.
`;

const isometricLogoTr = `Ana sayfanın üstündeki "VO" figürü bir resim dosyası değil; tarayıcıda matematikle çizilen bir SVG. Bu yazıda nasıl yapıldığını anlatıyorum.

## İzometrik izdüşüm

Üç boyutlu bir noktayı ekrana taşımak için tek bir fonksiyon yetiyor:

\`\`\`ts
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

export function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}
\`\`\`

x ekseni sağ-aşağı, y (derinlik) sol-aşağı, z ise yukarı gidiyor. Her köşe bu fonksiyondan geçince 30 derecelik klasik izometrik görünüm ortaya çıkıyor.

## Harfleri çokgen olarak tanımlamak

İlk denemede harfleri küçük küplerden (piksel gibi) oluşturdum; ama bu açıdan bakınca V harfi merdivene dönüyordu. Sonunda her harfi düz bir çokgen olarak tanımladım ve geriye doğru "ektrüde" ettim. O harfinin ortasındaki boşluk ayrı bir iç kontur.

## Hangi yüzeyler görünür?

Bakış yönü (1, 1, 1). Bir kenardan çıkan duvarın dışa bakan normali bu yöne dönükse duvar görünüyor, değilse hiç çizilmiyor. Görünen duvarlar derinliğe göre sıralanıp arkadan öne boyanıyor (ressam algoritması). Harfin ön yüzü izleyiciye en yakın düzlemde durduğu için hiçbir şey onu örtemiyor; o yüzden en son, tek parça olarak çiziliyor ve çapraz tarama deseniyle dolduruluyor.

## İmleci takip eden ışık

Kenar çizgilerinin üstünde ikinci bir katman var; çizgi rengi bir \`radialGradient\`. Fare hareket ettikçe ekran koordinatını SVG koordinatına çeviriyorum ve gradyanın merkezini oraya taşıyorum:

\`\`\`ts
const p = new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM()!.inverse());
glow.setAttribute("cx", String(p.x));
glow.setAttribute("cy", String(p.y));
\`\`\`

Bu işlem \`requestAnimationFrame\` ile sınırlandığı için React'i hiç yeniden render etmiyor.

## Tıklama sesi

Ses dosyası yok; Web Audio API ile 120 milisaniyelik bir ton üretiliyor. Frekans 220 Hz'den 110 Hz'e iniyor, ses seviyesi hızla açılıp kapanıyor ve kısa, tok bir "tık" çıkıyor. Hareket azaltma tercihi açık olanlarda basılma animasyonu çalışmıyor.
`;

const isometricLogoEn = `The "VO" figure at the top of the home page isn't an image file; it's an SVG drawn with a bit of maths in the browser. Here's how it works.

## Isometric projection

Moving a 3D point onto the screen takes one function:

\`\`\`ts
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

export function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}
\`\`\`

x runs down-right, y (depth) runs down-left and z goes up. Pass every corner through it and you get the classic 30° isometric look.

## Letters as polygons

My first attempt built the letters out of small cubes, like pixels, but from this angle the V turned into a staircase. In the end each letter is a flat polygon extruded backwards; the hole in the O is a separate inner contour.

## Which faces are visible?

The view direction is (1, 1, 1). A wall extruded from an edge is visible only if its outward normal faces that direction; otherwise it's never drawn. Visible walls are sorted by depth and painted back to front (the painter's algorithm). The front face of the letters sits on the plane closest to the viewer, so nothing can cover it: it's drawn last, in one piece, filled with a hatch pattern.

## A glow that follows the cursor

On top of the edges there's a second layer whose stroke is a \`radialGradient\`. As the mouse moves I convert screen coordinates to SVG coordinates and move the gradient's centre there:

\`\`\`ts
const p = new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM()!.inverse());
glow.setAttribute("cx", String(p.x));
glow.setAttribute("cy", String(p.y));
\`\`\`

It's throttled with \`requestAnimationFrame\` and never re-renders React.

## The click sound

There's no audio file: the Web Audio API synthesises a 120 ms tone that drops from 220 Hz to 110 Hz with a fast volume envelope, giving a short, soft "tock". If you prefer reduced motion, the press animation is skipped.
`;

const spotifyTr = `Ana sayfadaki Spotify kutusu o an ne dinlediğimi, bir şey çalmıyorsa en son dinlediğim şarkıyı gösteriyor. Hazır bir servis yerine doğrudan Spotify Web API'yi kullandım.

## Bir kerelik yetkilendirme

Spotify, hesabıma erişim için kullanıcı izni istiyor. Bunu bir kez yapıp uzun ömürlü bir **refresh token** alıyorum. Bunun için küçük bir yardımcı betik yazdım: bilgisayarımda \`127.0.0.1:8888\` adresinde geçici bir sunucu açıyor, onay sayfasının bağlantısını veriyor ve onaydan sonra gelen kodu token ile değiştiriyor. İstediğim izinler yalnızca iki tane: \`user-read-currently-playing\` ve \`user-read-recently-played\`.

## Sunucu tarafı

Her istekte refresh token ile kısa ömürlü bir erişim anahtarı alınıyor, sonra iki adım deneniyor:

1. \`/me/player/currently-playing\`: bir şarkı gerçekten çalıyorsa onu döndür.
2. Değilse \`/me/player/recently-played?limit=1\`: en son dinlenen şarkıyı döndür.

"Çalmıyor" sayılan durumlar sandığımdan fazlaydı: cevap boş gelebiliyor (204), bir reklam ya da podcast çalıyor olabiliyor (\`item: null\`), ya da çalma duraklatılmış olabiliyor. Hepsinde ikinci adıma geçiliyor. Herhangi bir hata olursa fonksiyon \`null\` döndürüyor ve kutu sade bir duruma geçiyor; sayfa asla bozulmuyor.

Gizli anahtarlar tarayıcıya hiç gitmiyor: tarayıcı sadece sitenin kendi \`/api/spotify\` adresini çağırıyor. Bu cevap 30 saniye önbellekte tutuluyor, böylece çok ziyaretçi gelse bile Spotify'a giden istek sayısı sabit kalıyor.

\`\`\`ts
return Response.json(nowPlaying, {
  headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" },
});
\`\`\`

## Tarayıcı tarafı

Kutu 30 saniyede bir yeniden soruyor. Şarkı çalıyorsa ilerleme çubuğu her saniye yerelde ilerliyor; yani her saniye sunucuya gitmeden akıcı görünüyor. Kutunun boyutu sabit olduğu için veri gelince sayfa kaymıyor.
`;

const spotifyEn = `The Spotify box on the home page shows what I'm listening to right now, or the last track I played when nothing is on. Instead of a third-party service it talks to the Spotify Web API directly.

## One-time authorisation

Spotify needs my permission to read my account, so I do it once and keep a long-lived **refresh token**. A small helper script handles it: it starts a temporary server on \`127.0.0.1:8888\`, prints the consent link and exchanges the returned code for a token. It only asks for two scopes: \`user-read-currently-playing\` and \`user-read-recently-played\`.

## On the server

Each request swaps the refresh token for a short-lived access token, then tries two steps:

1. \`/me/player/currently-playing\`: if a track is actually playing, return it.
2. Otherwise \`/me/player/recently-played?limit=1\`: return the last track.

"Not playing" turned out to have more shapes than I expected: an empty response (204), an ad or a podcast (\`item: null\`), or paused playback. All of them fall through to step two. Any error returns \`null\` and the box switches to a quiet state; the page never breaks.

Secrets never reach the browser: it only calls the site's own \`/api/spotify\`. That response is cached for 30 seconds, so the number of calls to Spotify stays flat no matter how many visitors arrive.

\`\`\`ts
return Response.json(nowPlaying, {
  headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" },
});
\`\`\`

## In the browser

The box asks again every 30 seconds. While a track plays, the progress bar advances locally every second, so it looks smooth without hitting the server each second. The box has a fixed size, so nothing shifts when data arrives.
`;

const seoTr = `Bu site Türkçe ve İngilizce. İki dilli bir sitede asıl iş çeviri değil; arama motorlarına hangi sayfanın hangi dilde olduğunu ve birbirlerinin karşılığı olduğunu anlatmak.

## Her dilin kendi adresi

Her sayfanın iki adresi var: \`/tr/blog\` ve \`/en/blog\`. Dil bilgisi çerez ya da tarayıcı ayarında saklı değil, adresin içinde; böylece arama motoru iki sürümü de ayrı ayrı görüp dizine ekleyebiliyor.

## Otomatik dil seçimi

Biri doğrudan \`vezironi.com\` adresine geldiğinde tarayıcının gönderdiği \`Accept-Language\` başlığına bakıyorum. \`tr-TR,tr;q=0.9,en;q=0.8\` gibi bir değeri öncelik puanlarına göre sıralayıp desteklediğim ilk dili seçiyorum. Ziyaretçi daha önce dili elle değiştirdiyse çerezdeki seçim kazanıyor. Arama motoru botları genelde bu başlığı göndermediği için onlara varsayılan olarak İngilizce açılıyor.

Bu yönlendirme kalıcı değil (307), çünkü sonuç ziyaretçiye göre değişiyor. Eski sitedeki \`/about\` gibi adresler ise kalıcı (301) yönlendirmeyle yeni karşılıklarına gidiyor.

## hreflang ve x-default

Her sayfanın başında diğer dil sürümünü gösteren etiketler var:

\`\`\`html
<link rel="alternate" hreflang="tr" href="https://vezironi.com/tr/blog" />
<link rel="alternate" hreflang="en" href="https://vezironi.com/en/blog" />
<link rel="alternate" hreflang="x-default" href="https://vezironi.com/en/blog" />
\`\`\`

\`x-default\`, dili eşleşmeyen ziyaretçiler için hangi sürümün açılacağını söylüyor. Bir blog yazısı sadece tek dilde yazılmışsa diğer dilin etiketi hiç eklenmiyor ve o dildeki adres 404 dönüyor; olmayan bir sayfayı arama motoruna göstermiyorum.

## Site haritası ve yapılandırılmış veri

\`sitemap.xml\` her adresi, diğer dildeki karşılığıyla birlikte listeliyor. Ana sayfada kim olduğumu anlatan \`Person\`, blog yazılarında \`BlogPosting\` türünde yapılandırılmış veri var. Her sayfanın paylaşım görseli de otomatik üretiliyor.

## Test sürümü dizine girmesin

Siteyi canlıya almadan önce ayrı bir test adresinde deniyorum. Orada tek bir ayarla bütün sayfalar "dizine ekleme" diyor ve \`robots.txt\` her şeyi kapatıyor; böylece test sürümü canlı siteyle yarışmıyor.
`;

const seoEn = `This site is in Turkish and English. On a bilingual site the real work isn't translation; it's telling search engines which page is in which language and that they're versions of each other.

## Every language gets its own URL

Each page has two addresses: \`/tr/blog\` and \`/en/blog\`. The language lives in the URL rather than a cookie or a browser setting, so a search engine can see and index both versions separately.

## Choosing a language automatically

When someone lands on \`vezironi.com\` directly, I look at the \`Accept-Language\` header the browser sends. A value like \`tr-TR,tr;q=0.9,en;q=0.8\` is ranked by its quality scores and the first supported language wins. If the visitor has switched languages before, the choice stored in a cookie takes priority. Crawlers usually don't send the header, so they get English by default.

That redirect is temporary (307) because the result depends on the visitor. Old URLs from the previous site, like \`/about\`, use permanent (301) redirects to their new equivalents.

## hreflang and x-default

Every page's head points at its other language version:

\`\`\`html
<link rel="alternate" hreflang="tr" href="https://vezironi.com/tr/blog" />
<link rel="alternate" hreflang="en" href="https://vezironi.com/en/blog" />
<link rel="alternate" hreflang="x-default" href="https://vezironi.com/en/blog" />
\`\`\`

\`x-default\` says which version to show visitors whose language doesn't match. If a post exists in only one language, the other language's tag is left out and that URL returns 404; I never point a search engine at a page that doesn't exist.

## Sitemap and structured data

\`sitemap.xml\` lists every URL together with its counterpart in the other language. The home page carries \`Person\` structured data and posts carry \`BlogPosting\`. Each page's share image is generated automatically, too.

## Keeping the staging site out of the index

Before going live I test on a separate staging address. One setting there marks every page "noindex" and closes everything in \`robots.txt\`, so the staging copy never competes with the real site.
`;

const npmTr = `Veyra UI'ı yalnızca bir demo sitesi olarak bırakmak istemedim; başka projelerde de kullanabilmek için npm'e paket olarak yayınladım: \`@vezironi/veyra-ui\`. Bu yazıda bir Vue bileşen kitini paketlerken dikkat ettiğim noktaları topluyorum.

## Kapsamlı (scoped) bir isim

Paketi kendi kullanıcı adımın altında, \`@vezironi/\` kapsamıyla yayınladım. Böylece isim çakışması derdi olmuyor ve hangi paketlerin bana ait olduğu tek bakışta anlaşılıyor. Kapsamlı paketler varsayılan olarak gizli sayıldığı için ilk yayında herkese açık olduğunu belirtmek gerekiyor:

\`\`\`bash
npm publish --access public
\`\`\`

## Vue'yu pakete gömmemek

Vue, paketin bağımlılığı değil, **eş bağımlılığı** (peer dependency). Böylece paketi kuran proje kendi Vue sürümünü kullanıyor ve sayfada iki ayrı Vue kopyası oluşmuyor:

\`\`\`json
{
  "peerDependencies": {
    "vue": "^3.5.0"
  }
}
\`\`\`

## Temalar

Kit Tailwind CSS v4 ile yazıldı ve hem koyu hem açık tema içeriyor. Renkleri sabit değerler yerine CSS değişkenleri üzerinden vermek, kullananın kendi temasını birkaç satırla uygulayabilmesini sağlıyor.

## Lisans

Paketi MIT lisansıyla yayınladım: herkes kullanabilir, değiştirebilir ve kendi projesine ekleyebilir.

## Kurulum

\`\`\`bash
npm i @vezironi/veyra-ui
\`\`\`

Bileşenlerin canlı örneklerine ve belgelere [veyra.vezironi.com](https://veyra.vezironi.com/) adresinden, kaynak koduna [GitHub](https://github.com/vezironi/veyra-ui) üzerinden ulaşabilirsin.
`;

const npmEn = `I didn't want Veyra UI to stay a demo site, so I published it to npm as a package I can reuse elsewhere: \`@vezironi/veyra-ui\`. Here are the points I paid attention to when packaging a Vue component kit.

## A scoped name

The package lives under my own \`@vezironi/\` scope, so there are no name clashes and it's obvious at a glance which packages are mine. Scoped packages are private by default, so the first publish has to say it's public:

\`\`\`bash
npm publish --access public
\`\`\`

## Don't bundle Vue

Vue is a **peer dependency**, not a regular one. The project installing the kit uses its own Vue version and you never end up with two copies of Vue on the page:

\`\`\`json
{
  "peerDependencies": {
    "vue": "^3.5.0"
  }
}
\`\`\`

## Themes

The kit is built with Tailwind CSS v4 and ships dark and light themes. Exposing colours as CSS variables instead of fixed values means anyone can apply their own theme in a few lines.

## License

It's published under the MIT license: anyone can use it, change it and include it in their own projects.

## Install

\`\`\`bash
npm i @vezironi/veyra-ui
\`\`\`

Live examples and docs are at [veyra.vezironi.com](https://veyra.vezironi.com/), and the source is on [GitHub](https://github.com/vezironi/veyra-ui).
`;

const githubTr = `Ana sayfadaki katkı grafiği, GitHub profilimdeki yeşil kareli takvimin sitedeki karşılığı. Hazır bir görsel kullanmak yerine veriyi çekip grafiği kendim çiziyorum; böylece sitenin renkleri ve iki dil desteğiyle uyumlu oluyor.

## Veri nereden geliyor?

İki yol var:

1. **Token varsa:** GitHub'ın resmi GraphQL API'si. \`contributionsCollection\` sorgusu son bir yılın her günü için katkı sayısını döndürüyor.
2. **Token yoksa:** GitHub'ın profil sayfasında gösterdiği takvimin herkese açık hâli. Bu sayfadaki her hücrede tarih, ipucu metninde ise o günün katkı sayısı yazıyor; bunları okuyup aynı veriye ulaşıyorum.

İkinci yol sayesinde site hiçbir anahtar girilmeden de çalışıyor. Ama sayfanın yapısı GitHub tarafından değiştirilebileceği için canlıda resmi API'yi tercih ediyorum.

## Renk seviyeleri

Her günün sayısını 0–4 arasında bir seviyeye çeviriyorum. Hiç katkı yoksa 0; diğerleri yılın en yüksek gününe göre dörde bölünüyor:

\`\`\`ts
const step = max / 4;
const level = count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(count / step)));
\`\`\`

Renkler sabit değil; sitenin vurgu rengiyle arka planın karışımı. Bu yüzden grafik açık ve koyu temada kendiliğinden uyum sağlıyor.

## Çizim

Grafik, sunucuda üretilen tek bir SVG: 53 hafta × 7 gün. Her karenin içinde tarih ve sayıyı söyleyen bir başlık var; fareyle üstüne gelince JavaScript'e gerek kalmadan ipucu olarak görünüyor. Ay adları da sayfanın diline göre yazılıyor.

## Önbellek

Bu veri gün içinde pek değişmediği için günde bir kez yenileniyor. GitHub'a ulaşılamazsa grafiğin yerinde aynı boyutta sade bir "şu an alınamadı" mesajı çıkıyor; sayfa kaymıyor ve bozulmuyor.
`;

const githubEn = `The contribution graph on the home page is the site's take on the green calendar from my GitHub profile. Instead of embedding an image, I fetch the data and draw the graph myself so it matches the site's colours and both languages.

## Where the data comes from

There are two paths:

1. **With a token:** GitHub's official GraphQL API. The \`contributionsCollection\` query returns a contribution count for every day of the past year.
2. **Without a token:** the public version of the calendar GitHub shows on profile pages. Each cell carries its date and its tooltip carries that day's count, so reading them gives the same data.

The second path means the site works with no keys at all. Because GitHub can change that page's structure at any time, production uses the official API.

## Colour levels

Each day's count becomes a level from 0 to 4. Zero contributions is 0; everything else is split into quarters of the busiest day of the year:

\`\`\`ts
const step = max / 4;
const level = count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(count / step)));
\`\`\`

The colours aren't hard-coded; they're a mix of the site's accent colour and the background, so the graph adapts to light and dark themes on its own.

## Drawing

The graph is a single SVG rendered on the server: 53 weeks × 7 days. Every square has a title with the date and count, which shows up as a tooltip on hover without any JavaScript. Month names follow the page language.

## Caching

The data barely changes during a day, so it refreshes once a day. If GitHub can't be reached, a quiet "unavailable right now" message of the same size takes its place, so the page never shifts or breaks.
`;

export const launchPostsSeed: SeedPost[] = [
  {
    slug: "how-i-built-this-site",
    titleTr: "Bu siteyi nasıl yaptım?",
    titleEn: "How I built this site",
    excerptTr: "Next.js 16, etiketli önbellek, iki dil ve blueprint tasarım: yeni portfolyomun arkasındaki kararlar.",
    excerptEn: "Next.js 16, tagged caching, two languages and a blueprint design: the decisions behind my new portfolio.",
    bodyTr: howIBuiltThisSiteTr,
    bodyEn: howIBuiltThisSiteEn,
    tags: ["nextjs", "portfolio"],
    publishedAt: "2026-10-18",
    status: "published",
  },
  {
    slug: "isometric-svg-logo",
    titleTr: "İzometrik VO logosunu SVG ile çizmek",
    titleEn: "Drawing the isometric VO logo in SVG",
    excerptTr: "Bir izdüşüm fonksiyonu, görünür yüzey testi ve imleci takip eden bir ışık: ana sayfadaki figür nasıl çiziliyor?",
    excerptEn: "One projection function, a visibility test and a glow that follows the cursor: how the home page figure is drawn.",
    bodyTr: isometricLogoTr,
    bodyEn: isometricLogoEn,
    tags: ["svg", "design"],
    publishedAt: "2026-10-14",
    status: "published",
  },
  {
    slug: "spotify-now-playing-card",
    titleTr: "Spotify \"şu an dinliyor\" kartı",
    titleEn: "A Spotify \"now playing\" card",
    excerptTr: "Spotify Web API ile o an çalan şarkıyı, çalmıyorsa en son dinleneni göstermek.",
    excerptEn: "Showing the track that's playing right now, or the last one played, with the Spotify Web API.",
    bodyTr: spotifyTr,
    bodyEn: spotifyEn,
    tags: ["spotify", "api"],
    publishedAt: "2026-10-09",
    status: "published",
  },
  {
    slug: "bilingual-seo-nextjs",
    titleTr: "İki dilli bir siteyi arama motorlarına doğru anlatmak",
    titleEn: "Explaining a bilingual site to search engines",
    excerptTr: "Dile göre adresler, otomatik dil seçimi, hreflang, x-default ve site haritası.",
    excerptEn: "Per-language URLs, automatic language detection, hreflang, x-default and the sitemap.",
    bodyTr: seoTr,
    bodyEn: seoEn,
    tags: ["seo", "nextjs", "i18n"],
    publishedAt: "2026-10-03",
    status: "published",
  },
  {
    slug: "publishing-vue-components-to-npm",
    titleTr: "Bir Vue bileşen kitini npm'e yayınlamak",
    titleEn: "Publishing a Vue component kit to npm",
    excerptTr: "@vezironi/veyra-ui: kapsamlı isim, eş bağımlılık olarak Vue, temalar ve lisans.",
    excerptEn: "@vezironi/veyra-ui: a scoped name, Vue as a peer dependency, themes and licensing.",
    bodyTr: npmTr,
    bodyEn: npmEn,
    tags: ["vue", "npm", "open-source"],
    publishedAt: "2026-09-26",
    status: "published",
  },
  {
    slug: "github-contribution-graph",
    titleTr: "GitHub katkı grafiğini sitede göstermek",
    titleEn: "Showing my GitHub contribution graph",
    excerptTr: "Resmi API ya da herkese açık takvim: veriyi çekip grafiği sitenin renkleriyle çizmek.",
    excerptEn: "Official API or the public calendar: fetching the data and drawing the graph in the site's colours.",
    bodyTr: githubTr,
    bodyEn: githubEn,
    tags: ["github", "svg"],
    publishedAt: "2026-09-19",
    status: "published",
  },
];
