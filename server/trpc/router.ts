// path: server/trpc/router.ts
import { createTRPCRouter, publicProcedure } from "./_trpc";

// hygen:routers-import
import { uploadsRouter } from "./uploads.router";
import { embeddingsRouter } from "./embeddings.router";
import { orchestrationRouter } from "./orchestration.router";

const healthRouter = createTRPCRouter({
  ping: publicProcedure.query(() => "pong"),
});

export const appRouter = createTRPCRouter({
  health: healthRouter,
  uploads: uploadsRouter, // hygen:routers-merge
  embeddings: embeddingsRouter, // hygen:routers-merge
  orchestration: orchestrationRouter, // hygen:routers-merge
});

export type AppRouter = typeof appRouter;
