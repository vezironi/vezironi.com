# vezironi.com v2 — Tasarım Belgesi

Tarih: 2026-10-19 · Branch: `v2.0.0`

## 1. Amaç ve neden

Vezir Oni'nin kişisel portfolyo sitesini sıfırdan yeniden kurmak. İlham kaynağı https://chanhdai.com/ — özellikle header altındaki interaktif izometrik logo figürü, GitHub katkı grafiği ve tarihli Stack / Experience bölümleri. **Ama site özgün olacak:** chanhdai.com'un kodundan, SVG'sinden, metinlerinden veya varlıklarından hiçbir şey kopyalanmayacak; birebir aynı görünmeyecek.

Site; projeleri (ekran görüntüsü önizlemeli), referansları, deneyimi ve canlı durumu (Discord + Spotify) gösterecek, iki dilli olacak, SEO açısından en iyi şekilde kurulacak ve tüm içerik Discord ile girilen bir admin panelinden düzenlenebilecek.

Kullanıcı tercihi: süreç boyunca **inisiyatif alınmayacak, belirsiz noktalarda kullanıcıya sorulacak.**

## 2. Hedefler

- Blueprint görsel kimliğiyle (aşağıda) özgün, hızlı, tek sütunlu bir portfolyo.
- TR + EN, tarayıcı diline göre otomatik yönlendirme.
- Maksimum SEO: içerik sunucuda statik HTML olarak üretilir, botlar her zaman tam içeriği görür.
- Tüm içerik admin panelinden düzenlenebilir; kod değişikliği gerekmez.
- Tamamen ücretsiz planlarla çalışır (Vercel Hobby, Neon Free, Vercel Blob, Resend Free).

## 3. Hedef olmayanlar

- Hakkımda (`/about`) ve Hizmetler (`/services`) sayfaları **kaldırıldı**.
- Blog yorumları, bülten, RSS dışı abonelik yok.
- Çok kullanıcılı admin yok — tek yetkili kişi.
- Otomatik çeviri yok; TR ve EN metinleri kullanıcı kendisi yazar.
- Proje detay sayfaları yok — proje kartı doğrudan canlı siteye gider.

## 4. Anti-hedefler (teknik olarak çalışsa bile başarısızlık sayılır)

- chanhdai.com'dan kod/SVG/varlık kopyalamak veya onun klonu gibi görünmek.
- İçeriğin istemci tarafında (client-only) render edilmesi yüzünden botların boş sayfa görmesi.
- Canlı widget'ların (Spotify/Discord/GitHub) sayfa yüklemesini yavaşlatması veya hata verince sayfayı bozması.
- Admin paneline Discord ID'si eşleşmeyen birinin girebilmesi.
- Test adresinin (`v2.vezironi.com`) arama motorlarında indekslenmesi.

## 5. Teknoloji (karar: Claude, kullanıcı SEO için en iyisini istedi)

| Alan | Seçim |
|---|---|
| Framework | Next.js (App Router, güncel kararlı sürüm), React 19, TypeScript |
| Stil | Tailwind CSS v4 |
| Paket yöneticisi | Bun |
| Hosting | Vercel (Hobby) — eski repoda `vercel.json` vardı |
| Veritabanı | Neon Postgres (Vercel Marketplace üzerinden tek tıkla) + Drizzle ORM |
| Dosya deposu | Vercel Blob (galeri, proje görselleri, blog görselleri, logolar) |
| Auth | Auth.js (NextAuth v5) + Discord OAuth2 provider |
| E-posta | Resend (vezironi.com alan adı doğrulanır) |
| Analitik | Vercel Web Analytics |
| Tema | next-themes (system varsayılan + manuel toggle) |
| Komut menüsü | cmdk |

Supabase değerlendirildi; ücretsiz planda 1 hafta kullanılmayınca projeyi duraklattığı için elendi.

## 6. Görsel kimlik — "Blueprint" (kullanıcı seçti: A)

