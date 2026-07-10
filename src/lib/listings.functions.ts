import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdminUnlocked } from "@/lib/admin-gate.functions";
import type { Database } from "@/integrations/supabase/types";
import { mockListings } from "./seed-data";

function createPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

// Service-role client, used by admin server fns which are gated by the
// shared ADMIN_PASSWORD (see admin-gate.functions.ts) rather than by any
// Supabase user role.
async function getServiceRoleDb() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// --- PUBLIC: list approved listings with filters
export const listPublicListings = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z
      .object({
        category: z.string().nullish(),
        country: z.string().nullish(),
        btcOnly: z.boolean().nullish(),
        minPrice: z.number().nullish(),
        maxPrice: z.number().nullish(),
        featuredOnly: z.boolean().nullish(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const supabasePublic = createPublicClient();
    let q = supabasePublic.from("listings").select("*").eq("status", "approved").order("created_at", { ascending: false });
    if (data.category) q = q.eq("category_slug", data.category);
    if (data.country) q = q.eq("country", data.country);
    if (data.btcOnly) q = q.eq("accepts_btc", true);
    if (data.featuredOnly) q = q.eq("featured", true);
    if (typeof data.minPrice === "number") q = q.gte("price_usd", data.minPrice);
    if (typeof data.maxPrice === "number") q = q.lte("price_usd", data.maxPrice);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    if ((rows?.length ?? 0) > 0) return rows ?? [];

    return mockListings
      .filter((l) => (data.category ? l.category_slug === data.category : true))
      .filter((l) => (data.country ? l.country === data.country : true))
      .filter((l) => (data.btcOnly ? l.accepts_btc : true))
      .filter((l) => (data.featuredOnly ? l.featured : true))
      .filter((l) => (typeof data.minPrice === "number" ? l.price_usd >= data.minPrice : true))
      .filter((l) => (typeof data.maxPrice === "number" ? l.price_usd <= data.maxPrice : true))
      .map((l, i) => ({ id: `demo-${i}`, ...l, status: "approved", seller_id: null }));
  });

export const getPublicListing = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const supabasePublic = createPublicClient();
    const { data: listing } = await supabasePublic
      .from("listings").select("*").eq("id", data.id).eq("status", "approved").maybeSingle();
    if (!listing) {
      const demoIndex = data.id.startsWith("demo-") ? Number(data.id.replace("demo-", "")) : NaN;
      const demo = Number.isInteger(demoIndex) ? mockListings[demoIndex] : undefined;
      if (!demo) return null;
      return {
        listing: { id: data.id, ...demo, status: "approved", seller_id: null },
        images: demo.gallery.map((image_url, sort_order) => ({ image_url, sort_order })),
        sellerName: "FCG Verified Seller",
      };
    }
    const { data: images } = await supabasePublic
      .from("listing_images").select("image_url, sort_order").eq("listing_id", data.id).order("sort_order");
    const { data: profile } = await supabasePublic
      .from("profiles").select("full_name, country").eq("id", listing.seller_id).maybeSingle();
    return { listing, images: images ?? [], sellerName: profile?.full_name ?? "Verified Seller" };
  });

export const getHomepage = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = createPublicClient();
  const { data: hp } = await supabasePublic.from("homepage_content").select("*").eq("id", 1).maybeSingle();
  return hp;
});

// --- ADMIN listing management (gated by ADMIN_PASSWORD session)
export const adminListAllListings = createServerFn({ method: "GET" })
  .middleware([requireAdminUnlocked])
  .handler(async () => {
    const db = await getServiceRoleDb();
    const { data } = await db.from("listings").select("*, profiles:seller_id(full_name, email)").order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminSetListingStatus = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ id: z.string(), status: z.enum(["draft", "pending", "approved", "rejected"]), admin_notes: z.string().optional() }).parse(d))
  .handler(async ({ data }) => {
    const db = await getServiceRoleDb();
    const { error } = await db.from("listings").update({ status: data.status, admin_notes: data.admin_notes }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleFeatured = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ id: z.string(), featured: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    const db = await getServiceRoleDb();
    await db.from("listings").update({ featured: data.featured }).eq("id", data.id);
    return { ok: true };
  });

export const adminToggleVerified = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ id: z.string(), verified: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    const db = await getServiceRoleDb();
    await db.from("listings").update({ verified: data.verified }).eq("id", data.id);
    return { ok: true };
  });

export const adminDeleteListing = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const db = await getServiceRoleDb();
    await db.from("listings").delete().eq("id", data.id);
    return { ok: true };
  });

// --- ADMIN users
export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireAdminUnlocked])
  .handler(async () => {
    const db = await getServiceRoleDb();
    const { data: profiles } = await db.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await db.from("user_roles").select("user_id, role");
    return (profiles ?? []).map((p: any) => ({
      ...p,
      roles: (roles ?? []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
    }));
  });

export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ user_id: z.string(), role: z.enum(["admin", "seller", "buyer"]), enabled: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    const db = await getServiceRoleDb();
    if (data.enabled) {
      await db.from("user_roles").upsert({ user_id: data.user_id, role: data.role }, { onConflict: "user_id,role" });
    } else {
      await db.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    }
    return { ok: true };
  });

