import { useEffect, useState } from "react";
import { Bitcoin, TrendingDown, TrendingUp } from "lucide-react";

type Btc = { price: number; change24h: number };

const ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true";

export function BtcTicker() {
  const [data, setData] = useState<Btc | null>(null);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let cancelled = false;
    let prev: number | null = null;

    async function tick() {
      try {
        const r = await fetch(ENDPOINT, { cache: "no-store" });
        const j = await r.json();
        const price = j?.bitcoin?.usd;
        const change24h = j?.bitcoin?.usd_24h_change ?? 0;
        if (cancelled || typeof price !== "number") return;
        if (prev != null && price !== prev) {
          setFlash(price > prev ? "up" : "down");
          setTimeout(() => !cancelled && setFlash(null), 900);
        }
        prev = price;
        setData({ price, change24h });
      } catch {
        /* offline / rate-limited — keep last value */
      }
    }

    tick();
    const id = setInterval(tick, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const up = (data?.change24h ?? 0) >= 0;
  const priceColor =
    flash === "up"
      ? "text-emerald-400"
      : flash === "down"
      ? "text-destructive"
      : "gradient-gold-text";

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">
          Live BTC Rate
        </div>
        <Bitcoin size={20} className="text-gold" />
      </div>
      <div
        className={`mt-4 font-serif text-5xl md:text-6xl transition-colors duration-500 ${priceColor}`}
      >
        {data
          ? `$${data.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
          : "—"}
      </div>
      <div
        className={`mt-2 inline-flex items-center gap-1.5 text-xs ${
          up ? "text-emerald-400/80" : "text-destructive/90"
        }`}
      >
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {data
          ? `${up ? "+" : ""}${data.change24h.toFixed(2)}% past 24h`
          : "loading…"}
      </div>
    </div>
  );
}
