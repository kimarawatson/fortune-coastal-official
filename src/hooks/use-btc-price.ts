import { useEffect, useState } from "react";

const ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true";

export type BtcQuote = { price: number; change24h: number };

export function useBtcPrice(intervalMs = 30_000) {
  const [quote, setQuote] = useState<BtcQuote | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const r = await fetch(ENDPOINT, { cache: "no-store" });
        const j = await r.json();
        const price = j?.bitcoin?.usd;
        if (cancelled || typeof price !== "number") return;
        setQuote({ price, change24h: j?.bitcoin?.usd_24h_change ?? 0 });
      } catch {
        /* keep last known value */
      }
    }

    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return quote;
}
