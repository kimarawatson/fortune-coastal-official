import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Bitcoin, Globe, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { AssetCard } from "@/components/AssetCard";
import { assets } from "@/data/mock";
import hero from "@/assets/hero-villa.jpg";
import bgTexture from "@/assets/bg-texture.jpg";
import napa from "@/assets/asset-napa.jpg";
import bombardier from "@/assets/asset-bombardier.jpg";
import hamptons from "@/assets/asset-hamptons.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fortune Coastal Group — America's Luxury Asset Marketplace" },
      { name: "description", content: "Buy and sell US luxury real estate, supercars, yachts, jets, and exclusive experiences — settled in USD or Bitcoin." },
      { property: "og:title", content: "Fortune Coastal Group" },
      { property: "og:description", content: "The Future of Luxury Asset Ownership in America." },
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
      {/* ============ HERO ============ */}
      <section className="relative -mt-20 h-screen min-h-[720px] w-full overflow-hidden">
        <img src={hero} alt="Luxury oceanfront villa" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col justify-end pb-32 lg:pb-40">
          <div className="text-[10px] tracking-luxury uppercase text-gold mb-6">An American Private Wealth Marketplace</div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground max-w-4xl leading-[1.05]">
            The Future of <span className="gradient-gold-text italic">Luxury</span> Asset Ownership
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            America's discreet marketplace for estates, supercars, yachts, jets, and exclusive experiences — settled in USD or Bitcoin, with private-banking discretion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/marketplace" className="group inline-flex items-center justify-center gap-3 bg-gold text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
              Explore Marketplace
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/auth" className="inline-flex items-center justify-center gap-3 border border-foreground/30 text-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:border-gold hover:text-gold transition-colors">
              Become a Seller
            </Link>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <a href="#discover" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group">
          <span className="text-[10px] tracking-luxury uppercase text-gold-soft/80 group-hover:text-gold transition-colors">
            Scroll to Explore
          </span>
          <div className="relative h-12 w-6 border border-gold/40 rounded-full flex justify-center pt-2 overflow-hidden">
            <span className="block h-2 w-[2px] bg-gold scroll-dot rounded-full" />
          </div>
        </a>
      </section>

      {/* ============ STATS w/ background texture ============ */}
      <section id="discover" className="relative border-y border-border/40 overflow-hidden">
        <img src={bgTexture} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/85" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
          {[
            ["$4.2B", "Assets Listed"],
            ["50", "U.S. States Served"],
            ["1,400+", "Verified Sellers"],
            ["100%", "Discretion"],
          ].map(([v, l]) => (
            <div key={l} className="px-4 py-12 text-center">
              <div className="font-serif text-3xl md:text-4xl gradient-gold-text">{v}</div>
              <div className="mt-2 text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Featured Properties" title="American Residences of Distinction" description="Hand-selected estates from the Hamptons, Beverly Hills, Aspen, Manhattan, and Miami.">
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
            { icon: Globe, title: "Coast-to-Coast Discretion", body: "Private-banking grade confidentiality across all 50 U.S. states." },
            { icon: BadgeCheck, title: "Concierge Settlement", body: "Dedicated U.S.-based transaction managers from inquiry through escrow and transfer." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background/80 backdrop-blur-sm p-10">
              <Icon size={24} className="text-gold" />
              <h3 className="mt-6 font-serif text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ BTC SECTION with image ============ */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-32">
        <div className="relative overflow-hidden border border-gold/30 luxe-shadow">
          <img src={bombardier} alt="Private jet at golden hour" loading="lazy" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(50% 80% at 90% 50%, var(--gold) 0%, transparent 60%)", opacity: 0.18 }} />
          <div className="relative grid md:grid-cols-2 gap-10 p-10 lg:p-16">
            <div>
              <div className="flex items-center gap-3 text-[10px] tracking-luxury uppercase text-gold">
                <Bitcoin size={14} /> Settle in Bitcoin
              </div>
              <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground leading-tight">
                Move at the speed of <span className="italic gradient-gold-text">crypto</span>.
              </h2>
              <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
                Acquire an estate, a yacht, or a private jet using Bitcoin — with the same custodial care and U.S. regulatory clarity our USD clients expect.
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
                <div key={l} className="border border-border/40 bg-background/60 backdrop-blur-sm p-6">
                  <div className="font-serif text-2xl text-gold">{v}</div>
                  <div className="mt-1 text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONCIERGE BAND ============ */}
      <section className="mt-32 relative h-[420px] overflow-hidden">
        <img src={napa} alt="Napa Valley vineyard" loading="lazy" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex items-center">
          <div className="max-w-lg">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Concierge Experiences</div>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground leading-tight">
              From <span className="italic gradient-gold-text">Napa</span> to Augusta.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Private harvests, Masters week, Kentucky Derby suites, and Super Bowl hospitality — curated end-to-end by our American concierge desk.
            </p>
            <Link to="/marketplace" className="mt-7 inline-flex items-center gap-3 text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 hover:gap-4 transition-all">
              View Experiences <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ MEMBERSHIP CTA with image ============ */}
      <section className="relative mt-32 overflow-hidden">
        <img src={hamptons} alt="Hamptons oceanfront estate" loading="lazy" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10 py-32 text-center">
          <div className="text-[10px] tracking-luxury uppercase text-gold">By Application Only</div>
          <h2 className="mt-5 font-serif text-4xl md:text-6xl text-foreground">
            Step inside the <span className="italic gradient-gold-text">private circle</span>.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
            Membership is curated. Apply for access to off-market American listings and bespoke concierge services.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth" className="bg-gold text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
              Apply for Membership
            </Link>
            <Link to="/contact" className="border border-foreground/30 text-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:border-gold hover:text-gold transition-colors bg-background/40 backdrop-blur-sm">
              Speak with a Concierge
            </Link>
          </div>
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
