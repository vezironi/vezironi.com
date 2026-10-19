import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "404 — Vezir Oni",
  robots: { index: false, follow: false },
};

// Rendered outside the [locale] layout, so the language is unknown: show both.
// The theme follows the system setting via a tiny inline script (no next-themes here).
export default function GlobalNotFound() {
  return (
    <html lang="tr" className={`${jakarta.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="grid min-h-dvh place-items-center bg-blueprint px-6 font-sans">
        <main className="w-full max-w-md rounded-xl border border-line bg-surface p-8 text-center">
          <p className="font-mono text-xs tracking-[0.12em] text-accent uppercase">{"// 404"}</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Sayfa bulunamadı</h1>
          <p className="mt-1 text-sm text-muted" lang="en">
            Page not found
          </p>
          <div className="mt-6 flex justify-center gap-2 text-sm">
            <Link href="/tr" className="rounded-md border border-line px-3 py-1.5 transition-colors hover:border-accent">
              Ana sayfa
            </Link>
            <Link href="/en" lang="en" className="rounded-md border border-line px-3 py-1.5 transition-colors hover:border-accent">
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
