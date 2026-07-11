import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Bitcoin, ShieldCheck, Zap, LineChart, Lock, Wallet,
  Globe, Layers, Sparkles, Cpu, FileCheck, Network, Coins, Check,
  Gem, Crown, Diamond, BadgeCheck, Award, Building2,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BtcTicker } from "@/components/BtcTicker";
import { Reveal } from "@/components/Reveal";
import { assets, formatUsd } from "@/data/mock";
import hero from "@/assets/hero-villa.jpg";
import penthouse from "@/assets/asset-penthouse.jpg";
import villa from "@/assets/asset-villa.jpg";
import aspen from "@/assets/asset-aspen.jpg";
import bombardier from "@/assets/asset-bombardier.jpg";
import yacht from "@/assets/asset-yacht.jpg";
import hamptons from "@/assets/asset-hamptons.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fortune Coastal Group — America's Luxury Asset Marketplace" },
      { name: "description", content: "Buy and sell US luxury real estate, supercars, yachts, and jets — settled in USD or Bitcoin with concierge discretion." },
      { property: "og:title", content: "Fortune Coastal Group" },
      { property: "og:description", content: "The Future of Luxury Asset Ownership in America." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const re = assets.filter((a) => a.category === "Real Estate");
  const featured = [
    re.find((a) => a.id === "manhattan-skyline-penthouse")!,
    re.find((a) => a.id === "palm-beach-oceanfront-villa")!,
    re.find((a) => a.id === "aspen-mountain-chalet")!,
  ];

  return (
    <SiteLayout>
      {/* ============ HERO ============ */}
      <section className="relative -mt-24 min-h-[94vh] flex items-center overflow-hidden">
        <img src={hero} alt="Luxury American oceanfront estate" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full" style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", opacity: 0.18 }} />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full pt-32 pb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
              <Gem size={12} /> <span className="h-px w-8 bg-gold/60" /> America's Luxury Wealth Platform
            </div>
            <h1 className="mt-8 font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
              The Fortune Way of <br />
              <span className="gradient-gold-text italic">Buying, Selling</span> Luxury Real Estate
            </h1>
            <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/85 leading-relaxed">
              Where digital wealth meets physical luxury. Trade premium American properties and manage Bitcoin holdings in one private platform.
            </p>

            {/* Stats — pure typography, no panels */}
            <div className="mt-16 max-w-3xl flex flex-wrap items-end gap-x-14 gap-y-10">
              {([
                { Icon: Crown, v: "5,000+", l: "Luxury Homes" },
                { Icon: Bitcoin, v: "24/7", l: "Bitcoin Trading" },
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
              <Link to="/auth" className="group inline-flex items-center justify-center gap-3 text-foreground px-2 py-5 text-xs tracking-luxury uppercase hover:text-gold transition-colors">
                <Wallet size={15} strokeWidth={1.5} /> Connect Wallet <ArrowRight size={14} className="opacity-60 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] tracking-luxury uppercase text-foreground/65">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={22} className="text-gold" strokeWidth={1.5} /> Verified Listings</span>
              <span className="inline-flex items-center gap-2"><Award size={22} className="text-gold" strokeWidth={1.5} /> Licensed Brokers</span>
              <span className="inline-flex items-center gap-2"><Lock size={22} className="text-gold" strokeWidth={1.5} /> Bitcoin Custody</span>
            </div>
          </div>
        </div>
      </section>



      {/* ============ FEATURED COLLECTION ============ */}
      <section className="relative mt-0 py-24 overflow-hidden">
        <img src={hamptons} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/70" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
            <Building2 size={12} /> Featured Properties
          </div>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground">
            Fortune <span className="italic gradient-gold-text">Luxury Collection</span>
          </h2>
          <p className="mt-4 text-foreground/75 max-w-2xl mx-auto">
            Explore our curated selection of America's most prestigious estates — available in USD or Bitcoin, settled with private-banking discretion.
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

      {/* ============ DIGITAL WEALTH / FORTUNE VAULT ============ */}
      <section className="mt-0 relative overflow-hidden py-24">
        <img src={villa} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/70" />

        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 80% 50%, var(--gold) 0%, transparent 70%)", opacity: 0.12 }} />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
              <Bitcoin size={12} /> Fortune Vault
            </div>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground max-w-3xl mx-auto leading-tight">
              Where <span className="italic gradient-gold-text">Digital Wealth</span> Meets Physical Luxury
            </h2>
            <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">
              Fortune Coastal pioneers the convergence of cryptocurrency and American luxury real estate. Seamlessly manage both digital and physical assets in one platform.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {/* Vault */}
            <div className="bg-charcoal/40 backdrop-blur-md p-8 lg:p-10">
              <div className="text-[10px] tracking-luxury uppercase text-gold">The Fortune Vault</div>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Your all-in-one wealth desk</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Hold Bitcoin, manage property investments, and track portfolio performance with institutional-grade security.
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  ["Instant BTC Payments", "Settle estates in minutes, not weeks."],
                  ["Unified Dashboard", "Real-estate, crypto, and concierge in one view."],
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

            {/* BTC Ticker */}
            <div className="bg-charcoal/30 backdrop-blur-md p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", opacity: 0.18 }} />
              <BtcTicker />
              <div className="relative">


                <div className="mt-10 divide-y divide-border/30">
                  {[
                    ["Portfolio Value", "$147.8M"],
                    ["BTC Holdings", "1,597.4 BTC"],
                    ["Properties Owned", "12"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-4">
                      <div className="text-xs text-muted-foreground tracking-luxury uppercase">{k}</div>
                      <div className="font-serif text-lg text-foreground">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6 features */}
          <div className="mt-10 grid gap-px md:grid-cols-3 bg-gold/10">
            {[
              { icon: Bitcoin, t: "Native Bitcoin Support", d: "Accept and pay in Bitcoin natively across every American listing." },
              { icon: Lock, t: "Fortune Vault", d: "Integrated digital wallet to hold BTC, ETH, and stablecoins alongside real assets." },
              { icon: FileCheck, t: "Blockchain Verified", d: "Every property listing is on-chain authenticated with smart-contract escrow." },
              { icon: Zap, t: "Lightning Fast", d: "Lightning-network settlement closes high-value deals in minutes, not weeks." },
              { icon: LineChart, t: "Live Market Data", d: "Real-time BTC pricing, portfolio tracking, and market insights — always on." },
              { icon: ShieldCheck, t: "Military-Grade Security", d: "Multi-sig custody, cold storage, and institutional-grade insurance built in." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={((i % 3) + 1) as 1 | 2 | 3} className="bg-background/40 backdrop-blur-sm p-7">
                <div className="h-12 w-12 grid place-items-center rounded-full bg-gold/10 text-gold"><Icon size={28} strokeWidth={1.5} /></div>
                <h4 className="mt-5 font-serif text-lg text-foreground">{t}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PLATFORM TECHNOLOGY ============ */}
      <section className="relative mt-0 py-24 overflow-hidden">
        <img src={bombardier} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
            <Cpu size={12} /> Platform Features
          </div>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground">
            Fortune <span className="italic gradient-gold-text">Technology</span> Meets Luxury Commerce
          </h2>
          <p className="mt-4 text-foreground/75 max-w-2xl mx-auto">
            Built with cutting-edge blockchain technology and traditional luxury real estate expertise — engineered for American private wealth.
          </p>
        </div>

        <div className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-gold/10">
          {[
            { icon: Building2, t: "National Marketplace", d: "Access exclusive American estates from Hamptons to Hollywood." },
            { icon: Layers, t: "Property Tokenization", d: "Fractional ownership of trophy assets through compliant tokenization." },
            { icon: Sparkles, t: "Immersive 3D Tours", d: "Step inside every listing with photoreal volumetric walkthroughs." },
            { icon: Cpu, t: "Fortune AI Concierge", d: "AI-curated property matches and 24/7 transaction support." },
            { icon: ShieldCheck, t: "Smart Contract Security", d: "Audited Solidity escrow with multi-sig and revocation guards." },
            { icon: BadgeCheck, t: "Licensed Network", d: "Every broker and seller is licensed, vetted, and verifiable on-chain." },
            { icon: Network, t: "Multi-Platform Access", d: "Web, iOS, and Android with seamless wallet pairing." },
            { icon: Coins, t: "Flexible Financing", d: "Bitcoin-collateralized lending and traditional wires — your choice." },
          ].map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={((i % 3) + 1) as 1 | 2 | 3} className="bg-background/40 backdrop-blur-md p-7 hover:bg-background/60 transition-colors">
              <div className="h-14 w-14 grid place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold"><Icon size={28} strokeWidth={1.5} /></div>
              <h4 className="mt-5 font-serif text-lg text-foreground">{t}</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10">
          {([
            { Icon: Diamond, v: "$2.5B+", l: "Total Asset Value" },
            { Icon: Globe, v: "70+", l: "U.S. Markets" },
            { Icon: Building2, v: "5,000+", l: "Properties" },
            { Icon: Crown, v: "24/7", l: "Concierge" },
          ]).map(({ Icon, v, l }, i) => (
            <Reveal key={l} delay={((i % 3) + 1) as 1 | 2 | 3} className="bg-background/40 backdrop-blur-md py-10 text-center">
              <Icon size={30} className="mx-auto text-gold" strokeWidth={1.5} />
              <div className="mt-3 font-serif text-3xl md:text-4xl gradient-gold-text">{v}</div>
              <div className="mt-2 text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* ============ MISSION / INNOVATION / FUTURE ============ */}
      <section className="relative mt-0 py-24 overflow-hidden">
        <img src={yacht} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
            <Gem size={12} /> Our Vision
          </div>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl text-foreground">
            Redefining <span className="italic gradient-gold-text">Luxury Real Estate</span> for the Digital Age
          </h2>
          <p className="mt-4 text-foreground/75 max-w-2xl mx-auto">
            Fortune Coastal merges digital wealth, blockchain trust, and immersive American property experiences. Our mission is to make ownership of luxury assets seamless, transparent, and intelligent.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {([
            { Icon: Crown, t: "Mission", d: "To democratize access to American luxury real estate through blockchain technology, making fractional ownership and seamless transactions a reality." },
            { Icon: Diamond, t: "Innovation", d: "Pioneering Bitcoin-native property transactions, AI-driven matching, and 3D property experiences across all 50 U.S. states." },
            { Icon: Gem, t: "Future", d: "Building the infrastructure for tomorrow's luxury assets — borderless, digitized, and intelligent across the American market." },
          ]).map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={((i % 3) + 1) as 1 | 2 | 3} className="bg-charcoal/20 backdrop-blur-md p-8 text-center hover:bg-charcoal/40 transition-colors">
              <div className="mx-auto h-16 w-16 grid place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold"><Icon size={32} strokeWidth={1.5} /></div>
              <h3 className="mt-6 font-serif text-2xl text-foreground">{t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* ============ ROADMAP ============ */}
      <section className="mt-0 relative py-24 overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10 overflow-hidden p-10 lg:p-14">
          <img src={aspen} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/55 to-background" />

          <div className="relative">
          <div className="text-center">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Strategy</div>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
              The <span className="italic gradient-gold-text">Fortune</span> Roadmap
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {[
              { p: "Phase One — Foundation", items: ["Establish American marketplace", "BTC + USD payment rails", "Verified broker network"] },
              { p: "Phase Two — Expansion", items: ["Property tokenization launch", "Coast-to-coast concierge", "Lending against BTC collateral"] },
              { p: "Phase Three — Innovation", items: ["Immersive 3D tours", "Fortune AI concierge", "On-chain title transfer"] },
              { p: "Phase Four — Ecosystem", items: ["Luxury membership program", "Global community network", "Institutional partnerships"] },
            ].map(({ p, items }) => (
              <div key={p} className="bg-charcoal/20 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 grid place-items-center rounded-full border border-gold/40 text-gold text-xs">{p.split(" ")[1][0]}</div>
                  <div className="font-serif text-lg text-foreground">{p}</div>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-gold mt-0.5 shrink-0" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/auth" className="inline-flex items-center gap-3 bg-gold text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
              Join the Movement <ArrowRight size={14} />
            </Link>
          </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm italic text-muted-foreground">
          "Where <span className="gradient-gold-text">Luxury</span> Meets the American Economy."
        </p>
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
      className={`group relative block overflow-hidden bg-charcoal/30 hover:bg-charcoal/50 transition-colors ${large ? "h-full min-h-[520px]" : "h-[248px]"}`}
    >
      <img src={img} alt={asset.title} className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="bg-gold text-primary-foreground px-2.5 py-1 text-[9px] tracking-luxury uppercase">Featured</span>
        {asset.btcAccepted && <span className="border border-gold/50 text-gold bg-background/60 backdrop-blur px-2.5 py-1 text-[9px] tracking-luxury uppercase inline-flex items-center gap-1"><Bitcoin size={10} /> BTC</span>}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="text-[10px] tracking-luxury uppercase text-gold">{asset.location}</div>
        <div className={`mt-2 font-serif text-foreground ${large ? "text-3xl md:text-4xl" : "text-2xl"}`}>{asset.title}</div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="font-serif text-xl gradient-gold-text">{formatUsd(asset.priceUsd)}</div>
            <div className="text-[10px] text-muted-foreground tracking-luxury uppercase">₿ {asset.priceBtc.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
          </div>
          <div className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold border-b border-gold/50 pb-0.5 group-hover:gap-3 transition-all">
            View Details <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}
