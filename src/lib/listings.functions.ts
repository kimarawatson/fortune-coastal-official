import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { mockListings } from "./seed-data";

function createPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

// Returns the service-role admin client when SUPABASE_SERVICE_ROLE_KEY is set,
// otherwise falls back to the caller's authenticated client (RLS still applies,
// admin policies via has_role() must permit the operation).
async function getAdminDb(context: { supabase: any }) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL) {
    const mod = await import("@/integrations/supabase/client.server");
    return mod.supabaseAdmin;
  }
  return context.supabase;
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
      .filter((listing) => (data.category ? listing.category_slug === data.category : true))
      .filter((listing) => (data.country ? listing.country === data.country : true))
      .filter((listing) => (data.btcOnly ? listing.accepts_btc : true))
      .filter((listing) => (data.featuredOnly ? listing.featured : true))
      .filter((listing) => (typeof data.minPrice === "number" ? listing.price_usd >= data.minPrice : true))
      .filter((listing) => (typeof data.maxPrice === "number" ? listing.price_usd <= data.maxPrice : true))
      .map((listing, index) => ({
        id: `demo-${index}`,
        ...listing,
        status: "approved",
        seller_id: null,
      }));
  });

export const getPublicListing = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const supabasePublic = createPublicClient();
    const { data: listing } = await supabasePublic
      .from("listings")
      .select("*")
      .eq("id", data.id)
      .eq("status", "approved")
      .maybeSingle();
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
      .from("listing_images")
      .select("image_url, sort_order")
      .eq("listing_id", data.id)
      .order("sort_order");
    const { data: profile } = await supabasePublic
      .from("profiles")
      .select("full_name, country")
      .eq("id", listing.seller_id)
      .maybeSingle();
    return { listing, images: images ?? [], sellerName: profile?.full_name ?? "Verified Seller" };
  });

export const getHomepage = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = createPublicClient();
  const { data: hp } = await supabasePublic.from("homepage_content").select("*").eq("id", 1).maybeSingle();
  return hp;
});

// --- ADMIN bootstrap: first user can claim admin role if none exists
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await getAdminDb(context);
    const { data: existing } = await supabaseAdmin.from("user_roles").select("id").eq("role", "admin").limit(1);
    if (existing && existing.length > 0) throw new Error("An admin already exists.");
    await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "seller" });
    return { ok: true };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden: admin only");
}

// --- ADMIN listing management
export const adminListAllListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const { data } = await supabaseAdmin
      .from("listings")
      .select("*, profiles:seller_id(full_name, email)")
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminSetListingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string(),
        status: z.enum(["draft", "pending", "approved", "rejected"]),
        admin_notes: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const { error } = await supabaseAdmin.from("listings").update({ status: data.status, admin_notes: data.admin_notes }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleFeatured = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string(), featured: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    await supabaseAdmin.from("listings").update({ featured: data.featured }).eq("id", data.id);
    return { ok: true };
  });

export const adminToggleVerified = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string(), verified: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    await supabaseAdmin.from("listings").update({ verified: data.verified }).eq("id", data.id);
    return { ok: true };
  });

export const adminDeleteListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    await supabaseAdmin.from("listings").delete().eq("id", data.id);
    return { ok: true };
  });

// --- ADMIN users
export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const { data: profiles } = await supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    return (profiles ?? []).map((p: any) => ({
      ...p,
      roles: (roles ?? []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
    }));
  });

export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ user_id: z.string(), role: z.enum(["admin", "seller", "buyer"]), enabled: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    if (data.enabled) {
      await supabaseAdmin.from("user_roles").upsert({ user_id: data.user_id, role: data.role }, { onConflict: "user_id,role" });
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    }
    return { ok: true };
  });

// --- SELLER APPLICATIONS
export const adminListSellerApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const { data } = await supabaseAdmin
      .from("seller_applications")
      .select("*, profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminDecideSellerApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string(), approve: z.boolean(), admin_notes: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const { data: app } = await supabaseAdmin.from("seller_applications").select("user_id").eq("id", data.id).single();
    if (!app) throw new Error("Not found");
    await supabaseAdmin
      .from("seller_applications")
      .update({ status: data.approve ? "approved" : "rejected", admin_notes: data.admin_notes })
      .eq("id", data.id);
    if (data.approve) {
      await supabaseAdmin.from("user_roles").upsert({ user_id: app.user_id, role: "seller" }, { onConflict: "user_id,role" });
    }
    return { ok: true };
  });

// --- HOMEPAGE CMS
export const adminUpdateHomepage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        hero_eyebrow: z.string().max(160),
        hero_title: z.string().max(240),
        hero_subtitle: z.string().max(600),
        primary_cta_label: z.string().max(60),
        primary_cta_href: z.string().max(200),
        secondary_cta_label: z.string().max(60),
        secondary_cta_href: z.string().max(200),
        featured_listing_ids: z.array(z.string()).max(12),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const { error } = await supabaseAdmin.from("homepage_content").update({ ...data, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// --- STATS for admin overview
export const adminGetStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const [{ count: total }, { count: pending }, { count: approved }, { count: users }, { count: sellerApps }] = await Promise.all([
      supabaseAdmin.from("listings").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("listings").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("seller_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);
    return { total: total ?? 0, pending: pending ?? 0, approved: approved ?? 0, users: users ?? 0, sellerAppsPending: sellerApps ?? 0 };
  });

// --- SELLER: list own listings
export const sellerListMyListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("listings").select("*").eq("seller_id", context.userId).order("created_at", { ascending: false });
    return data ?? [];
  });

// --- INQUIRIES
export const submitInquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ listing_id: z.string(), message: z.string().min(5).max(2000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await getAdminDb(context);
    const { data: listing } = await supabaseAdmin.from("listings").select("seller_id").eq("id", data.listing_id).maybeSingle();
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

// --- SEED demo data (admin only): converts mock asset list into listings owned by current admin
export const adminSeedDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const supabaseAdmin = await getAdminDb(context);
    const { mockListings } = await import("./seed-data");
    const { count } = await supabaseAdmin.from("listings").select("*", { count: "exact", head: true });
    if ((count ?? 0) > 0) return { ok: true, skipped: true, message: "Listings already exist." };

    const rows = mockListings.map((m) => ({
      seller_id: context.userId,
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
      status: "pending" as const,
      featured: m.featured,
      verified: m.verified,
    }));
    const { data: inserted, error } = await supabaseAdmin.from("listings").insert(rows).select("id, title");
    if (error) throw new Error(error.message);

    const imageRows = (inserted ?? []).flatMap((row, idx) =>
      mockListings[idx].gallery.map((url, i) => ({ listing_id: row.id, image_url: url, sort_order: i })),
    );
    if (imageRows.length) await supabaseAdmin.from("listing_images").insert(imageRows);

    return { ok: true, inserted: inserted?.length ?? 0 };
  });
