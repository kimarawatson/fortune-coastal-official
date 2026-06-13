import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BackToSiteLink } from "@/components/BackToSiteLink";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — FCG" }, { name: "robots", content: "noindex" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (password.length < 8) throw new Error("Password must be at least 8 characters.");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <form onSubmit={handle} className="w-full max-w-sm">
        <BackToSiteLink className="mb-8" />
        <div className="text-[10px] tracking-luxury uppercase text-gold">Reset Password</div>
        <h1 className="mt-3 font-serif text-4xl text-foreground">Set a new password</h1>
        <label className="block mt-8">
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">New Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none"
          />
        </label>
        <button disabled={loading} className="w-full mt-6 bg-gold text-primary-foreground py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors disabled:opacity-60">
          {loading ? "…" : "Update Password"}
        </button>
        <div className="mt-6 text-xs text-center text-muted-foreground">
          <Link to="/auth" className="hover:text-gold">Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}
