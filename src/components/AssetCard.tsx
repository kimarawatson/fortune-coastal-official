import { Link } from "@tanstack/react-router";
import { BadgeCheck, Bitcoin } from "lucide-react";
import { formatBtc, formatUsd, type Asset } from "@/data/mock";

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <Link
      to="/asset/$id"
      params={{ id: asset.id }}
      className="group block bg-card border border-border/40 hover:border-gold/50 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
        <img
          src={asset.image}
          alt={asset.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {asset.verified && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/70 backdrop-blur-md border border-gold/30 px-2.5 py-1 text-[10px] tracking-luxury uppercase text-gold">
            <BadgeCheck size={12} /> Verified
          </div>
        )}
        {asset.btcAccepted && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-background/70 backdrop-blur-md border border-border/40 px-2.5 py-1 text-[10px] tracking-luxury uppercase text-foreground">
            <Bitcoin size={12} /> BTC
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 text-xs tracking-luxury uppercase text-gold-soft">
          {asset.category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl text-foreground group-hover:text-gold transition-colors leading-tight">
            {asset.title}
          </h3>
        </div>
        <div className="mt-1 text-xs text-muted-foreground tracking-wide">{asset.location}, {asset.country}</div>
        <div className="hairline my-5" />
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Price</div>
            <div className="font-serif text-2xl text-foreground">{formatUsd(asset.priceUsd)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Bitcoin</div>
            <div className="text-sm text-gold font-medium">{formatBtc(asset.priceBtc)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
