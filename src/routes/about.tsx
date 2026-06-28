import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import hero from "@/assets/asset-villa.jpg";
import bg1 from "@/assets/asset-hamptons.jpg";
import bg2 from "@/assets/asset-yacht.jpg";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fortune Coastal Group" },
      { name: "description", content: "Our vision, mission, and the future of the world's premier luxury asset marketplace." },
      { property: "og:title", content: "About Fortune Coastal Group" },
      { property: "og:description", content: "A private wealth marketplace built on discretion, verification, and U.S.-focused luxury transactions." },
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

      <section className="relative overflow-hidden">
        <img src={bg1} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10 py-24 space-y-20">
          {[
            { eyebrow: "Our Vision", title: "American luxury, privately transacted.", body: "We are building a trusted marketplace for premier U.S. real estate, aviation, marine, automotive, and concierge assets — with the speed modern buyers expect and the discretion high-value transactions require." },
            { eyebrow: "Our Mission", title: "To curate, verify, and close with confidence.", body: "Fortune Coastal Group connects discerning buyers and vetted sellers across the United States. We verify every listing, review every counterpart, and support settlement in USD or Bitcoin." },
            { eyebrow: "Why FCG", title: "Discretion is our operating standard.", body: "Our clients include founders, executives, athletes, and family offices. Every interaction is handled with white-glove communication, verified inventory, and concierge-led support." },
            { eyebrow: "Platform Direction", title: "Beyond static listings.", body: "Phase 2 turns the marketplace into a live operating platform with dynamic inventory, seller onboarding, admin controls, and a U.S.-focused luxury catalog that updates in real time." },
          ].map((s, i) => (
            <div key={s.eyebrow} className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-start bg-charcoal/40 backdrop-blur-sm border-l-2 border-gold/40 p-8 lg:p-10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
              <div>
                <div className="text-[10px] tracking-luxury uppercase text-gold">{s.eyebrow}</div>
                <div className="mt-3 font-serif text-3xl gradient-gold-text">0{i + 1}</div>
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">{s.title}</h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <img src={bg2} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="text-[10px] tracking-luxury uppercase text-gold">Closing Note</div>
          <p className="mt-6 font-serif text-3xl md:text-4xl text-foreground italic leading-tight">
            "Where <span className="gradient-gold-text">Luxury</span> Meets the American Economy."
          </p>
        </div>
      </section>

    </SiteLayout>
  );
}
