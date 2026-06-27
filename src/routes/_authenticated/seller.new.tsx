import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/seller/new")({
  head: () => ({ meta: [{ title: "New Listing — FCG" }, { name: "robots", content: "noindex" }] }),
  component: NewListing,
});

function NewListing() {
  return <ListingForm mode="create" />;
}

export function ListingForm({ mode, initial }: { mode: "create" | "edit"; initial?: any }) {
  const { userId, isSeller } = useAuth();
  const navigate = useNavigate();
  const catsQ = useQuery({ queryKey: ["categories"], queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data ?? [] });

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [category, setCategory] = useState(initial?.category_slug ?? "real-estate");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [country, setCountry] = useState(initial?.country ?? "United States");
  const [city, setCity] = useState(initial?.city ?? "");
  const [priceUsd, setPriceUsd] = useState<string>(String(initial?.price_usd ?? ""));
  const [priceBtc, setPriceBtc] = useState<string>(String(initial?.price_btc ?? ""));
  const [acceptsBtc, setAcceptsBtc] = useState<boolean>(initial?.accepts_btc ?? true);
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? "");
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!isSeller) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="font-serif text-3xl text-foreground">Seller access required</h1>
          <p className="mt-3 text-muted-foreground">Apply for seller access first.</p>
        </div>
      </SiteLayout>
    );
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    try {
      const path = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("listing-media").upload(path, file);
      if (error) throw error;
      // Private bucket: store the path; site renders via a server-signed URL helper.
      // For Phase 2 simplicity we also produce a 1-year signed URL up front.
      const { data: signed } = await supabase.storage.from("listing-media").createSignedUrl(path, 60 * 60 * 24 * 365);
      setter(signed?.signedUrl ?? path);
      toast.success("Uploaded.");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        seller_id: userId!,
        title,
        subtitle: subtitle || null,
        category_slug: category,
        description,
        location,
        country,
        city,
        price_usd: Number(priceUsd),
        price_btc: priceBtc ? Number(priceBtc) : null,
        accepts_btc: acceptsBtc,
        cover_image: coverImage || null,
        status: "pending" as const,
      };
      let listingId = initial?.id;
      if (mode === "create") {
        const { data, error } = await supabase.from("listings").insert(payload).select("id").single();
        if (error) throw error;
        listingId = data.id;
      } else {
        const { error } = await supabase.from("listings").update(payload).eq("id", initial.id);
        if (error) throw error;
      }
      if (listingId && extraImages.length) {
        await supabase.from("listing_images").insert(extraImages.map((url, i) => ({ listing_id: listingId, image_url: url, sort_order: i })));
      }
      toast.success(mode === "create" ? "Listing submitted for review." : "Listing updated.");
      navigate({ to: "/seller" });
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
        <div className="text-[10px] tracking-luxury uppercase text-gold">Seller</div>
        <h1 className="mt-3 font-serif text-5xl text-foreground">{mode === "create" ? "New Listing" : "Edit Listing"}</h1>
        <p className="mt-3 text-muted-foreground text-sm">Submissions are reviewed by our in-house specialists before going live.</p>

        <form onSubmit={submit} className="mt-10 space-y-5">
          <Field label="Title" value={title} onChange={setTitle} />
          <Field label="Subtitle" value={subtitle} onChange={setSubtitle} required={false} />
          <label className="block">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">Category</div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none">
              {(catsQ.data ?? []).map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">Description</div>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
          </label>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" value={city} onChange={setCity} />
            <Field label="Location label" value={location} onChange={setLocation} />
            <Field label="Country" value={country} onChange={setCountry} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price (USD)" type="number" value={priceUsd} onChange={setPriceUsd} />
            <Field label="Price (BTC)" type="number" value={priceBtc} onChange={setPriceBtc} required={false} />
          </div>
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input type="checkbox" checked={acceptsBtc} onChange={(e) => setAcceptsBtc(e.target.checked)} className="accent-[var(--gold)]" />
            Accepts Bitcoin
          </label>

          <div className="border border-border/40 p-5 space-y-4">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Cover Image</div>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={(e) => upload(e, setCoverImage)} className="text-xs text-muted-foreground" />
              {coverImage && <img src={coverImage} alt="" className="h-16 w-24 object-cover" />}
            </div>
            <div className="text-[10px] tracking-luxury uppercase text-gold mt-4">Additional Photos</div>
            <input type="file" accept="image/*" onChange={(e) => upload(e, (u) => setExtraImages((p) => [...p, u]))} className="text-xs text-muted-foreground" />
            {!!extraImages.length && (
              <div className="grid grid-cols-4 gap-2">
                {extraImages.map((u, i) => <img key={i} src={u} alt="" className="h-16 w-full object-cover" />)}
              </div>
            )}
            {uploading && <div className="text-xs text-muted-foreground">Uploading…</div>}
          </div>

          <button disabled={submitting || uploading} className="w-full bg-gold text-primary-foreground py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors disabled:opacity-60">
            {submitting ? "…" : mode === "create" ? "Submit for Review" : "Save Changes"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, value, onChange, type = "text", required = true }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
    </label>
  );
}
