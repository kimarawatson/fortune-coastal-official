import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import hero from "@/assets/asset-villa.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fortune Coastal Group" },
      { name: "description", content: "Our vision, mission, and the future of the world's premier luxury asset marketplace." },
      { property: "og:title", content: "About Fortune Coastal Group" },
      { property: "og:description", content: "A private wealth marketplace built on discretion, verification, and global settlement." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="relative h-[60vh] min-h-[460px] -mt-20 overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col justify-end pb-16">
          <div className="text-[10px] tracking-luxury uppercase text-gold">About FCG</div>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl text-foreground max-w-3xl leading-tight">
            A new <span className="italic gradient-gold-text">standard</span> for luxury ownership.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 lg:px-10 py-24 space-y-24">
        {[
          { eyebrow: "Our Vision", title: "Borderless luxury, settled in any currency.", body: "We envision a world where the most coveted assets — homes, jets, yachts, and experiences — can change hands across borders with the same trust and speed as the global capital that fuels them." },
          { eyebrow: "Our Mission", title: "To curate, verify, and settle.", body: "Fortune Coastal Group unifies the world's discerning buyers and sellers under a single, verified marketplace. We authenticate every listing, vet every counterparty, and concierge every settlement — in USD or Bitcoin." },
          { eyebrow: "Why FCG", title: "Discretion is not a feature. It is the foundation.", body: "Our clients include heads of state, founders, and family offices. Every transaction is bound by private-banking grade confidentiality and concierge-led care." },
          { eyebrow: "Future Roadmap", title: "Beyond the listing.", body: "Phase II brings tokenized fractional ownership, secondary-market liquidity, and a fully on-chain settlement layer — preserving the discretion our members expect." },
        ].map((s, i) => (
          <div key={s.eyebrow} className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-start">
            <div>
              <div className="text-[10px] tracking-luxury uppercase text-gold">{s.eyebrow}</div>
              <div className="mt-3 font-serif text-2xl text-muted-foreground/60">0{i + 1}</div>
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">{s.title}</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
