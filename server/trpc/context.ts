// path: server/trpc/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import {
  getServiceSupabase,
  getSupabaseServer,
  getAccessTokenFromRequest,
  getUserServer,
} from "../../lib/auth-server";

function getAccessTokenFromAuthHeader(req: Request): string | undefined {
  const auth =
    req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!auth) return undefined;
  const [scheme, token] = auth.split(" ");
  if (!scheme || !token) return undefined;
  if (scheme.toLowerCase() !== "bearer") return undefined;
  return token;
}

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const { req } = opts;
  const supabaseAdmin = getServiceSupabase();

  // 1) Preferred: SSR client reads cookies
  let user: Awaited<ReturnType<typeof getUserServer>> | null = null;
  try {
    const ssr = await getSupabaseServer();
    const { data, error } = await ssr.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch {
    // ignore; fallbacks below
  }

  // 2) Fallbacks: cookie access token, then Authorization header
  if (!user) {
    const cookieToken = getAccessTokenFromRequest(req);
    const headerToken = getAccessTokenFromAuthHeader(req);
    const token = cookieToken ?? headerToken;
    user = await getUserServer(token);
  }

  return {
    req,
    supabase: supabaseAdmin, // admin client for server ops
    user, // presence gates protectedProcedure
  };
}
export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;
export type Context = TRPCContext; // (optional alias)
