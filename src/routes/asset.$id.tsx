import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Bitcoin, MapPin, Star } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { assets, formatBtc, formatUsd } from "@/data/mock";

export const Route = createFileRoute("/asset/$id")({
  loader: ({ params }) => {
    const asset = assets.find((a) => a.id === params.id);
    if (!asset) throw notFound();
    return asset;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Fortune Coastal Group` },
          { name: "description", content: loaderData.description.slice(0, 160) },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.description.slice(0, 160) },
          { property: "og:image", content: loaderData.image },
          { property: "og:type", content: "product" },
        ]
      : [],
  }),
  component: AssetDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-foreground">Asset not found</h1>
        <Link to="/marketplace" className="mt-6 inline-block text-gold text-xs tracking-luxury uppercase">Return to Marketplace</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-foreground">Something went wrong</h1>
        <Link to="/marketplace" className="mt-6 inline-block text-gold text-xs tracking-luxury uppercase">Return to Marketplace</Link>
      </div>
    </SiteLayout>
  ),
});

function AssetDetail() {
  const asset = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const gallery = asset.gallery.length ? asset.gallery : [asset.image];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-10">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-muted-foreground hover:text-gold">
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-12">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
            <img src={gallery[active]} alt={asset.title} className="h-full w-full object-cover" />
            {asset.verified && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/70 backdrop-blur-md border border-gold/30 px-2.5 py-1 text-[10px] tracking-luxury uppercase text-gold">
                <BadgeCheck size={12} /> Verified
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-[4/3] overflow-hidden border ${i === active ? "border-gold" : "border-border/40"}`}>
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">{asset.category}</div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">{asset.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} /> {asset.location}, {asset.country}
          </div>

          <div className="hairline my-8" />

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Price (USD)</div>
              <div className="font-serif text-4xl text-foreground">{formatUsd(asset.priceUsd)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Bitcoin</div>
              <div className="text-lg text-gold font-medium">{formatBtc(asset.priceBtc)}</div>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted-foreground leading-relaxed">{asset.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-px bg-border/40">
            {asset.specs.map((s) => (
              <div key={s.label} className="bg-background p-5">
                <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{s.label}</div>
                <div className="mt-1 font-serif text-xl text-foreground">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-border/40 p-6">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Verified Seller</div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="font-serif text-xl text-foreground">{asset.seller.name}</div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-gold"><Star size={12} fill="currentColor" /> {asset.seller.rating}</span>
                  <span>{asset.seller.deals} settled transactions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-gold text-primary-foreground px-6 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
              Inquire Privately
            </button>
            {asset.btcAccepted && (
              <button className="flex-1 inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-6 py-4 text-xs tracking-luxury uppercase hover:bg-gold hover:text-primary-foreground transition-colors">
                <Bitcoin size={14} /> Buy with Bitcoin
              </button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
