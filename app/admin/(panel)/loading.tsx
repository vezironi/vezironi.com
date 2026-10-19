// Suspense boundary for every admin page: each one reads the session at request time.
export default function Loading() {
  return <div className="p-6 font-mono text-xs text-subtle">yükleniyor…</div>;
}
