import { useEffect, useRef, useState } from "react";
import { Bitcoin, TrendingDown, TrendingUp } from "lucide-react";

type Btc = { price: number; change24h: number };

const ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true";

function useTween(target: number | null, duration = 700) {
  const [value, setValue] = useState<number | null>(target);
  const fromRef = useRef<number | null>(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target == null) return;
    const from = fromRef.current ?? target;
    const start = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      setValue(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

export function BtcTicker() {
  const [data, setData] = useState<Btc | null>(null);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevRef = useRef<number | null>(null);
  const tweened = useTween(data?.price ?? null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const r = await fetch(ENDPOINT, { cache: "no-store" });
        const j = await r.json();
        const price = j?.bitcoin?.usd;
        const change24h = j?.bitcoin?.usd_24h_change ?? 0;
        if (cancelled || typeof price !== "number") return;
        if (prevRef.current != null && price !== prevRef.current) {
          setFlash(price > prevRef.current ? "up" : "down");
          setTimeout(() => !cancelled && setFlash(null), 900);
        }
        prevRef.current = price;
        setData({ price, change24h });
      } catch { /* keep last value */ }
    }

    tick();
    const id = setInterval(tick, 15_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const up = (data?.change24h ?? 0) >= 0;
  const priceColor =
    flash === "up" ? "text-emerald-400"
    : flash === "down" ? "text-destructive"
    : "gradient-gold-text";

  const displayPrice = tweened != null
    ? `$${tweened.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : "—";

  return (
    <div className={`relative rounded-lg p-1 transition-colors ${flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-gold pulse-ring" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
          </span>
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">
            Live BTC / USD
          </div>
        </div>
        <Bitcoin size={32} className="text-gold" strokeWidth={1.5} />
      </div>

      <div className={`mt-6 font-serif text-6xl md:text-7xl leading-none tabular-nums transition-colors duration-500 ${priceColor}`}>
        {displayPrice}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 text-sm tabular-nums ${up ? "text-emerald-400" : "text-destructive"}`}>
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${up ? "bg-emerald-500/15" : "bg-destructive/15"}`}>
            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </span>
          {data ? `${up ? "+" : ""}${data.change24h.toFixed(2)}% · 24h` : "loading…"}
        </div>
        <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">
          Updated every 15s
        </div>
      </div>

      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full transition-all duration-700 ${up ? "bg-emerald-400/70" : "bg-destructive/70"}`}
          style={{ width: `${Math.min(100, Math.abs(data?.change24h ?? 0) * 10)}%` }}
        />
      </div>
    </div>
  );
}
