import { useState } from "react";
import { Bitcoin, MapPin } from "lucide-react";
import { WORLD_DOTS } from "@/data/world-dots";
import type { MapMarker } from "@/data/home-content";

/**
 * Dotted equirectangular world map (viewBox 0 0 1000 500).
 * Marker x/y are percentages derived from real lon/lat:
 *   x = (lon + 180) / 360 * 100
 *   y = (90 - lat) / 180 * 100
 */
export function WorldMap({ markers }: { markers: MapMarker[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-[1400px]">
      <div className="relative w-full" style={{ aspectRatio: "1000 / 460" }}>
        <svg
          viewBox="0 40 1000 460"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Fortune Coastal active luxury markets"
        >
          <defs>
            <radialGradient id="fc-map-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d={WORLD_DOTS}
            stroke="var(--gold)"
            strokeOpacity="0.32"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {markers.map((m) => (
            <circle
              key={`glow-${m.city}`}
              cx={(m.x / 100) * 1000}
              cy={(m.y / 100) * 500}
              r={active === m.city ? 42 : 30}
              fill="url(#fc-map-glow)"
              className="transition-all duration-500"
            />
          ))}
        </svg>

        {markers.map((m, i) => {
          const open = active === m.city;
          const flip = m.y < 30;
          return (
            <button
              key={m.city}
              type="button"
              onMouseEnter={() => setActive(m.city)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(m.city)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(open ? null : m.city)}
              aria-label={`${m.city} — ${m.headline}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
              style={{
                left: `${m.x}%`,
                top: `${((m.y / 100) * 500 - 40) / 460 * 100}%`,
                zIndex: open ? 30 : 10,
              }}
            >
              <span className="relative block h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-gold shadow-[0_0_14px_2px_var(--gold)]" />
                <span
                  className="absolute -inset-2 rounded-full border border-gold/40"
                  style={{ animation: `pulse-ring 3.4s ease-out ${i * 0.4}s infinite` }}
                  aria-hidden
                />
              </span>
              <span
                className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-3 text-left bg-background/80 backdrop-blur-xl ring-1 ring-gold/20 transition-all duration-300 ${
                  flip ? "top-full mt-4" : "bottom-full mb-4"
                } ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
              >
                <span className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold">
                  <MapPin size={11} /> {m.city}
                  {m.region ? ` · ${m.region}` : ""}
                </span>
                <span className="mt-1 block font-serif text-lg text-foreground">{m.headline}</span>
                {m.btc_accepted && (
                  <span className="mt-1 flex items-center gap-1.5 text-[10px] tracking-luxury uppercase text-gold/90">
                    <Bitcoin size={11} /> Bitcoin Accepted
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
