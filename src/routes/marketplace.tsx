import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { AssetCard } from "@/components/AssetCard";
import { assets, categories, countries, type Category } from "@/data/mock";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Fortune Coastal Group" },
      { name: "description", content: "Browse verified luxury real estate, supercars, yachts, jets, and concierge experiences." },
      { property: "og:title", content: "FCG Marketplace" },
      { property: "og:description", content: "Verified luxury assets, settled in USD or Bitcoin." },
      { property: "og:url", content: "/marketplace" },
    ],
    links: [{ rel: "canonical", href: "/marketplace" }],
  }),
  component: Marketplace,
});

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under $1M", min: 0, max: 1_000_000 },
  { label: "$1M – $10M", min: 1_000_000, max: 10_000_000 },
  { label: "$10M – $50M", min: 10_000_000, max: 50_000_000 },
  { label: "$50M+", min: 50_000_000, max: Infinity },
];

function Marketplace() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [country, setCountry] = useState<string>("All");
  const [priceIdx, setPriceIdx] = useState(0);
  const [btcOnly, setBtcOnly] = useState(false);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceIdx];
    return assets.filter((a) =>
      (category === "All" || a.category === category) &&
      (country === "All" || a.country === country) &&
      a.priceUsd >= range.min && a.priceUsd <= range.max &&
      (!btcOnly || a.btcAccepted)
    );
  }, [category, country, priceIdx, btcOnly]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-12">
        <div className="text-[10px] tracking-luxury uppercase text-gold">The Marketplace</div>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl text-foreground">A Curated <span className="italic gradient-gold-text">World</span> of Assets</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Every listing is verified, vetted, and presented with full provenance. Filter the collection to begin.
        </p>
      </section>

      <section className="border-y border-border/40 bg-charcoal/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 grid gap-4 md:grid-cols-4">
          <FilterSelect label="Category" value={category} onChange={(v) => setCategory(v as Category | "All")} options={["All", ...categories.map((c) => c.name)]} />
          <FilterSelect label="Country" value={country} onChange={setCountry} options={["All", ...countries]} />
          <FilterSelect label="Price Range" value={String(priceIdx)} onChange={(v) => setPriceIdx(Number(v))} options={PRICE_RANGES.map((p, i) => ({ value: String(i), label: p.label }))} />
          <label className="flex items-center justify-between border border-border/40 bg-background/60 px-4">
            <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">Bitcoin Accepted</span>
            <button
              type="button"
              onClick={() => setBtcOnly(!btcOnly)}
              className={`relative h-6 w-11 transition-colors ${btcOnly ? "bg-gold" : "bg-border"}`}
              aria-pressed={btcOnly}
            >
              <span className={`absolute top-0.5 h-5 w-5 bg-background transition-transform ${btcOnly ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-xs tracking-luxury uppercase text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "Asset" : "Assets"}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-32 border border-border/40">
            <div className="font-serif text-2xl text-foreground">No assets match your criteria</div>
            <p className="mt-2 text-sm text-muted-foreground">Adjust the filters to broaden your search.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => <AssetCard key={a.id} asset={a} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

type Opt = string | { value: string; label: string };
function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Opt[] }) {
  return (
    <label className="block border border-border/40 bg-background/60 px-4 py-2">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-foreground py-1 focus:outline-none cursor-pointer"
      >
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return <option key={v} value={v} className="bg-background">{l}</option>;
        })}
      </select>
    </label>
  );
}
