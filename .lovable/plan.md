## Problem

Auth logs show every sign-in attempt failing with `email_not_confirmed`. Signup succeeds and creates the user, but Supabase is configured to require an email confirmation click before the session is issued — and confirmation emails aren't being delivered reliably on your project. Because no one can sign in, no one can reach `/dashboard` to press "Claim First Admin", which is why the admin role also appears broken.

There is nothing wrong with the auth code or the `has_role` logic — it's a single auth setting plus a one-time role grant.

## Fix

1. **Turn off "Confirm email" on the backend** so email + password signups are signed in immediately (Google sign-in is unaffected). New users land on `/dashboard` right after creating an account.
2. **Promote your existing account to admin via a one-shot SQL migration** for `kimarawatson90@gmail.com` (the account already created in the logs), so you don't have to rely on the in-app "Claim First Admin" button. Inserts a row into `user_roles` with role `admin`; idempotent (`ON CONFLICT DO NOTHING`).
3. **Verify**: sign in with that email/password → header shows your name → `/admin` loads → Demo Data → Seed populates the marketplace.

## Notes

- This does not change the auth UI, routes, or any frontend code.
- Google sign-in is currently failing separately with `missing OAuth secret` — that means Google isn't enabled on the backend yet. Out of scope for this fix; tell me when you want to wire it up and I'll enable the Google provider and walk you through the Client ID / Secret.
- If you'd rather keep email confirmation ON for production later, we can re-enable it once a custom SMTP sender is configured.

## Technical detail

- Tool calls: `supabase--configure_auth` with `auto_confirm_email: true` (other flags unchanged: `disable_signup: false`, `external_anonymous_users_enabled: false`, `password_hibp_enabled: true`); then `supabase--migration` running:
  ```sql
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users WHERE email = 'kimarawatson90@gmail.com'
  ON CONFLICT (user_id, role) DO NOTHING;
  ```
