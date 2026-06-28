import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import logo from "@/assets/fcg-logo.png";
import authBg from "@/assets/auth-luxury.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Sign in — Fortune Coastal Group" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(8).max(72);

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const e1 = emailSchema.safeParse(email);
      if (!e1.success) throw new Error("Please enter a valid email.");
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(e1.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your inbox for a reset link.");
        setMode("signin");
        return;
      }
      const p1 = passwordSchema.safeParse(password);
      if (!p1.success) throw new Error("Password must be 8–72 characters.");
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: e1.data,
          password: p1.data,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName.trim() || null },
          },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: e1.data, password: p1.data });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-charcoal overflow-hidden">
        <img src={authBg} alt="Luxury oceanfront estate at golden hour" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 30% 40%, oklch(0.74 0.09 78 / 0.18), transparent 70%)" }} />
        <div className="relative h-full flex flex-col justify-between p-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="FCG" className="h-10 w-10" />
              <div className="text-[10px] tracking-luxury uppercase text-gold">Fortune Coastal Group</div>
            </Link>
            <Link to="/" className="text-[10px] tracking-luxury uppercase text-foreground/80 hover:text-gold transition-colors">
              ← Back to site
            </Link>
          </div>
          <div>
            <div className="font-serif text-4xl text-foreground italic drop-shadow-lg">"American luxury, privately transacted."</div>
            <div className="mt-4 text-xs tracking-luxury uppercase text-gold">FCG · Private Members</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 lg:p-16">
        <form onSubmit={handleEmail} className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors mb-8">
            ← Back to Home
          </Link>
          <div className="text-[10px] tracking-luxury uppercase text-gold">
            {mode === "signin" ? "Member Access" : mode === "signup" ? "Apply" : "Reset Password"}
          </div>
          <h1 className="mt-3 font-serif text-4xl text-foreground">
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create account" : "Forgot password"}
          </h1>

          <div className="mt-8 space-y-4">
            {mode === "signup" && <Field label="Full Name" value={fullName} onChange={setFullName} />}
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            {mode !== "forgot" && <Field label="Password" type="password" value={password} onChange={setPassword} />}

            <button disabled={loading} className="w-full bg-gold text-primary-foreground py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors disabled:opacity-60">
              {loading ? "…" : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </button>

            {mode !== "forgot" && (
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full border border-border/60 text-foreground py-4 text-xs tracking-luxury uppercase hover:border-gold hover:text-gold transition-colors disabled:opacity-60"
              >
                Continue with Google
              </button>
            )}

            <div className="text-xs text-muted-foreground flex justify-between pt-3">
              {mode === "signin" ? (
                <>
                  <button type="button" onClick={() => setMode("forgot")} className="hover:text-gold">Forgot password?</button>
                  <button type="button" onClick={() => setMode("signup")} className="hover:text-gold">Create account</button>
                </>
              ) : (
                <button type="button" onClick={() => setMode("signin")} className="hover:text-gold">Back to sign in</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none"
        required
      />
    </label>
  );
}
