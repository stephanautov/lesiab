// path: lib/auth-server.ts
// Server-only Supabase helpers — safe to import in route handlers / server code.
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "../env.mjs";

/** Admin (service role) client: background tasks, storage, admin ops. */
export function getServiceSupabase(): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
}

/** Extract sb-access-token from a Request's Cookie header (no Next APIs). */
export function getAccessTokenFromRequest(req: Request): string | undefined {
  const cookieHeader = req.headers.get("cookie") ?? "";
  if (!cookieHeader) return undefined;

  // Parse cookie string → map
  const map = Object.create(null) as Record<string, string>;
  for (const part of cookieHeader.split(/;\s*/)) {
    if (!part) continue;
    const i = part.indexOf("=");
    if (i === -1) continue;
    const k = decodeURIComponent(part.slice(0, i));
    const v = decodeURIComponent(part.slice(i + 1));
    map[k] = v;
  }
  // Old default name
  if (map["sb-access-token"]) return map["sb-access-token"];

  // Newer SSR helper names include the project ref in the cookie key.
  // Example: sb-abc123-access-token
  const ref = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/,
  )?.[1];
  if (ref && map[`sb-${ref}-access-token`])
    return map[`sb-${ref}-access-token`];

  // Some setups use a consolidated "sb-auth-token" JSON value; ignore here to keep it simple.
  return undefined;
}

/** Optional token verification round-trip using the Admin client. */
export async function getUserServer(accessToken: string | undefined) {
  if (!accessToken) return null;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) return null;
  return data.user ?? null;
}

/** SSR session-aware client (Next 15: cookies() is async). */
export async function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = await cookies();

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

/** Request-scoped RLS client (for forwarding the bearer token). */
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
