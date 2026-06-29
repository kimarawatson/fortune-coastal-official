## Why nothing shows up

Two independent root causes — both must be fixed:

### 1. Supabase env vars must be **build-time**, not runtime
Vite inlines `import.meta.env.VITE_*` into the JS bundle **when you build**. Runtime Worker/Pages secrets are invisible to the browser bundle, so the client falls back to the values baked in at build time — which still point at the old Lovable Cloud project (or are missing entirely). Result: queries hit the wrong DB / get blocked, and the marketplace renders 0 rows with no console errors (empty query = empty UI).

### 2. Your new Supabase project has no data
Migrations created the **schema** (tables, policies, GRANTs, bucket), but no listings, categories, or homepage content. Marketplace queries `listings` → returns `[]` → "0 Assets".

---

## Fix — do both

### A. Set build-time env vars on Cloudflare
In **Cloudflare Pages → your project → Settings → Environment variables**, add for **Production** (and Preview):

```
VITE_SUPABASE_URL          = https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = <your anon/publishable key>
VITE_SUPABASE_PROJECT_ID   = <your-project-ref>
```

Then **trigger a new deployment** (env-var changes only apply to new builds, not the current one). If you're using Workers directly with Wrangler, put these in `[vars]` in `wrangler.toml` and redeploy — not as `wrangler secret put` (those are runtime-only).

Verify after deploy: open DevTools → Network on the live site → you should see XHRs going to **your** `supabase.co` URL, not the old one.

### B. Seed your own database
On the live site against your new Supabase:
1. Sign up an account (email/password).
2. Visit `/dashboard` → click **Claim First Admin** (only works if no admin exists yet — yours will be the first).
3. Go to `/admin` → **Demo Data** → **Seed** to populate listings, categories, and homepage content.
4. Approve the seeded listings if they land as `pending`.

### C. (If listing images stay broken after seeding)
The seed inserts image URLs that point at the bundled `/src/assets/*` files — those resolve fine because they're shipped with the Cloudflare build. But if you later upload images via the seller form, the `listing-media` bucket is **private** and uses signed URLs — make sure the bucket exists in your new Supabase Storage (migrations should have created it; check **Storage → Buckets**).

---

## What I'll do in this session
Nothing in the codebase needs to change — this is a deployment + data issue on your side. I'll stay on standby to:
- Add a clearer "no data yet, seed me" empty state on the marketplace, or
- Add a one-click seed button visible before claiming admin,
- if you'd like either of those as a follow-up.