// --- SELLER APPLICATIONS
export const adminListSellerApplications = createServerFn({ method: "GET" })
  .middleware([requireAdminUnlocked])
  .handler(async () => {
    const db = await getServiceRoleDb();
    const { data } = await db.from("seller_applications").select("*, profiles:user_id(full_name, email)").order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminDecideSellerApplication = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ id: z.string(), approve: z.boolean(), admin_notes: z.string().optional() }).parse(d))
  .handler(async ({ data }) => {
    const db = await getServiceRoleDb();
    const { data: app } = await db.from("seller_applications").select("user_id").eq("id", data.id).single();
    if (!app) throw new Error("Not found");
    await db.from("seller_applications").update({ status: data.approve ? "approved" : "rejected", admin_notes: data.admin_notes }).eq("id", data.id);
    if (data.approve) {
      await db.from("user_roles").upsert({ user_id: app.user_id, role: "seller" }, { onConflict: "user_id,role" });
    }
    return { ok: true };
  });

// --- HOMEPAGE CMS
export const adminUpdateHomepage = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({
    hero_eyebrow: z.string().max(160),
    hero_title: z.string().max(240),
    hero_subtitle: z.string().max(600),
    primary_cta_label: z.string().max(60),
    primary_cta_href: z.string().max(200),
    secondary_cta_label: z.string().max(60),
    secondary_cta_href: z.string().max(200),
    featured_listing_ids: z.array(z.string()).max(12),
  }).parse(d))
  .handler(async ({ data }) => {
    const db = await getServiceRoleDb();
    const { error } = await db.from("homepage_content").update({ ...data, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// --- STATS for admin overview
export const adminGetStats = createServerFn({ method: "GET" })
  .middleware([requireAdminUnlocked])
  .handler(async () => {
    const db = await getServiceRoleDb();
    const [{ count: total }, { count: pending }, { count: approved }, { count: users }, { count: sellerApps }] = await Promise.all([
      db.from("listings").select("*", { count: "exact", head: true }),
      db.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
      db.from("listings").select("*", { count: "exact", head: true }).eq("status", "approved"),
      db.from("profiles").select("*", { count: "exact", head: true }),
      db.from("seller_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);
    return { total: total ?? 0, pending: pending ?? 0, approved: approved ?? 0, users: users ?? 0, sellerAppsPending: sellerApps ?? 0 };
  });

// --- SELLER: list own listings (Supabase user auth, unchanged)
export const sellerListMyListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("listings").select("*").eq("seller_id", context.userId).order("created_at", { ascending: false });
    return data ?? [];
  });

// --- INQUIRIES (Supabase user auth)
export const submitInquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ listing_id: z.string(), message: z.string().min(5).max(2000) }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await getServiceRoleDb();
    const { data: listing } = await db.from("listings").select("seller_id").eq("id", data.listing_id).maybeSingle();
    if (!listing) throw new Error("Listing not found");
    const { error } = await context.supabase.from("inquiries").insert({
      listing_id: data.listing_id,
      buyer_id: context.userId,
      seller_id: listing.seller_id,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// --- SEED demo data (admin only). Requires at least one seller profile
// to attach listings to. Picks the first user with the "seller" role, or
// falls back to the first profile.
export const adminSeedDemoData = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .handler(async () => {
    const db = await getServiceRoleDb();
    const { mockListings } = await import("./seed-data");
    const { count } = await db.from("listings").select("*", { count: "exact", head: true });
    if ((count ?? 0) > 0) return { ok: true, skipped: true, message: "Listings already exist." };

    const { data: sellerRole } = await db.from("user_roles").select("user_id").eq("role", "seller").limit(1).maybeSingle();
    let sellerId = sellerRole?.user_id as string | undefined;
    if (!sellerId) {
      const { data: anyProfile } = await db.from("profiles").select("id").limit(1).maybeSingle();
      sellerId = anyProfile?.id;
    }
    if (!sellerId) return { ok: false, skipped: true, message: "No user profile exists yet. Sign up a user first, then seed." };

    const rows = mockListings.map((m) => ({
      seller_id: sellerId!,
      category_slug: m.category_slug,
      title: m.title,
      subtitle: m.subtitle,
      description: m.description,
      location: m.location,
      country: m.country,
      city: m.city,
      price_usd: m.price_usd,
      price_btc: m.price_btc,
      accepts_btc: m.accepts_btc,
      cover_image: m.cover_image,
      status: "approved" as const,
      featured: m.featured,
      verified: m.verified,
    }));
    const { data: inserted, error } = await db.from("listings").insert(rows).select("id, title");
    if (error) throw new Error(error.message);

    const imageRows = (inserted ?? []).flatMap((row: any, idx: number) =>
      mockListings[idx].gallery.map((url, i) => ({ listing_id: row.id, image_url: url, sort_order: i })),
    );
    if (imageRows.length) await db.from("listing_images").insert(imageRows);

    return { ok: true, inserted: inserted?.length ?? 0 };
  });
