// Server-only Supabase client helpers for the password-gated admin console.
//
// Reads prefer the service-role client (so drafts / pending rows are visible),
// but fall back to the publishable (anon) key when the service-role key is not
// configured or rejected by the project — the public read policy still exposes
// approved listings, so the admin product table never renders empty just
// because of a key mismatch.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const CATEGORY_ORDER = [
  "real-estate",
  "cars",
  "yachts",
  "jets",
  "motorcycles",
  "jewelry",
];

export function categoryRank(slug: string | null | undefined) {
  const i = CATEGORY_ORDER.indexOf(String(slug ?? ""));
  return i === -1 ? 99 : i;
}

export function createPublicDb(): SupabaseClient<Database> {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("Supabase URL / publishable key are not configured on the server.");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

function createKeyFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    }
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

export async function getWriteDb(): Promise<SupabaseClient<Database>> {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Database URL / service key are not configured on the server.");
  return createClient<Database>(url, key, {
    global: { fetch: createKeyFetch(key) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/** Service-role client when usable, otherwise the anon client. */
export async function getReadDb(): Promise<SupabaseClient<Database>> {
  try {
    const db = await getWriteDb();
    const { error } = await db.from("listings").select("id", { head: true, count: "exact" }).limit(1);
    if (!error) return db;
    console.error("[admin] service-role read failed, falling back to publishable key:", error.message);
  } catch (err) {
    console.error("[admin] service-role client unavailable, falling back to publishable key:", err);
  }
  return createPublicDb();
}
