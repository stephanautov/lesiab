"use strict";exports.id=579,exports.ids=[579],exports.modules={20960:(a,b,c)=>{c.r(b),c.d(b,{TrpcServerNode:()=>e,default:()=>f});let d=a=>a.replace(/\r\n/g,"\n"),e={id:"trpc.server",phase:"execute",estimate:()=>({tokens:800,usd:.003}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo`,e=d(`// path: server/trpc/_trpc.ts
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
`),f=d(`// path: server/trpc/context.ts
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
`),g=[{path:`${c}/server/trpc/_trpc.ts`,content:e},{path:`${c}/server/trpc/context.ts`,content:f},{path:`${c}/server/trpc/router.ts`,content:d(`// path: server/trpc/router.ts
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
`)},{path:`${c}/app/api/trpc/[trpc]/route.ts`,content:d(`// path: app/api/trpc/[trpc]/route.ts
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
`)}];for(let a of g)await b.storage.saveArtifact(a.path,a.content);return b.logger.info({msg:"trpc.server:written",files:g.map(a=>a.path),correlationId:b.correlationId}),{files:g.map(a=>a.path)}}},f=e}};