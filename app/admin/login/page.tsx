import { Suspense } from "react";

const ERRORS: Record<string, string> = {
  forbidden: "Bu Discord hesabının yönetim paneline erişimi yok.",
  state: "Oturum doğrulanamadı. Lütfen tekrar dene.",
  failed: "Discord ile giriş başarısız oldu. Lütfen tekrar dene.",
  config: "Discord girişi yapılandırılmamış (AUTH_DISCORD_ID / AUTH_DISCORD_SECRET / AUTH_SECRET).",
};

async function ErrorMessage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <p role="alert" className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-500">
      {ERRORS[error] ?? ERRORS.failed}
    </p>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="grid min-h-dvh place-items-center bg-blueprint px-6">
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-8">
        <p className="font-mono text-xs tracking-[0.12em] text-accent uppercase">{"// yönetim"}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          VO<span className="text-accent">.</span> panel
        </h1>
        <p className="mt-1 text-sm text-muted">Devam etmek için Discord hesabınla giriş yap.</p>
        <Suspense>
          <ErrorMessage searchParams={searchParams as Promise<{ error?: string }>} />
        </Suspense>
        {/* A full navigation to the OAuth route handler, not a client-side page transition. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/auth/login"
          className="mt-6 flex h-10 items-center justify-center gap-2 rounded-md bg-[#5865f2] text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
            <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.4 18.4 0 0 0-5.6 0L8.6 3a19.7 19.7 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18.1a19.9 19.9 0 0 0 6 3l1.3-2a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.2-.9-9.7-3.6-13.7ZM8 15.4c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.6 8 10.6s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
          </svg>
          Discord ile giriş yap
        </a>
        {/* Different root layout: a full page load is required. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="mt-4 block text-center font-mono text-[11px] text-subtle hover:text-fg">
          ← siteye dön
        </a>
      </div>
    </main>
  );
}