- Koyu zemin (~`#0a0a0b`), ince ızgara deseni, bölümler arası **kesikli** ayraçlar, tek vurgu rengi **lime** (`#a3e635` civarı; koyu gölge tonu `#3f6212`).
- Bölüm başlıkları monospace, büyük harf, `//` önekli (ör. `// Projeler`), sağda küçük gri meta etiketi.
- **Tema:** varsayılan sistem teması (`prefers-color-scheme`); header'da açık/koyu toggle. Açık tema Claude tarafından tasarlanacak: açık zemin + ince ızgara + aynı lime'ın okunabilir koyu tonu. (Kullanıcı yapım sırasında bakmak isteyebilir.)
- Onaylanan mockup: `.superpowers/brainstorm/*/content/home-layout.html`.

## 7. Sayfa yapısı ve URL'ler

- `/` → `Accept-Language`'e göre `/tr` veya `/en`'e yönlendirir. Kullanıcı dil değiştirince seçimi cookie'de saklanır ve öncelik alır. Dil bilgisi yoksa (botlar) → `/en`.
- `/{locale}` — Ana sayfa
- `/{locale}/blog`, `/{locale}/blog/[slug]`
- `/{locale}/gallery` (TR'de de aynı slug; Claude'un kararı — basitlik için slug'lar dil başına çevrilmez)
- `/{locale}/contact`
- `/admin/**` — dil öneki yok, arayüz Türkçe (Claude'un kararı), `noindex`.
- Eski URL'ler: `/about`, `/services` → `/{locale}`'e 301; `/blog/*`, `/gallery`, `/contact` → dil önekli karşılığına yönlendirilir (Claude'un kararı). Karşılığı olmayan eski blog yazıları → `/{locale}/blog` (bkz. §9.6).

### Ana sayfa bölüm sırası (kullanıcı onayladı)

1. **Header** — `VO` monogram (ana sayfaya link), Blog · Galeri · İletişim, ⌘K butonu, TR/EN değiştirici, tema toggle.
2. **VO figürü** — bkz. §8.
3. **Giriş** — ad, unvan, giriş metni, sosyal linkler.
4. **Durum** — iki kutu: Discord (Lanyard) + Spotify.
5. **Projeler** — 6 kart, ekran görüntüsü + logo + ad; tıklayınca yeni sekmede canlı site.
6. **Referanslar** — logo + ad listesi.
7. **Deneyim** — tarihli zaman çizelgesi.
8. **Stack** — Teknolojiler ve Araçlar, ikonlu çipler.
9. **GitHub katkı grafiği** — son 12 ay.
10. **Son blog yazıları** — son 3 yazı + "Tümü →".
11. **Footer** — © yıl, sosyal linkler.

## 8. VO figürü (header altındaki interaktif figür)

- "VO" (Vezir Oni) harfleri, izometrik projeksiyonda çizgisel (line-art) SVG olarak **sıfırdan** çizilir. Üst yüzeyler çapraz çizgi (hatch) desenli, kenarlar ince stroke.
- Arkada ızgara ve figürü kesen birkaç kesikli kılavuz çizgisi (blueprint teknik çizim hissi).
- **İmleci takip eder:** stroke üzerinde imleç konumuna göre hareket eden radyal lime parlama.
- **Tıklanınca tepki:** kısa bir ses (Web Audio API ile sentezlenmiş, harici ses dosyası yok — Claude'un kararı) + küçük bir görsel tepki (ör. harflerin hafifçe "basılması").
- Köşede `Fig. 01` benzeri altyazı; geniş ekranda yanında küçük açıklama notu ("imleci takip eder · tıkla").
- Dokunmatik cihazlarda imleç takibi yok, dokunma tepkisi var. `prefers-reduced-motion` saygı görür.
- Erişilebilirlik: dekoratif → `aria-hidden`.

## 9. İçerik (başlangıç verisi — seed)

### 9.1 Site ayarları
- Ad: **Vezir Oni**
- Unvan: **Full Stack Developer**
- Giriş (TR): "Full Stack Developer ve bağımsız yazılım girişimcisiyim. Web uygulamaları, backend sistemleri ve FiveM scriptleri geliştiriyor; kendi dijital ürünlerimi ve platformlarımı oluşturarak fikirleri ölçeklenebilir, gerçek dünya çözümlerine dönüştürüyorum."
- Giriş (EN): Claude çevirir, kullanıcı kontrol eder.
- Sosyal: GitHub `https://github.com/vezironi` · E-posta `contact@vezironi.com` · Discord `vezironi.` (ID `1517800496029630556`) · X `https://x.com/vezir_oni`

### 9.2 Projeler (6)
| Ad | URL |
|---|---|
| Keyra | https://keyra.live/ |
| Mazlum Admin | https://demo.mazlumadmin.com/ |
| Veyra | https://veyra.vezironi.com/ |
| White Bilişim | https://whitebilisim.com/ |
| 0Resmon | https://0resmon.tebex.io/ |
| Hype Scripts | https://hypescripts.net/ |

- **Ekran görüntüleri:** Claude her sitenin ekran görüntüsünü tarayıcıyla (Playwright) çeker, WebP'ye çevirir.
- **Logolar:** 0Resmon ve White Bilişim logoları git geçmişinden (`public/references/*_logo.webp`, commit `3485855`); diğer dördü Claude tarafından sitelerinden (header logosu veya favicon) çekilir.
- **Açıklama, teknolojiler, yıl:** Claude sitelerden yola çıkarak TR+EN **taslak** yazar; **kullanıcı düzeltecek** — yayın öncesi kullanıcıya gösterilmeli.
- **Banner:** şimdilik yok; veri modelinde isteğe bağlı alan olarak bulunur, kullanıcı sonra ekleyebilir.

### 9.3 Referanslar (5)
0Resmon, White Bilişim, BORP, FastScript, Night — logolar git geçmişinden (`public/references/*_logo.webp`). Link alanı isteğe bağlı; başlangıçta 0Resmon ve White Bilişim için proje URL'leri, diğerleri boş.

### 9.4 Deneyim (yeniden eskiye)
| Tarih | Yer | Rol |
|---|---|---|
| 2026 – Şimdi | Hype Scripts | Kurucu |
| 2024 – 2026 | 0Resmon | Full Stack Developer |
| 2024 | 88Studios | Full Stack Developer |
| 2023 – 2024 | HDScripts | Kurucu (Tebex mağazası) |
| 2022 – 2024 | BiOnluk | Freelance Web Developer |
| 2021 – 2022 | Kobi Bilişim Güvenlik | Siber Güvenlik Stajyeri |

Kısa TR/EN açıklamalar Claude taslağı; kullanıcı kontrol eder. HDScripts rolü "Kurucu" Claude'un yorumu.

### 9.5 Stack
- Teknolojiler: Next.js, Astro, React, Vue, TypeScript, JavaScript, SQL, Lua, Express.js
- Araçlar: Docker, Postman, Termius, Figma, Git, GitHub, HeidiSQL, MariaDB
- İkonlar Simple Icons'tan; harici CDN'e runtime bağımlılığı yerine SVG'ler projeye/Blob'a alınır (Claude'un kararı, performans ve kararlılık için).

### 9.6 Blog
- Bir adet **test yazısı**, TR + EN: başlık, liste, kod bloğu, tablo, link, görsel içerir (eski "Next.js Performance Notes" benzeri). Eskileri gibi **yayında** olacak (kullanıcı "eskisi gibi test için" dedi).
- Eski iki yazı (`welcome-to-my-blog`, `nextjs-performance-notes`) taşınmaz; eski `/blog/<slug>` URL'leri, yeni sitede karşılığı yoksa 404 yerine `/{locale}/blog`'a 301 yönlendirilir (Claude'un kararı).

### 9.7 Galeri başlangıcı
- Başlangıçta boş olabilir. Galeri boşken sayfa `noindex`, sitemap'te yok, nav ve ⌘K'da gizli; ilk fotoğraf eklenince otomatik görünür olur (Claude'un kararı).

## 10. Canlı widget'lar

### 10.1 Spotify (Lanyard'dan bağımsız, Spotify Web API)
- Sunucu tarafı route: refresh token ile access token alır (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`).
- Mantık: `currently-playing` → çalıyorsa onu göster ("Şu an dinliyor"); boşsa `recently-played?limit=1` → "En son dinlenen".
- Scope'lar: `user-read-currently-playing`, `user-read-recently-played`.
- Kullanıcının Spotify hesabı **Premium** (kullanıcı doğruladı) — Development Mode uygulamalarının sahibine Premium gerektiren 2026 kısıtlamasının bir engel olmaması beklenir; kurulumda güncel Spotify kuralları yine kontrol edilir.
- Kısa süreli önbellek (~30 sn). İstemci periyodik yeniler. Hata durumunda kutu sessizce gizlenir veya nötr durum gösterir.
- Gösterim: albüm kapağı, şarkı, sanatçı, Spotify linki; çalıyorsa ilerleme çubuğu.
- Kullanıcıya refresh token alma rehberi verilecek (bir kerelik yetkilendirme yardımcı script'i/route'u — Claude'un kararı).

### 10.2 Discord (Lanyard — kullanıcı onayladı)
- Kullanıcı ID `1517800496029630556`; kullanıcının Lanyard Discord sunucusunda olması gerekir.
- İstemci tarafı (WebSocket veya REST polling). Durum noktası (online/idle/dnd/offline) + aktif aktivite.

### 10.3 GitHub katkı grafiği
- GitHub GraphQL `contributionsCollection` (kullanıcı `vezironi`), `GITHUB_TOKEN` ile sunucuda çekilir, günde bir yeniden doğrulanır.
- Grafik kendi bileşenimizle (SVG/grid) çizilir, lime tonlarında 4–5 seviye; hover'da tarih + sayı.

## 11. Admin paneli (`/admin`)

- **Giriş:** Auth.js + Discord OAuth2. Oturum açılınca Discord kullanıcı ID'si `ADMIN_DISCORD_ID` (= `1517800496029630556`) ile karşılaştırılır; eşleşmezse erişim reddedilir. Tüm admin route'ları ve server action'ları sunucu tarafında yetki kontrolü yapar (sadece middleware'e güvenilmez).
- `noindex`, robots'ta `Disallow: /admin`.
- Modüller:
  - **Blog:** Markdown editör + canlı önizleme; TR/EN sekmeleri; slug, etiketler, tarih, özet, taslak/yayında; editörden görsel yükleme (Blob). Bir dil boşsa yazı yalnızca dolu dilde yayınlanır, hreflang eşleşmesi kurulmaz (Claude'un kararı).
  - **Galeri:** sürükle-bırak toplu yükleme, sürükleyerek sıralama, isteğe bağlı TR/EN açıklama, tarih, silme. (Kullanıcı onayladı.)
  - **Projeler:** ad, URL, logo, ekran görüntüsü, isteğe bağlı banner, TR/EN açıklama, teknolojiler, yıl, sıralama, görünür/gizli.
  - **Referanslar:** ad, logo, isteğe bağlı link, sıralama.
  - **Deneyimler:** şirket, TR/EN rol, TR/EN açıklama, başlangıç, bitiş veya "şimdi", sıralama.
  - **Stack:** kategori (teknoloji/araç), ad, ikon, sıralama.
  - **Site ayarları:** ad, TR/EN unvan ve giriş metni, sosyal linkler.
  - **Gelen kutusu:** iletişim mesajları listesi, okundu/okunmadı, silme. (Kullanıcı onayladı.)
- Kayıt sonrası ilgili sayfalar on-demand revalidation (`revalidateTag`/`revalidatePath`) ile yeniden üretilir.
- Görsel yüklemelerinde boyut/tip doğrulaması; mümkünse yüklemede WebP'ye optimize (Claude'un kararı).

## 12. İletişim formu

- Alanlar: ad, e-posta, konu (isteğe bağlı), mesaj. Sunucu tarafı doğrulama (zod).
- Gönderim: mesaj DB'ye yazılır (gelen kutusu) **ve** Resend ile `contact@vezironi.com`'a e-posta gider; `reply-to` = ziyaretçinin e-postası. Gönderen adres örn. `no-reply@vezironi.com`.
- Spam koruması (Claude'un kararı): honeypot alanı + IP hash'ine göre DB tabanlı rate limit (ör. 10 dk'da 3 mesaj). İleride Cloudflare Turnstile eklenebilir.
- Başarılı / hatalı gönderim için net geri bildirim.

## 13. ⌘K komut menüsü

Ctrl/⌘+K veya header butonu ile açılır. İçerik (kullanıcı onayladı):
- Sayfalara git (Ana sayfa, Blog, Galeri, İletişim)
- Blog yazıları ve projelerde arama
- Tema değiştir (açık/koyu/sistem)
- Dil değiştir (TR/EN)
- E-postayı kopyala

## 14. SEO

- Tüm herkese açık sayfalar sunucuda render; içerik DB'den gelir ama statik üretilir + on-demand revalidation.
- `<html lang>` dile göre.
- Her sayfa için `generateMetadata`: başlık, açıklama, canonical, `alternates.languages` (tr, en, `x-default` → en).
- `sitemap.xml`: tüm dil sürümleri + hreflang alternates, blog yazıları dahil.
- `robots.txt`: `/admin`, `/api` hariç.
- JSON-LD: `Person` (ana sayfa; sameAs = sosyal linkler), `WebSite`, `BlogPosting` (yazılar), `ImageGallery`/`CollectionPage` (galeri), `ContactPage`.
- OG/Twitter görselleri: `next/og` ile sayfa başına dinamik, blueprint stilinde (Claude'un kararı).
- Görseller `next/image`, açık `width/height`, alt metinler (proje adı vb.).
- Core Web Vitals: canlı widget'lar istemci tarafında, yer tutucu boyutlarıyla (CLS olmadan) yüklenir; VO figürü hafif inline SVG.
- Site URL: `https://vezironi.com`.

## 15. Veri modeli (özet — ayrıntı planlayıcıya)

`site_settings` (tekil), `projects`, `references`, `experiences`, `stack_items`, `posts` (TR/EN alanları veya `post_translations`), `gallery_items`, `messages`, `rate_limits` (veya messages üzerinden sayım). Çok dilli alanlar `*_tr` / `*_en` kolonları olarak tutulabilir — seçim planlayıcının.

## 16. Ortam değişkenleri

`DATABASE_URL` (Neon), `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, `ADMIN_DISCORD_ID`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `GITHUB_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `LANYARD_DISCORD_ID` (veya sabit).

Kullanıcının yapması gerekenler (rehber verilecek): Discord Developer Portal'da OAuth uygulaması, Spotify Developer uygulaması + refresh token, Neon ve Blob'u Vercel'den bağlamak, Resend'de alan adı doğrulama, GitHub token, Lanyard sunucusuna katılmak.

## 17. Yayına alma (kullanıcı seçti: önce test adresi)

1. v2, `v2.0.0` branch'inden Vercel'de **sabit test alt alan adına** (`v2.vezironi.com`) deploy edilir; eski site `main`'de, vezironi.com'da canlı kalır.
2. Discord OAuth callback'i, Auth.js URL'i ve `NEXT_PUBLIC_SITE_URL` test aşamasında `v2.vezironi.com`'u gösterir. Test adresi tamamen `noindex` (robots + meta) — eski siteyle çakışan içerik indekslenmesin.
3. Kullanıcı içeriği test adresinde kontrol eder, admin panelinden düzeltir (§19'daki açık noktalar burada kapanır). Açık temaya da burada bakılır.
4. **Tek Neon veritabanı ve tek Blob deposu** test ve canlı için ortak kullanılır; testte girilen içerik canlıya aynen taşınır (Claude'un kararı).
5. Kullanıcı onay verince: `v2.0.0` → `main` merge, vezironi.com yeni siteye bağlanır, OAuth callback ve site URL'i vezironi.com'a güncellenir, `noindex` kaldırılır, sitemap Google Search Console'a gönderilir.
6. Resend alan adı doğrulaması test aşamasında yapılır (vezironi.com DNS'i) — form testte de çalışır.

Plan, adım 3'te ve adım 5'ten önce durup kullanıcı onayı bekler.

## 18. Builder'a bırakılanlar

- Dosya/klasör yapısı, bileşen ayrımı, Drizzle şema detayları, migration yaklaşımı.
- Markdown işleme hattı (remark/rehype, kod vurgulama kütüphanesi).
- Açık tema renk tonları (test adresinde kullanıcıya gösterilir), tipografi (Geist veya benzeri), animasyon detayları — Blueprint yönüne sadık kalarak.
- Test stratejisi.

## 19. Açık noktalar (kullanıcı onayı bekleyen içerik)

- Proje açıklamaları/teknolojiler/yıllar — Claude taslağı, kullanıcı düzeltecek.
- Giriş metninin İngilizce çevirisi — kullanıcı kontrol edecek.
- Deneyim açıklamaları — Claude taslağı.
- HDScripts rolü "Kurucu" — doğrulanmalı.
