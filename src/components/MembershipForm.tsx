import { useState } from "react";
import { ArrowRight, Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { requestMembership } from "@/lib/home.functions";

const interests = ["Real Estate", "Yachts", "Private Jets", "Hypercars", "Islands", "Bitcoin Settlement"];

export function MembershipForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await requestMembership({
        data: {
          full_name: String(fd.get("full_name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? "") || null,
          interest: String(fd.get("interest") ?? "") || null,
          message: String(fd.get("message") ?? "") || null,
        },
      });
      setSent(true);
      toast.success("Membership request received. Our private office will be in touch.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not submit your request.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-charcoal/45 backdrop-blur-md p-10 text-center">
        <div className="mx-auto h-14 w-14 grid place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold">
          <Crown size={26} strokeWidth={1.4} />
        </div>
        <h3 className="mt-6 font-serif text-2xl text-foreground">Request received</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          A Fortune relationship manager will contact you privately within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-charcoal/45 backdrop-blur-md p-8 lg:p-10 space-y-4">
      <div className="text-[10px] tracking-luxury uppercase text-gold">Private Application</div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="full_name" label="Full name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="phone" label="Phone" />
        <label className="block">
          <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">Primary interest</span>
          <select
            name="interest"
            defaultValue={interests[0]}
            className="mt-2 w-full bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-gold/60"
          >
            {interests.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">What are you looking for?</span>
        <textarea
          name="message"
          rows={3}
          className="mt-2 w-full bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-gold/60 resize-none"
          placeholder="Off-market beachfront under $30M, Bitcoin settlement…"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="group inline-flex items-center gap-3 bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-9 py-4 text-xs tracking-luxury uppercase font-semibold hover:opacity-95 transition-all gold-shadow disabled:opacity-60"
      >
        {busy ? "Submitting…" : "Request Membership"}
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </button>
      <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Check size={12} className="text-gold" /> Applications are reviewed privately. No public directory.
      </p>
    </form>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-gold/60"
      />
    </label>
  );
}
