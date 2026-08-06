import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Bitcoin, ShieldCheck, Zap, LineChart, Lock, Wallet,
  FileCheck, Check, TrendingUp, TrendingDown,
  Gem, Crown, Diamond, Award, Building2,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BtcTicker } from "@/components/BtcTicker";
import { Reveal } from "@/components/Reveal";
import { MembershipForm } from "@/components/MembershipForm";
import { getHomeIntel } from "@/lib/home.functions";
import { fallbackMarkers, fallbackMetrics, fallbackSales } from "@/data/home-content";
import { assets, formatUsd } from "@/data/mock";
import hero from "@/assets/hero-villa.jpg";
import penthouse from "@/assets/asset-penthouse.jpg";
import villa from "@/assets/asset-villa.jpg";
import aspen from "@/assets/asset-aspen.jpg";
import hamptons from "@/assets/asset-hamptons.jpg";
import luxuryCollectionBg from "@/assets/luxury-collection-bg.png";
import vaultBg from "@/assets/vault-coastal-night.png";

import membershipBg from "@/assets/membership-luxury.jpg";

import dev6 from "@/assets/dev-6.png";
import dev7 from "@/assets/dev-7.png";
import dev8 from "@/assets/dev-8.png";
import dev9 from "@/assets/dev-9.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fortune Coastal — Digital Private Wealth & Luxury Assets" },
      { name: "description", content: "Acquire, finance and manage luxury real estate, yachts, jets and hypercars worldwide — settled in USD or Bitcoin inside one private wealth platform." },
      { property: "og:title", content: "Fortune Coastal Quantum Luxury" },
      { property: "og:description", content: "A digital private wealth platform for global luxury assets, settled in USD or Bitcoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const developments = [
  { slug: "miami", img: dev6, city: "Miami", note: "Investment Opening Soon" },
  { slug: "california", img: dev7, city: "Los Angeles", note: "Reserve Interest" },
  { slug: "vegas", img: dev8, city: "Las Vegas", note: "Coming Soon" },
  { slug: "macao", img: dev9, city: "Macao", note: "Coming Soon" },
];

