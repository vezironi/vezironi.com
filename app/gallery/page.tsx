import Navbar from "@/components/navbar";
import JsonLd from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Daily life photos and snapshots.",
  alternates: {
    canonical: "/gallery",
  },
};

const galleryItems = [
  {
    title: "Daily Frame 01",
    note: "Coffee, keyboard, planning.",
    src: "https://picsum.photos/seed/vezironi-daily-01/1200/900",
  },
  {
    title: "Daily Frame 02",
    note: "Work session snapshot.",
    src: "https://picsum.photos/seed/vezironi-daily-02/1200/900",
  },
  {
    title: "Daily Frame 03",
    note: "Outside moments and routine.",
    src: "https://picsum.photos/seed/vezironi-daily-03/1200/900",
  },
  {
    title: "Daily Frame 04",
    note: "Creative break and ideas.",
    src: "https://picsum.photos/seed/vezironi-daily-04/1200/900",
  },
  {
    title: "Daily Frame 05",
    note: "Night coding setup.",
    src: "https://picsum.photos/seed/vezironi-daily-05/1200/900",
  },
  {
    title: "Daily Frame 06",
    note: "City and breaks.",
    src: "https://picsum.photos/seed/vezironi-daily-06/1200/900",
  },
];

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Gallery",
          url: `${SITE_URL}/gallery`,
        }}
      />
      <Navbar />
      <main className="container mx-auto min-h-screen px-12 py-8">
        <section className="relative w-full overflow-hidden">
          <div className="relative flex items-center justify-between mb-5">
            <h1 className="text-lg uppercase text-neutral-50">
              <span className="tracking-[0.02px] text-blue-500">{"//"}</span> Gallery
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Daily Life
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {galleryItems.map((item) => (
              <article
                key={item.title}
                className="border border-neutral-400/20 border-dashed p-2.5 hover:border-neutral-300/60 hover:bg-neutral-400/5 transition-all duration-200"
              >
                {item.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-44 object-cover border border-neutral-400/20 border-dashed"
                  />
                ) : (
                  <div className="w-full h-44 border border-neutral-400/20 border-dashed flex items-center justify-center bg-neutral-900/30">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                      Add Photo
                    </span>
                  </div>
                )}

                <p className="text-xs text-neutral-100 mt-2.5 truncate">{item.title}</p>
                <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">{item.note}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
