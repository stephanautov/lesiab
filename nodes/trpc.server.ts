// path: nodes/trpc.server.ts
/**
 * NODE: trpc.server
 * Phase: execute
 *
 * Purpose:
 *  - Establish the server-side tRPC foundation:
 *    * _trpc primitives (initTRPC + superjson + protectedProcedure)
 *    * Context creation (Supabase service client + userId from auth cookie)
 *    * Next.js App Router adapter under /api/trpc
 *    * Root router aggregation file with Hygen injection markers
 *
 * Outputs:
 *  - artifacts/${orc}/repo/server/trpc/_trpc.ts
 *  - artifacts/${orc}/repo/server/trpc/context.ts
 *  - artifacts/${orc}/repo/server/trpc/router.ts
 *  - artifacts/${orc}/repo/app/api/trpc/[trpc]/route.ts
 *
 * Notes:
 *  - Requires files from `auth.setup` (lib/auth.ts) and `env.schema` (env.mjs).
 *  - We keep runtime = "nodejs" for tRPC route; REST public endpoints handle edge/CDN.
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: { saveArtifact: (path: string, content: string | Uint8Array) => Promise<void> };
}
export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase:
    | "processResponses"
    | "analyze"
    | "validate"
    | "plan"
    | "execute"
    | "codeGeneration"
    | "integrate"
    | "finalize";
  estimate?: (input: I) => { tokens?: number; usd?: number };
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}

const lf = (s: string) => s.replace(/\r\n/g, "\n");

export const TrpcServerNode: NodeSpec<unknown, { files: string[] }> = {
  id: "trpc.server",
  phase: "execute",
  estimate: () => ({ tokens: 800, usd: 0.003 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const _trpcTs = lf(`// path: server/trpc/_trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});

export const protectedProcedure = t.procedure.use(isAuthed);
`);

    const contextTs = lf(`// path: server/trpc/context.ts
// Context for tRPC procedures. Server-only code.
import type { SupabaseClient } from "@supabase/supabase-js";
import { getServiceSupabase, getAccessTokenFromRequest, getUserServer } from "../../lib/auth";

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
`);

    const routerTs = lf(`// path: server/trpc/router.ts
import { createTRPCRouter, publicProcedure } from "./_trpc";

// hygen:routers-import

const healthRouter = createTRPCRouter({
  ping: publicProcedure.query(() => "pong")
});

export const appRouter = createTRPCRouter({
  health: healthRouter,
  // hygen:routers-merge
});

export type AppRouter = typeof appRouter;
`);

    const routeTs = lf(`// path: app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server/trpc/router";
import { createTRPCContext } from "../../../../server/trpc/context";

// Keep tRPC on the Node.js runtime (REST public endpoints handle edge/CDN).
export const runtime = "nodejs";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req }) => createTRPCContext({ req }),
    onError({ error, path }) {
      // Optional: basic logging hook (kept deterministic)
      // console.error("tRPC error on", path, error);
    },
  });

export { handler as GET, handler as POST };
`);

    const files = [
      { path: `${root}/server/trpc/_trpc.ts`, content: _trpcTs },
      { path: `${root}/server/trpc/context.ts`, content: contextTs },
      { path: `${root}/server/trpc/router.ts`, content: routerTs },
      { path: `${root}/app/api/trpc/[trpc]/route.ts`, content: routeTs },
    ];

    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }

    ctx.logger.info({
      msg: "trpc.server:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });

    return { files: files.map((f) => f.path) };
  },
};

export default TrpcServerNode;
