// path: lib/auth.ts
// Only import this file on the server (route handlers, server components, tRPC context).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";

/** Server-only client using the service role key. */
export function getServiceSupabase(): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
}

/** Extracts access token from a Next.js Request (cookies), if present. */
export function getAccessTokenFromRequest(req: Request): string | undefined {
  // Next Request exposes cookies via req.headers.get("cookie")
  const cookieHeader = req.headers.get("cookie") ?? "";
  // Convention when using Supabase helpers: 'sb-access-token'
  const match = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith("sb-access-token="));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=")[1] ?? "");
}

/** Optional token verification round-trip to Supabase Auth. */
export async function getUserServer(accessToken: string | undefined) {
  if (!accessToken) return null;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) return null;
  return data.user ?? null;
}
