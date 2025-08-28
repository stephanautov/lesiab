// path: server/trpc/orchestration.router.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./_trpc";
import { runOrchestration } from "../orchestration/run";

/**
 * Start an orchestration (synchronous MVP).
 * Returns the orchestrationId and the list of artifact paths persisted to Storage.
 */
export const orchestrationRouter = createTRPCRouter({
  start: publicProcedure
    .input(z.object({ description: z.string().min(5, "Describe at least a few words") }))
    .mutation(async ({ input }) => {
      const { orchestrationId, files } = await runOrchestration(input.description);
      return { orchestrationId, files };
    }),
});
