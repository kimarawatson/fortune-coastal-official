import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingForm } from "./seller.new";
import { SiteLayout } from "@/components/SiteLayout";
import { BackToSiteLink } from "@/components/BackToSiteLink";

export const Route = createFileRoute("/_authenticated/seller/$id")({
  head: () => ({ meta: [{ title: "Edit Listing — FCG" }, { name: "robots", content: "noindex" }] }),
  component: EditListing,
});

function EditListing() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["listing-edit", id],
    queryFn: async () => (await supabase.from("listings").select("*").eq("id", id).maybeSingle()).data,
  });
  if (q.isLoading) return <SiteLayout><div className="px-6 py-32 text-center text-muted-foreground"><BackToSiteLink className="mb-8" />Loading…</div></SiteLayout>;
  if (!q.data) return <SiteLayout><div className="px-6 py-32 text-center"><BackToSiteLink className="mb-8" /><div className="font-serif text-3xl text-foreground">Listing not found</div></div></SiteLayout>;
  return <ListingForm mode="edit" initial={q.data} />;
}
