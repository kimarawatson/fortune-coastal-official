import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, MessageSquare, Shield, ShieldAlert, Store, UserCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { SignOutButton } from "@/components/SignOutButton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/listings.functions";
import { formatUsd } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FCG" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, userId, roles, isAdmin, isSeller, loading } = useAuth();
  const claim = useServerFn(claimFirstAdmin);

  const inquiriesQ = useQuery({
    queryKey: ["my-inquiries", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id, message, created_at, seller_response, listings:listing_id(id,title,cover_image,price_usd)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [adminCount, setAdminCount] = useState<number | null>(null);
  useEffect(() => {
    supabase.rpc("admin_exists").then(({ data }) => setAdminCount(data ? 1 : 0));
  }, []);

  async function handleClaim() {
    try {
      await claim();
      toast.success("You are now the admin. Refreshing…");
      setTimeout(() => window.location.reload(), 600);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not claim admin.");
    }
  }

  if (loading) return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground text-xs tracking-luxury uppercase">Loading…</div>;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-12">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold">Member Portal</div>
            <h1 className="mt-3 font-serif text-5xl text-foreground">Welcome, {user?.user_metadata?.full_name || user?.email}</h1>
            <p className="mt-3 text-muted-foreground">Roles: {roles.length ? roles.join(", ") : "buyer"}</p>
          </div>
          <SignOutButton />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-5 md:grid-cols-3">
        <PortalCard to="/profile" icon={UserCircle} title="My Profile" body="Update your name, country, and avatar." />
        <PortalCard to="/marketplace" icon={ArrowRight} title="Browse Marketplace" body="Discover verified luxury assets across the United States." />
        <PortalCard to="/seller" icon={Store} title={isSeller ? "Seller Portal" : "Become a Seller"} body={isSeller ? "Manage your listings, photos, and inquiries." : "Apply to list assets on FCG."} />
        {isAdmin && <PortalCard to="/admin" icon={Shield} title="Admin Console" body="Manage listings, users, categories, and homepage." />}
        {adminCount === 0 && !isAdmin && (
          <button onClick={handleClaim} className="text-left border border-gold/60 bg-gold/5 p-8 hover:bg-gold/10 transition-colors">
            <ShieldAlert className="text-gold" size={20} />
            <div className="mt-4 font-serif text-2xl text-foreground">Claim admin access</div>
            <p className="mt-2 text-sm text-muted-foreground">No admin exists yet. Claim the first admin role for the marketplace.</p>
          </button>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-16">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare size={16} className="text-gold" />
          <h2 className="font-serif text-2xl text-foreground">My Inquiries</h2>
        </div>
        {inquiriesQ.isLoading ? (
          <div className="text-xs text-muted-foreground">Loading…</div>
        ) : !inquiriesQ.data?.length ? (
          <div className="border border-border/40 p-10 text-center">
            <div className="text-muted-foreground">No inquiries yet.</div>
            <Link to="/marketplace" className="mt-3 inline-block text-gold text-xs tracking-luxury uppercase">Browse the marketplace</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {inquiriesQ.data.map((i: any) => (
              <div key={i.id} className="border border-border/40 p-5 grid md:grid-cols-[120px_1fr] gap-5">
                {i.listings?.cover_image && <img src={i.listings.cover_image} alt="" className="h-20 w-30 object-cover" />}
                <div>
                  <div className="font-serif text-lg text-foreground">{i.listings?.title ?? "Listing"}</div>
                  <div className="text-xs text-gold">{i.listings ? formatUsd(i.listings.price_usd) : ""}</div>
                  <p className="mt-2 text-sm text-muted-foreground">"{i.message}"</p>
                  {i.seller_response && <p className="mt-2 text-sm text-foreground"><span className="text-gold text-[10px] tracking-luxury uppercase">Seller: </span>{i.seller_response}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function PortalCard({ to, icon: Icon, title, body }: { to: string; icon: any; title: string; body: string }) {
  return (
    <Link to={to as any} className="border border-border/40 p-8 hover:border-gold/60 transition-colors block">
      <Icon className="text-gold" size={20} />
      <div className="mt-4 font-serif text-2xl text-foreground">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </Link>
  );
}
