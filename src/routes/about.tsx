import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { BackToSiteLink } from "@/components/BackToSiteLink";
import hero from "@/assets/asset-villa.jpg";

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
          <BackToSiteLink className="mb-8 text-foreground/80 hover:text-gold" />
          <div className="text-[10px] tracking-luxury uppercase text-gold">About FCG</div>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl text-foreground max-w-3xl leading-tight">
            A new <span className="italic gradient-gold-text">standard</span> for luxury ownership.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 lg:px-10 py-24 space-y-24">
        {[
          { eyebrow: "Our Vision", title: "American luxury, privately transacted.", body: "We are building a trusted marketplace for premier U.S. real estate, aviation, marine, automotive, and concierge assets — with the speed modern buyers expect and the discretion high-value transactions require." },
          { eyebrow: "Our Mission", title: "To curate, verify, and close with confidence.", body: "Fortune Coastal Group connects discerning buyers and vetted sellers across the United States. We verify every listing, review every counterpart, and support settlement in USD or Bitcoin." },
          { eyebrow: "Why FCG", title: "Discretion is our operating standard.", body: "Our clients include founders, executives, athletes, and family offices. Every interaction is handled with white-glove communication, verified inventory, and concierge-led support." },
          { eyebrow: "Platform Direction", title: "Beyond static listings.", body: "Phase 2 turns the marketplace into a live operating platform with dynamic inventory, seller onboarding, admin controls, and a U.S.-focused luxury catalog that updates in real time." },
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
