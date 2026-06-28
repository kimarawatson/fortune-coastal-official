import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Props = { className?: string; label?: string; iconOnly?: boolean };

export function SignOutButton({ className, label = "Sign out", iconOnly }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handle() {
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      // Local scope clears this browser's session immediately; server revocation is best-effort.
      await supabase.auth.signOut({ scope: "local" });
      try {
        await supabase.auth.signOut();
      } catch {
        /* ignore server revoke failures — local session is already cleared */
      }
      toast.success("Signed out.");
      navigate({ to: "/", replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not sign out.");
    }
  }

  return (
    <button
      onClick={handle}
      className={
        className ??
        "inline-flex items-center gap-2 border border-border/60 px-4 py-2 text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-gold hover:border-gold transition-colors"
      }
      aria-label={label}
    >
      <LogOut size={12} /> {!iconOnly && label}
    </button>
  );
}
