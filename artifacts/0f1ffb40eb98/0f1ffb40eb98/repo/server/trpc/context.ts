// path: server/trpc/context.ts
// Context for tRPC procedures. Server-only code.
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getServiceSupabase,
  getAccessTokenFromRequest,
  getUserServer,
} from "../../lib/auth";

export type CreateContextOptions = { req: Request };

export async function createTRPCContext(opts: CreateContextOptions) {
  const supabase: SupabaseClient = getServiceSupabase();
  const token = getAccessTokenFromRequest(opts.req);
  const user = await getUserServer(token);
  return {
    supabase,
    userId: user?.id ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
