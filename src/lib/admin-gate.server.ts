// Server-only helpers for the admin password gate. Never import from client code.
import { getRequest, useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

export type AdminSession = { unlocked?: boolean };

export function sessionConfig() {
  const password = process.env["SESSION_SECRET"];
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET env var missing or too short (min 32 chars).");
  }
  const request = getRequest();
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secure = forwardedProtocol ? forwardedProtocol === "https" : new URL(request.url).protocol === "https:";
  return {
    password,
    name: "fcg-admin",
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure, sameSite: "lax" as const, path: "/" },
  };
}

export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export async function getAdminSession() {
  return useSession<AdminSession>(sessionConfig());
}

export async function requireAdminUnlockedRaw() {
  const session = await getAdminSession();
  if (!session.data.unlocked) throw new Error("Admin locked");
  return session;
}
