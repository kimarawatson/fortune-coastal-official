import { createFileRoute } from "@tanstack/react-router";
import { Eye, TrendingUp } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { assets, formatUsd } from "@/data/mock";

export const Route = createFileRoute("/seller")({
  head: () => ({ meta: [{ title: "Seller Dashboard — FCG" }, { name: "robots", content: "noindex" }] }),
  component: Seller,
});

function Seller() {
  const listings = assets.slice(0, 4);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 pb-24">
        <div className="text-[10px] tracking-luxury uppercase text-gold">Seller Portal</div>
        <h1 className="mt-3 font-serif text-5xl text-foreground">Your Listings</h1>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Active Listings", "4"],
            ["Total Views", "12,847"],
            ["Inquiries (30d)", "39"],
            ["GMV (YTD)", "$184M"],
          ].map(([l, v]) => (
            <div key={l} className="border border-border/40 p-6">
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
              <div className="mt-2 font-serif text-3xl text-foreground">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">My Listings</h2>
          <button className="bg-gold text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
            Submit New Asset
          </button>
        </div>

        <div className="mt-6 border border-border/40">
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
              <tr className="border-b border-border/40">
                <th className="text-left p-4">Asset</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Views</th>
                <th className="text-left p-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((a, i) => (
                <tr key={a.id} className="border-b border-border/40 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={a.image} alt="" className="h-12 w-16 object-cover" />
                      <div>
                        <div className="text-foreground">{a.title}</div>
                        <div className="text-xs text-muted-foreground">{a.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gold">{formatUsd(a.priceUsd)}</td>
                  <td className="p-4">
                    <span className={`text-xs tracking-luxury uppercase ${i === 0 ? "text-yellow-400" : "text-emerald-400"}`}>
                      {i === 0 ? "Pending" : "Live"}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground inline-flex items-center gap-2"><Eye size={14} /> {1200 + i * 800}</td>
                  <td className="p-4 text-emerald-400 inline-flex items-center gap-1"><TrendingUp size={14} /> +{4 + i}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}
