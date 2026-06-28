import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Mail, Shield, User as UserIcon } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { SignOutButton } from "@/components/SignOutButton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — FCG" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

function providerLabel(p?: string) {
  if (!p) return "Email";
  if (p === "email") return "Email & Password";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function ProfilePage() {
  const { user, userId } = useAuth();
  const qc = useQueryClient();

  const profileQ = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, country, email")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileQ.data) {
      setFullName(profileQ.data.full_name ?? "");
      setCountry(profileQ.data.country ?? "");
      setAvatarUrl(profileQ.data.avatar_url ?? "");
    }
  }, [profileQ.data]);

  const provider =
    (user?.app_metadata as any)?.provider ??
    user?.identities?.[0]?.provider ??
    "email";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      const updates = {
        full_name: fullName.trim() || null,
        country: country.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      };
      const { error: pErr } = await supabase.from("profiles").update(updates).eq("id", userId);
      if (pErr) throw pErr;
      // Mirror display name in auth metadata so headers/dashboards reflect it everywhere.
      const { error: uErr } = await supabase.auth.updateUser({
        data: { full_name: updates.full_name, avatar_url: updates.avatar_url },
      });
      if (uErr) throw uErr;
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Profile updated.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 lg:px-10 pt-16 pb-16">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft size={12} /> Back to Dashboard
        </Link>

        <div className="mt-6 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold">Member</div>
            <h1 className="mt-3 font-serif text-5xl text-foreground">My Profile</h1>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <InfoTile icon={UserIcon} label="Name" value={profileQ.data?.full_name || user?.user_metadata?.full_name || "—"} />
          <InfoTile icon={Mail} label="Email" value={user?.email ?? "—"} />
          <InfoTile icon={Shield} label="Signed in via" value={providerLabel(provider)} />
        </div>

        <form onSubmit={handleSave} className="mt-12 space-y-5">
          <h2 className="font-serif text-2xl text-foreground">Edit display info</h2>
          <Field label="Full Name" value={fullName} onChange={setFullName} />
          <Field label="Country" value={country} onChange={setCountry} placeholder="United States" />
          <Field label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} placeholder="https://…" />
          <button
            type="submit"
            disabled={saving || profileQ.isLoading}
            className="bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-8 py-3 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="border border-border/40 p-5">
      <div className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground">
        <Icon size={12} className="text-gold" /> {label}
      </div>
      <div className="mt-2 text-foreground break-words">{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none"
      />
    </label>
  );
}
