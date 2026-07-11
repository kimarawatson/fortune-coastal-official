// Password-gated admin session. The admin is NOT a Supabase user — access is
// controlled by a shared ADMIN_PASSWORD env var. Once unlocked, an encrypted
// session cookie (SESSION_SECRET) carries the admin_unlocked flag.
import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { z } from "zod";

// Middleware for admin-only server functions.
export const requireAdminUnlocked = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { requireAdminUnlockedRaw } = await import("@/lib/admin-gate.server");
  await requireAdminUnlockedRaw();
  return next();
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD env var is not configured.");
    const { passwordMatches, getAdminSession } = await import("@/lib/admin-gate.server");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await getAdminSession();
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("@/lib/admin-gate.server");
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getAdminSession } = await import("@/lib/admin-gate.server");
    const session = await getAdminSession();
    return { unlocked: !!session.data.unlocked };
  } catch {
    return { unlocked: false };
  }
});
