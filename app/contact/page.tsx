import Navbar from "@/components/navbar";
import JsonLd from "@/components/seo/json-ld";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for website development and FiveM script projects.",
  alternates: {
    canonical: "/contact",
  },
};

const contactItems = [
  {
    label: "Email",
    value: "hello@vezironi.com",
    href: "mailto:hello@vezironi.com",
  },
  {
    label: "GitHub",
    value: "github.com/vezironi",
    href: "https://github.com/vezironi",
  },
  {
    label: "Discord",
    value: "@vezironi",
    href: "https://discord.com/users/343250347512750091",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${SITE_URL}/contact`,
          mainEntity: {
            "@type": "Person",
            name: "vezironi",
            email: "hello@vezironi.com",
            url: SITE_URL,
          },
        }}
      />
      <Navbar />
      <main className="container mx-auto min-h-screen px-12 py-8">
        <section className="relative w-full overflow-hidden">
          <div className="relative flex items-center justify-between mb-5">
            <h1 className="text-lg uppercase text-neutral-50">
              <span className="tracking-[0.02px] text-blue-500">{"//"}</span> Contact
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Open for Work
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 border border-neutral-400/20 border-dashed p-4 h-max">
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Quick Reach</p>
              <div className="mt-3 flex flex-col gap-2">
                {contactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group/item border border-neutral-400/20 border-dashed px-3 py-2 hover:border-neutral-300/70 hover:bg-neutral-400/5 transition-all duration-200"
                  >
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{item.label}</p>
                    <p className="text-sm text-neutral-200 mt-1 flex items-center justify-between gap-2">
                      <span className="truncate">{item.value}</span>
                      <i className="fa-light fa-arrow-up-right text-[10px] text-neutral-500 group-hover/item:text-neutral-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all duration-200" />
                    </p>
                  </a>
                ))}
              </div>

              <div className="mt-4 border border-neutral-400/20 border-dashed px-3 py-2.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Availability</p>
                <p className="text-sm text-neutral-200 mt-1">Taking new projects this month.</p>
              </div>
            </div>

            <div className="lg:col-span-2 border border-neutral-400/20 border-dashed p-4 md:p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Project Brief</p>

              <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3" action="mailto:hello@vezironi.com" method="post" encType="text/plain">
                <label className="flex flex-col gap-1.5 md:col-span-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="border border-neutral-400/20 border-dashed bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-300/70"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5 md:col-span-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="border border-neutral-400/20 border-dashed bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-300/70"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Subject</span>
                  <input
                    name="subject"
                    type="text"
                    placeholder="Website development / FiveM scripting"
                    className="border border-neutral-400/20 border-dashed bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-300/70"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Message</span>
                  <textarea
                    name="message"
                    rows={7}
                    placeholder="Tell me about your project goals, timeline and budget."
                    className="border border-neutral-400/20 border-dashed bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-300/70 resize-y"
                    required
                  />
                </label>

                <div className="md:col-span-2 flex items-center justify-between gap-3 pt-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                    Response time: within 24-48 hours.
                  </p>

                  <button
                    type="submit"
                    className="group/btn bg-blue-600 px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-white hover:bg-blue-500 transition-all duration-200 cursor-pointer"
                  >
                    Send Message
                    <i className="fa-light fa-arrow-up-right ml-2 text-[10px] opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