function Home() {
  const re = assets.filter((a) => a.category === "Real Estate");
  const featured = [
    re.find((a) => a.id === "manhattan-skyline-penthouse")!,
    re.find((a) => a.id === "palm-beach-oceanfront-villa")!,
    re.find((a) => a.id === "aspen-mountain-chalet")!,
  ];

  const intel = useQuery({
    queryKey: ["home-intel"],
    queryFn: () => getHomeIntel(),
    initialData: { metrics: fallbackMetrics, sales: fallbackSales, markers: fallbackMarkers },
    staleTime: 5 * 60_000,
  });

  const { metrics, sales } = intel.data;
  const ticker = [...sales, ...sales];

  return (
    <SiteLayout>
      {/* ============ HERO ============ */}
      <section className="relative -mt-24 min-h-[94vh] flex items-center overflow-hidden">
        <img src={hero} alt="Luxury oceanfront estate at dusk" className="absolute inset-0 h-full w-full object-cover hero-motion" />
        <div className="hero-sheen" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full" style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", opacity: 0.18 }} />
        <div className="relative mx-auto max-w-[1700px] px-4 lg:px-8 w-full pt-32 pb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
              <Gem size={12} /> <span className="h-px w-8 bg-gold/60" /> Digital Private Wealth Platform
            </div>
            <h1 className="mt-8 font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
              The Fortune Way of <br />
              <span className="gradient-gold-text italic">Owning, Growing</span> Luxury Assets
            </h1>
            <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/85 leading-relaxed">
              Acquire, finance and manage estates, yachts, jets and Bitcoin holdings worldwide — inside one intelligent private platform.
            </p>

            <div className="mt-16 max-w-3xl flex flex-wrap items-end gap-x-14 gap-y-10">
              {([
                { Icon: Crown, v: "5,000+", l: "Luxury Assets" },
                { Icon: Bitcoin, v: "24/7", l: "Bitcoin Settlement" },
                { Icon: Diamond, v: "$2.5B+", l: "Assets Managed" },
              ]).map(({ Icon, v, l }, i) => (
                <Reveal key={l} delay={(i + 1) as 1 | 2 | 3} className="flex items-end gap-4">
                  <Icon size={36} className="text-gold mb-1" strokeWidth={1.25} />
                  <div>
                    <div className="font-serif text-4xl md:text-5xl gradient-gold-text leading-none">{v}</div>
                    <div className="mt-2 text-[10px] tracking-luxury uppercase text-foreground/70">{l}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-5">
              <Link to="/marketplace" className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-10 py-5 text-xs tracking-luxury uppercase font-semibold hover:opacity-95 transition-all gold-shadow">
                Explore Properties <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#membership" className="group inline-flex items-center justify-center gap-3 text-foreground px-2 py-5 text-xs tracking-luxury uppercase hover:text-gold transition-colors">
                <Crown size={15} strokeWidth={1.5} /> Request Membership <ArrowRight size={14} className="opacity-60 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] tracking-luxury uppercase text-foreground/65">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={22} className="text-gold" strokeWidth={1.5} /> Verified Listings</span>
              <span className="inline-flex items-center gap-2"><Award size={22} className="text-gold" strokeWidth={1.5} /> Licensed Brokers</span>
              <span className="inline-flex items-center gap-2"><Lock size={22} className="text-gold" strokeWidth={1.5} /> Bitcoin Custody</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RECENTLY SOLD TICKER (thin band) ============ */}
      <section className="relative border-y border-gold/10 bg-background/70 backdrop-blur-md py-5 overflow-hidden">
        <div className="flex items-center gap-8">
          <div className="shrink-0 pl-4 lg:pl-8 flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> Recently Sold
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="marquee-track marquee-slow flex items-center gap-14 whitespace-nowrap">
              {ticker.map((s, i) => (
                <span key={`${s.title}-${i}`} className="inline-flex items-baseline gap-4">
                  <span className="font-serif text-lg text-foreground">{s.title}</span>
                  <span className="text-[11px] tracking-luxury uppercase text-muted-foreground">{s.location}</span>
                  <span className="font-serif text-lg gradient-gold-text">{formatUsd(Number(s.price_usd))}</span>
                  <span className="text-[10px] tracking-luxury uppercase text-gold/80">{s.settlement}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED ESTATES ============ */}
      <section className="relative py-28 overflow-hidden">
        <img src={luxuryCollectionBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90" />

        <div className="relative mx-auto max-w-[1700px] px-4 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
              <Building2 size={12} /> Featured Estates
            </div>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground">
              Fortune <span className="italic gradient-gold-text">Luxury Collection</span>
            </h2>
            <p className="mt-4 text-lg text-foreground/85 max-w-2xl mx-auto">
              A curated selection of the world's most prestigious estates — settled in USD or Bitcoin with private-banking discretion.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <FeaturedCard asset={featured[0]} large />
            <div className="grid gap-6">
              <FeaturedCard asset={featured[1]} />
              <FeaturedCard asset={featured[2]} />
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/marketplace" className="inline-flex items-center gap-3 text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 hover:gap-4 transition-all">
              View All Properties <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <div className="section-edge" />


      {/* ============ LIVE MARKET INTELLIGENCE (light glass band) ============ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.06] via-foreground/[0.10] to-foreground/[0.04]" />
        <div className="absolute inset-0 backdrop-blur-2xl" />
        <div className="relative mx-auto max-w-[1700px] px-4 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
                <LineChart size={12} /> Live Market Intelligence
              </div>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl text-foreground">
                The <span className="italic gradient-gold-text">Fortune Index</span>
              </h2>
            </div>
            <Link to="/marketplace" className="text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 hover:gap-4 transition-all">
              Trade the market
            </Link>
          </div>

          <div className="mt-12 grid gap-px bg-gold/10 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m, i) => {
              const up = m.trend !== "down";
              const Trend = up ? TrendingUp : TrendingDown;
              return (
                <Reveal key={m.label} delay={((i % 3) + 1) as 1 | 2 | 3} className="bg-background/70 backdrop-blur-md p-8">
                  <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{m.label}</div>
                  <div className="mt-4 flex items-baseline gap-4">
                    <div className="font-serif text-4xl gradient-gold-text leading-none">{m.value}</div>
                    {m.delta && (
                      <span className={`inline-flex items-center gap-1 text-xs ${up ? "text-emerald-400" : "text-rose-400"}`}>
                        <Trend size={13} /> {m.delta}
                      </span>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-edge" />

      {/* ============ FORTUNE VAULT ============ */}
      <section className="relative overflow-hidden py-24">
        <img src={vaultBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background/90" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 80% 50%, var(--gold) 0%, transparent 70%)", opacity: 0.12 }} />

        <div className="relative mx-auto max-w-[1700px] px-4 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
              <Bitcoin size={12} /> Fortune Vault
            </div>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground max-w-3xl mx-auto leading-tight">
              Where <span className="italic gradient-gold-text">Digital Wealth</span> Meets Physical Luxury
            </h2>
            <p className="mt-5 text-base text-foreground/80 max-w-2xl mx-auto">
              Hold Bitcoin, acquire trophy assets, and track portfolio performance with institutional-grade custody — in one place.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <div className="bg-charcoal/40 backdrop-blur-md p-8 lg:p-10">
              <div className="text-[10px] tracking-luxury uppercase text-gold">The Fortune Vault</div>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Your all-in-one wealth desk</h3>
              <ul className="mt-6 space-y-4">
                {[
                  ["Instant BTC Settlement", "Close estates in minutes, not weeks."],
                  ["Unified Dashboard", "Assets, crypto, and concierge in one view."],
                  ["Smart Escrow & Proofs", "Multi-sig custody and chain-verified deeds."],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 grid place-items-center rounded-full border border-gold/40 text-gold"><Check size={12} /></div>
                    <div>
                      <div className="text-foreground text-sm">{t}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="mt-8 inline-flex items-center gap-3 bg-gold text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
                <Wallet size={14} /> Connect Your Vault
              </Link>
            </div>

            <div className="bg-charcoal/40 backdrop-blur-md p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", opacity: 0.18 }} />
              <BtcTicker />
              <div className="relative">
                <p className="mt-8 text-base text-muted-foreground leading-relaxed">
                  Members track portfolio value, holdings, and settlement activity inside the private Fortune dashboard.
                </p>
                <Link to="/dashboard" className="mt-6 inline-flex items-center gap-3 text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 hover:gap-4 transition-all">
                  View Portfolio <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {[
              { icon: Zap, t: "Lightning Settlement", d: "High-value deals close in minutes." },
              { icon: FileCheck, t: "Blockchain Verified", d: "On-chain authenticated listings and escrow." },
              { icon: LineChart, t: "Live Market Data", d: "Real-time pricing and portfolio tracking." },
              { icon: ShieldCheck, t: "Institutional Security", d: "Multi-sig custody, cold storage, insurance." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={((i % 3) + 1) as 1 | 2 | 3} className="rounded-lg bg-charcoal/40 backdrop-blur-md p-7">
                <div className="h-12 w-12 grid place-items-center rounded-full bg-gold/10 text-gold"><Icon size={26} strokeWidth={1.5} /></div>
                <h4 className="mt-5 font-serif text-lg text-foreground">{t}</h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-edge" />

      {/* ============ FEATURED DEVELOPMENTS ============ */}
      <section className="relative py-24 bg-background overflow-hidden">
        <div className="relative mx-auto max-w-[1700px] px-4 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
                <Building2 size={12} /> Meozzi Star Developments
              </div>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl text-foreground">
                Featured <span className="italic gradient-gold-text">Developments</span>
              </h2>
            </div>
            <Link to="/developments" className="text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1">
              All developments
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {developments.map((d, i) => (
              <Reveal key={d.slug} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Link to="/developments/$slug" params={{ slug: d.slug }} className="group relative block h-[340px] overflow-hidden">
                  <img src={d.img} alt={`${d.city} tower rendering`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="text-[10px] tracking-luxury uppercase text-gold">{d.note}</div>
                    <div className="mt-2 font-serif text-2xl text-foreground">{d.city}</div>
                    <div className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-foreground/80 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Reserve Interest <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-edge" />

      {/* ============ MEMBERSHIP ============ */}
      <section id="membership" className="relative py-28 overflow-hidden scroll-mt-24">
        <img src={membershipBg} alt="" aria-hidden loading="lazy" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/45" />


        <div className="relative mx-auto max-w-[1700px] px-4 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
              <Crown size={12} /> By Invitation
            </div>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground">
              Become a <span className="italic gradient-gold-text">Fortune Member</span>
            </h2>
            <p className="mt-4 text-lg text-foreground/85 max-w-xl">
              Not everyone gets access. Membership opens the private side of the platform.
            </p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                "Early access to off-market properties",
                "Private investment opportunities",
                "Bitcoin settlement",
                "Dedicated relationship manager",
                "Invitations to luxury events",
                "Private market research",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 h-5 w-5 shrink-0 grid place-items-center rounded-full border border-gold/50 text-gold"><Check size={11} /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <MembershipForm />
        </div>
      </section>

    </SiteLayout>
  );
}

function FeaturedCard({ asset, large = false }: { asset: typeof assets[number]; large?: boolean }) {
  const img = asset.id === "manhattan-skyline-penthouse" ? penthouse : asset.id === "aspen-mountain-chalet" ? aspen : villa;
  return (
    <Link
      to="/asset/$id"
      params={{ id: asset.id }}
      className={`group relative block overflow-hidden bg-charcoal/30 ring-1 ring-transparent hover:ring-gold/40 transition-all duration-500 ${large ? "h-full min-h-[520px]" : "h-[320px]"}`}
    >
      <img src={img} alt={asset.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1400ms]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="bg-gold text-primary-foreground px-2.5 py-1 text-[10px] tracking-luxury uppercase">Featured</span>
        {asset.btcAccepted && (
          <span className="border border-gold/50 text-gold bg-background/60 backdrop-blur px-2.5 py-1 text-[10px] tracking-luxury uppercase inline-flex items-center gap-1 transition-transform duration-500 group-hover:scale-105">
            <Bitcoin size={11} className="transition-transform duration-700 group-hover:rotate-[360deg]" /> BTC
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="text-[11px] tracking-luxury uppercase text-gold">{asset.location} · {asset.category}</div>
        <div className={`mt-2 font-serif text-foreground ${large ? "text-3xl md:text-4xl" : "text-2xl"}`}>{asset.title}</div>

        <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 max-w-md text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Price</dt>
            <dd className="font-serif text-lg gradient-gold-text">{formatUsd(asset.priceUsd)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Min. investment</dt>
            <dd className="text-foreground">{formatUsd(Math.round(asset.priceUsd * 0.05))}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Bitcoin</dt>
            <dd className="text-foreground">₿ {asset.priceBtc.toLocaleString(undefined, { maximumFractionDigits: 1 })}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-foreground">{asset.verified ? "Verified" : "In review"}</dd>
          </div>
        </dl>

        <div className="mt-4 inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 transition-all duration-500 group-hover:gap-4 md:opacity-80 md:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
          View Opportunity <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}
