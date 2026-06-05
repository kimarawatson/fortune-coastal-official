import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Bitcoin, Globe, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { AssetCard } from "@/components/AssetCard";
import { assets } from "@/data/mock";
import hero from "@/assets/hero-villa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fortune Coastal Group — Luxury Asset Marketplace" },
      { name: "description", content: "Buy and sell luxury real estate, vehicles, yachts, jets, and exclusive experiences using USD or Bitcoin." },
      { property: "og:title", content: "Fortune Coastal Group" },
      { property: "og:description", content: "The Future of Luxury Asset Ownership." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const featured = assets.filter((a) => a.featured);
  const realEstate = featured.filter((a) => a.category === "Real Estate");
  const otherFeatured = featured.filter((a) => a.category !== "Real Estate");

  return (
    <SiteLayout>
      <section className="relative -mt-20 h-screen min-h-[720px] w-full overflow-hidden">
        <img src={hero} alt="Luxury oceanfront villa" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />
        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col justify-end pb-24 lg:pb-32">
          <div className="text-[10px] tracking-luxury uppercase text-gold mb-6">A Private Wealth Marketplace</div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground max-w-4xl leading-[1.05]">
            The Future of <span className="gradient-gold-text italic">Luxury</span> Asset Ownership
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Buy and sell luxury real estate, vehicles, yachts, jets, and exclusive experiences — settled in USD or Bitcoin, with private-banking discretion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/marketplace" className="group inline-flex items-center justify-center gap-3 bg-gold text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
              Explore Marketplace
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-3 border border-foreground/30 text-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:border-gold hover:text-gold transition-colors">
              Become a Seller
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground">
          <div className="h-px w-12 bg-gold/60" /> Scroll
        </div>
      </section>

      <section className="border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
          {[
            ["$4.2B", "Assets Listed"],
            ["62", "Countries"],
            ["1,400+", "Verified Sellers"],
            ["100%", "Discretion"],
          ].map(([v, l]) => (
            <div key={l} className="px-4 py-10 text-center">
              <div className="font-serif text-3xl md:text-4xl gradient-gold-text">{v}</div>
              <div className="mt-2 text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Featured Properties" title="Residences of Distinction" description="Hand-selected estates from the world's most coveted coastlines and skylines.">
        <div className="grid gap-8 md:grid-cols-2">
          {realEstate.map((a) => <AssetCard key={a.id} asset={a} />)}
        </div>
      </Section>

      <Section eyebrow="Featured Assets" title="The Curated Collection" description="Yachts, jets, and motorcars selected for provenance and pedigree.">
        <div className="grid gap-8 md:grid-cols-3">
          {otherFeatured.map((a) => <AssetCard key={a.id} asset={a} />)}
        </div>
      </Section>

      <Section eyebrow="Why Fortune Coastal" title="A Standard Above the Market">
        <div className="grid gap-px md:grid-cols-3 bg-border/40">
          {[
            { icon: ShieldCheck, title: "Verified Provenance", body: "Every listing undergoes a multi-step authentication and ownership audit." },
            { icon: Globe, title: "Global Discretion", body: "Private-banking grade confidentiality across 62 jurisdictions." },
            { icon: BadgeCheck, title: "Concierge Settlement", body: "Dedicated transaction managers from inquiry through escrow and transfer." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background p-10">
              <Icon size={24} className="text-gold" />
              <h3 className="mt-6 font-serif text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-32">
        <div className="relative overflow-hidden border border-gold/30 bg-charcoal">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(60% 80% at 80% 50%, var(--gold) 0%, transparent 60%)" }} />
          <div className="relative grid md:grid-cols-2 gap-10 p-10 lg:p-16">
            <div>
              <div className="flex items-center gap-3 text-[10px] tracking-luxury uppercase text-gold">
                <Bitcoin size={14} /> Settle in Bitcoin
              </div>
              <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground leading-tight">
                Move at the speed of <span className="italic gradient-gold-text">crypto</span>.
              </h2>
              <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
                Acquire an estate, a yacht, or a private jet using Bitcoin — with the same custodial care and regulatory clarity our USD clients expect.
              </p>
              <Link to="/marketplace" className="mt-8 inline-flex items-center gap-3 text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 hover:gap-4 transition-all">
                Browse BTC-Accepted Assets <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                ["7 min", "Avg. settlement"],
                ["$0", "Wire fees"],
                ["Multi-sig", "Escrow custody"],
                ["24/7", "Concierge desk"],
              ].map(([v, l]) => (
                <div key={l} className="border border-border/40 p-6">
                  <div className="font-serif text-2xl text-gold">{v}</div>
                  <div className="mt-1 text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 lg:px-10 mt-32 text-center">
        <div className="text-[10px] tracking-luxury uppercase text-gold">By Application Only</div>
        <h2 className="mt-5 font-serif text-4xl md:text-6xl text-foreground">
          Step inside the <span className="italic gradient-gold-text">private circle</span>.
        </h2>
        <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
          Membership is curated. Apply for access to off-market listings and bespoke concierge services.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="bg-gold text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
            Apply for Membership
          </Link>
          <Link to="/contact" className="border border-foreground/30 text-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:border-gold hover:text-gold transition-colors">
            Speak with a Concierge
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function Section({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">{eyebrow}</div>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-foreground max-w-2xl">{title}</h2>
        </div>
        {description && <p className="text-muted-foreground max-w-md">{description}</p>}
      </div>
      {children}
    </section>
  );
}
