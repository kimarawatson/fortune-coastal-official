// Password-gated admin session. The admin is NOT a Supabase user — access is
// controlled by a shared ADMIN_PASSWORD env var. Once unlocked, an encrypted
// session cookie (SESSION_SECRET) carries the admin_unlocked flag.
import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET env var missing or too short (min 32 chars).");
  }
  return {
    password,
    name: "fcg-admin",
    maxAge: 60 * 60 * 8, // 8h
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export async function requireAdminUnlockedRaw() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("Admin locked");
  return session;
}

// Middleware for admin-only server functions.
export const requireAdminUnlocked = createMiddleware({ type: "function" }).server(async ({ next }) => {
  await requireAdminUnlockedRaw();
  return next();
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD env var is not configured.");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const session = await useSession<AdminSession>(sessionConfig());
    return { unlocked: !!session.data.unlocked };
  } catch {
    return { unlocked: false };
  }
});
