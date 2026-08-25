import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminUnlocked } from "@/lib/admin-gate.functions";

const listingInput = z.object({
  id: z.string().uuid().nullish(),
  category_slug: z.string().min(1),
  title: z.string().min(1).max(240),
  subtitle: z.string().max(300).nullish(),
  description: z.string().max(6000).nullish(),
  location: z.string().max(200).nullish(),
  country: z.string().max(120).nullish(),
  city: z.string().max(120).nullish(),
  price_usd: z.number().min(0),
  accepts_btc: z.boolean().default(true),
  cover_image: z.string().max(1000).nullish(),
  source_url: z.string().max(1000).nullish(),
  external_id: z.string().max(200).nullish(),
  status: z.enum(["draft", "pending", "approved", "rejected"]).default("approved"),
  featured: z.boolean().default(false),
  verified: z.boolean().default(true),
  images: z.array(z.string().max(1000)).max(60).default([]),
});

export const adminListCatalog = createServerFn({ method: "GET" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ category: z.string().nullish() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getReadDb, categoryRank } = await import("@/lib/catalog-db.server");
    const db = await getReadDb();
    let q = db
      .from("listings")
      .select("id, category_slug, title, subtitle, location, country, city, price_usd, accepts_btc, cover_image, status, featured, verified, external_id, source_url, created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (data.category) q = q.eq("category_slug", data.category);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const list = (rows ?? []) as { category_slug: string }[];
    if (data.category) return list;
    return list.slice().sort((a, b) => categoryRank(a.category_slug) - categoryRank(b.category_slug));
  });

export const adminGetListingDetail = createServerFn({ method: "GET" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { getReadDb } = await import("@/lib/catalog-db.server");
    const db = await getReadDb();
    const { data: listing } = await db.from("listings").select("*").eq("id", data.id).maybeSingle();
    const { data: images } = await db
      .from("listing_images").select("image_url, sort_order").eq("listing_id", data.id).order("sort_order");
    return { listing, images: (images ?? []).map((i: { image_url: string }) => i.image_url) };
  });


export const adminSaveListing = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => listingInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { images, id, ...fields } = data;
    const payload = {
      ...fields,
      cover_image: fields.cover_image || images[0] || null,
      updated_at: new Date().toISOString(),
    };
    let listingId = id ?? null;
    if (listingId) {
      const { error } = await supabaseAdmin.from("listings").update(payload).eq("id", listingId);
      if (error) throw new Error(error.message);
    } else {
      const { data: row, error } = await supabaseAdmin.from("listings").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      listingId = row.id as string;
    }
    await supabaseAdmin.from("listing_images").delete().eq("listing_id", listingId);
    if (images.length) {
      await supabaseAdmin.from("listing_images").insert(
        images.map((image_url, sort_order) => ({ listing_id: listingId!, image_url, sort_order })),
      );
    }
    return { ok: true, id: listingId };
  });

export const adminImportListings = createServerFn({ method: "POST" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ rows: z.array(listingInput).max(1000) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let created = 0;
    let updated = 0;
    for (const row of data.rows) {
      const { images, id, ...fields } = row;
      const payload = { ...fields, cover_image: fields.cover_image || images[0] || null };
      let listingId: string | null = id ?? null;
      if (!listingId && fields.external_id) {
        const { data: existing } = await supabaseAdmin
          .from("listings").select("id").eq("external_id", fields.external_id).maybeSingle();
        listingId = (existing?.id as string) ?? null;
      }
      if (listingId) {
        await supabaseAdmin.from("listings").update(payload).eq("id", listingId);
        updated += 1;
      } else {
        const { data: inserted, error } = await supabaseAdmin.from("listings").insert(payload).select("id").single();
        if (error) throw new Error(error.message);
        listingId = inserted.id as string;
        created += 1;
      }
      if (images.length) {
        await supabaseAdmin.from("listing_images").delete().eq("listing_id", listingId);
        await supabaseAdmin.from("listing_images").insert(
          images.map((image_url, sort_order) => ({ listing_id: listingId!, image_url, sort_order })),
        );
      }
    }
    return { ok: true, created, updated };
  });

export const adminExportCatalog = createServerFn({ method: "GET" })
  .middleware([requireAdminUnlocked])
  .inputValidator((d: unknown) => z.object({ category: z.string().nullish() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getReadDb } = await import("@/lib/catalog-db.server");
    const supabaseAdmin = await getReadDb();
    let q = supabaseAdmin.from("listings").select("*").order("category_slug").limit(5000);
    if (data.category) q = q.eq("category_slug", data.category);
    const { data: listings, error } = await q;
    if (error) throw new Error(error.message);
    const ids = (listings ?? []).map((l: { id: string }) => l.id);
    const images: { listing_id: string; image_url: string; sort_order: number }[] = [];
    for (let i = 0; i < ids.length; i += 200) {
      const { data: chunk } = await supabaseAdmin
        .from("listing_images").select("listing_id, image_url, sort_order").in("listing_id", ids.slice(i, i + 200));
      images.push(...((chunk ?? []) as typeof images));
    }
    images.sort((a, b) => a.sort_order - b.sort_order);
    return {
      listings: listings ?? [],
      gallery: images.reduce<Record<string, string[]>>((acc, row) => {
        (acc[row.listing_id] ||= []).push(row.image_url);
        return acc;
      }, {}),
    };
  });
