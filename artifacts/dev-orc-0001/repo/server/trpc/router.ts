// path: server/trpc/router.ts
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
