// path: lib/auth.ts
// Shared Supabase helpers for server, SSR (Next 15), and browser.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "../env.mjs";

/* ----------------------------------------------------------------------------
 * SERVER-ONLY (Service role) — used by background tasks, storage, admin ops.
 * Exposes the three functions your tRPC context already imports.
 * --------------------------------------------------------------------------*/

/** Server-only client using the service role key. */
export function getServiceSupabase(): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
}

/** Extract sb-access-token from a Next.js Request's Cookie header (no Next APIs). */
export function getAccessTokenFromRequest(req: Request): string | undefined {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith("sb-access-token="));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=")[1] ?? "");
}

/** Optional token verification using the Admin (service) client. */
export async function getUserServer(accessToken: string | undefined) {
  if (!accessToken) return null;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) return null;
  return data.user ?? null;
}

/* ----------------------------------------------------------------------------
 * BROWSER (client) — used by /login page and other client-side auth flows.
 * Requires public env vars.
 * --------------------------------------------------------------------------*/

export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon);
}

/* ----------------------------------------------------------------------------
 * SERVER (SSR) — Next 15: cookies() is async, so this helper is async.
 * Use in route handlers or Server Components that need a session-aware client.
 * --------------------------------------------------------------------------*/

export async function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = await cookies(); // Next 15: Promise<ReadonlyRequestCookies>

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}

/* ----------------------------------------------------------------------------
 * OPTIONAL: request-scoped RLS client (if you ever want context to use RLS).
 * This creates an anon client that forwards the bearer token from the Request.
 * Not used by default; your context can stick with getServiceSupabase().
 * --------------------------------------------------------------------------*/
export function getSupabaseForRequest(req: Request): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const token = getAccessTokenFromRequest(req);
  return createClient(url, anon, {
    auth: { persistSession: false },
    global: token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined,
  });
}
