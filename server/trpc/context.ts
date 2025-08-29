// path: server/trpc/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import {
  getServiceSupabase,
  getSupabaseServer,
  getAccessTokenFromRequest,
  getUserServer,
} from "../../lib/auth-server";

// Whatever shape you already expose on ctx (add/keep what you need)
export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const { req } = opts;
  const supabaseAdmin = getServiceSupabase();

  // 1) Preferred: SSR client reads cookies and returns the user
  let user: Awaited<ReturnType<typeof getUserServer>> | null = null;
  try {
    const ssr = await getSupabaseServer();
    const { data, error } = await ssr.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch {
    // ignore; we’ll fallback
  }

  // 2) Fallback: manually extract access token cookie and verify via admin client
  if (!user) {
    const token = getAccessTokenFromRequest(req);
    user = await getUserServer(token);
  }

  return {
    req,
    supabase: supabaseAdmin, // admin client (bypasses RLS; use for server ops)
    user, // <- presence of this gates protectedProcedure
  };
}
export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;
