import { useState } from "react";
import { Bitcoin, MapPin } from "lucide-react";
import worldMap from "@/assets/world-map-gold.jpg";
import type { MapMarker } from "@/data/home-content";

export function WorldMap({ markers }: { markers: MapMarker[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[1920/1024] max-h-[620px] mx-auto">
      <img
        src={worldMap}
        alt="Fortune Coastal global luxury markets"
        loading="lazy"
        width={1920}
        height={1024}
        className="absolute inset-0 h-full w-full object-contain opacity-70"
      />
      {markers.map((m, i) => {
        const open = active === m.city;
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
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${m.x}%`, top: `${m.y}%`, animationDelay: `${i * 0.35}s` }}
          >
            <span className="block h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_18px_2px_var(--gold)]" />
            <span
              className="absolute inset-0 -m-3 rounded-full border border-gold/50"
              style={{ animation: `pulse-ring 3s ease-out ${i * 0.35}s infinite` }}
              aria-hidden
            />
            <span
              className={`pointer-events-none absolute left-1/2 bottom-full mb-4 -translate-x-1/2 whitespace-nowrap bg-background/85 backdrop-blur-md px-4 py-3 text-left transition-all duration-300 ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              }`}
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
  );
}
