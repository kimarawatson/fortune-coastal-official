import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit, MessageSquare, Plus, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatUsd } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/seller")({
  head: () => ({ meta: [{ title: "Seller Portal — FCG" }, { name: "robots", content: "noindex" }] }),
  component: SellerPortal,
});

function SellerPortal() {
  const { userId, isSeller, loading } = useAuth();
  const qc = useQueryClient();

  const appQ = useQuery({
    queryKey: ["my-application", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.from("seller_applications").select("*").eq("user_id", userId!).maybeSingle();
      return data;
    },
  });

  const listingsQ = useQuery({
    queryKey: ["my-listings", userId],
    enabled: !!userId && isSeller,
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*").eq("seller_id", userId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const inquiriesQ = useQuery({
    queryKey: ["seller-inquiries", userId],
    enabled: !!userId && isSeller,
    queryFn: async () => {
      const { data } = await supabase
        .from("inquiries")
        .select("id, message, seller_response, created_at, listings:listing_id(id,title), profiles:buyer_id(full_name,email)")
        .eq("seller_id", userId!)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (loading) return <FullCenter>Loading…</FullCenter>;

  if (!isSeller) {
    return <SellerApply existing={appQ.data} onSubmitted={() => qc.invalidateQueries({ queryKey: ["my-application"] })} />;
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-12 flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">Seller Portal</div>
          <h1 className="mt-3 font-serif text-5xl text-foreground">My Listings</h1>
        </div>
        <Link to="/seller/new" className="inline-flex items-center gap-2 bg-gold text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
          <Plus size={14} /> New Listing
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        {listingsQ.isLoading ? (
          <div className="text-xs text-muted-foreground">Loading…</div>
        ) : !listingsQ.data?.length ? (
          <Empty title="No listings yet" body="Create your first listing — it will be reviewed by our specialists before publishing." cta={{ to: "/seller/new", label: "Create Listing" }} />
        ) : (
          <div className="border border-border/40">
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
                <tr className="border-b border-border/40">
                  <th className="text-left p-4">Asset</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listingsQ.data.map((l: any) => (
                  <tr key={l.id} className="border-b border-border/40 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {l.cover_image && <img src={l.cover_image} alt="" className="h-12 w-16 object-cover" />}
                        <div>
                          <div className="text-foreground">{l.title}</div>
                          <div className="text-xs text-muted-foreground">{l.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><StatusPill status={l.status} /></td>
                    <td className="p-4 text-gold">{formatUsd(Number(l.price_usd))}</td>
                    <td className="p-4 space-x-3">
                      <Link to="/seller/$id" params={{ id: l.id }} className="text-xs tracking-luxury uppercase text-gold hover:underline inline-flex items-center gap-1"><Edit size={12} /> Edit</Link>
                      <DeleteButton id={l.id} onDone={() => qc.invalidateQueries({ queryKey: ["my-listings"] })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-16 pb-20">
        <div className="flex items-center gap-3 mb-6"><MessageSquare size={16} className="text-gold" /><h2 className="font-serif text-2xl text-foreground">Buyer Inquiries</h2></div>
        {!inquiriesQ.data?.length ? (
          <div className="border border-border/40 p-8 text-muted-foreground text-sm">No inquiries yet.</div>
        ) : (
          <div className="grid gap-4">
            {inquiriesQ.data.map((i: any) => <InquiryRow key={i.id} inq={i} onDone={() => qc.invalidateQueries({ queryKey: ["seller-inquiries"] })} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function InquiryRow({ inq, onDone }: { inq: any; onDone: () => void }) {
  const [resp, setResp] = useState(inq.seller_response ?? "");
  const save = async () => {
    const { error } = await supabase.from("inquiries").update({ seller_response: resp }).eq("id", inq.id);
    if (error) toast.error(error.message);
    else { toast.success("Response saved."); onDone(); }
  };
  return (
    <div className="border border-border/40 p-5">
      <div className="text-xs text-muted-foreground">{inq.profiles?.full_name ?? inq.profiles?.email} · {inq.listings?.title}</div>
      <p className="mt-2 text-sm text-foreground">"{inq.message}"</p>
      <textarea
        value={resp}
        onChange={(e) => setResp(e.target.value)}
        rows={2}
        placeholder="Write a private response…"
        className="mt-3 w-full bg-charcoal border border-border/40 px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
      />
      <button onClick={save} className="mt-2 text-[10px] tracking-luxury uppercase text-gold hover:underline">Save Response</button>
    </div>
  );
}

function DeleteButton({ id, onDone }: { id: string; onDone: () => void }) {
  const m = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted."); onDone(); },
    onError: (e: any) => toast.error(e?.message ?? "Delete failed."),
  });
  return (
    <button onClick={() => { if (confirm("Delete this listing?")) m.mutate(); }} className="text-xs tracking-luxury uppercase text-destructive hover:underline inline-flex items-center gap-1">
      <Trash2 size={12} /> Delete
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "text-muted-foreground border-border",
    pending: "text-gold border-gold/40",
    approved: "text-emerald-400 border-emerald-500/40",
    rejected: "text-destructive border-destructive/40",
  };
  return <span className={`inline-block border px-2 py-0.5 text-[10px] tracking-luxury uppercase ${map[status] ?? ""}`}>{status}</span>;
}

function Empty({ title, body, cta }: { title: string; body: string; cta: { to: string; label: string } }) {
  return (
    <div className="border border-border/40 p-16 text-center">
      <div className="font-serif text-2xl text-foreground">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Link to={cta.to as any} className="mt-6 inline-block bg-gold text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">{cta.label}</Link>
    </div>
  );
}

function SellerApply({ existing, onSubmitted }: { existing: any; onSubmitted: () => void }) {
  const { userId } = useAuth();
  const [company, setCompany] = useState(existing?.company_name ?? "");
  const [about, setAbout] = useState(existing?.about ?? "");
  const [website, setWebsite] = useState(existing?.website ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { user_id: userId!, company_name: company, about, website, status: "pending" as const };
      const { error } = await supabase.from("seller_applications").upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
      toast.success("Application submitted. Our team will review within 48 hours.");
      onSubmitted();
    } catch (err: any) {
      toast.error(err?.message ?? "Could not submit application.");
    } finally {
      setSaving(false);
    }
  };

  const status = existing?.status as string | undefined;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-6 lg:px-10 py-20">
        <div className="text-[10px] tracking-luxury uppercase text-gold">Seller Application</div>
        <h1 className="mt-3 font-serif text-5xl text-foreground">Become an FCG Seller</h1>
        <p className="mt-4 text-muted-foreground">
          Listings on Fortune Coastal Group are certified by our in-house specialists. Tell us about you — our advisory desk reviews applications within 48 hours.
        </p>
        {status && (
          <div className="mt-6 border border-border/40 p-4 text-sm">
            Application status: <StatusPill status={status} />
            {existing?.admin_notes && <div className="mt-2 text-xs text-muted-foreground">Notes: {existing.admin_notes}</div>}
          </div>
        )}
        <form onSubmit={submit} className="mt-10 space-y-5">
          <Field label="Company / Brokerage" value={company} onChange={setCompany} />
          <Field label="Website" value={website} onChange={setWebsite} placeholder="https://" />
          <label className="block">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">About</div>
            <textarea required value={about} onChange={(e) => setAbout(e.target.value)} rows={6} className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
          </label>
          <button disabled={saving} className="w-full bg-gold text-primary-foreground py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors disabled:opacity-60">
            {saving ? "…" : status === "pending" ? "Update Application" : "Submit Application"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
    </label>
  );
}

function FullCenter({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground text-xs tracking-luxury uppercase">{children}</div>;
}
