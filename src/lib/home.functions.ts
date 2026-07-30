import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  fallbackMarkers, fallbackMetrics, fallbackSales,
  type MapMarker, type MarketMetric, type RecentSale,
} from "@/data/home-content";

export const getHomeIntel = createServerFn({ method: "GET" }).handler(async () => {
  const empty = { metrics: fallbackMetrics, sales: fallbackSales, markers: fallbackMarkers };
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return empty;
    const db = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const [m, s, k] = await Promise.all([
      db.from("market_metrics" as any).select("label,value,delta,trend,sort_order").order("sort_order"),
      db.from("recent_sales" as any).select("title,location,price_usd,settlement,sort_order").order("sort_order"),
      db.from("map_markers" as any).select("city,region,headline,x,y,btc_accepted,sort_order").order("sort_order"),
    ]);
    return {
      metrics: (m.data?.length ? (m.data as unknown as MarketMetric[]) : fallbackMetrics),
      sales: (s.data?.length ? (s.data as unknown as RecentSale[]) : fallbackSales),
      markers: (k.data?.length ? (k.data as unknown as MapMarker[]) : fallbackMarkers),
    };
  } catch {
    return empty;
  }
});

export const requestMembership = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        full_name: z.string().min(2).max(120),
        email: z.string().email().max(200),
        phone: z.string().max(60).optional().nullable(),
        interest: z.string().max(120).optional().nullable(),
        message: z.string().max(2000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Membership service is not configured.");
    const db = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { error } = await db.from("membership_requests" as any).insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone ?? null,
      interest: data.interest ?? null,
      message: data.message ?? null,
    } as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
