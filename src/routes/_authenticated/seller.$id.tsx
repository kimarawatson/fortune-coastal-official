import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingForm } from "./seller.new";
import { SiteLayout } from "@/components/SiteLayout";

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
  return <ListingForm mode="edit" initial={q.data} />;
}
