// path: server/trpc/uploads.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "./_trpc";
import { createPresignedUploadUrl } from "../../lib/storage";

export const uploadsRouter = createTRPCRouter({
  createUrl: protectedProcedure
    .input(z.object({ filename: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) throw new Error("Unauthorized");
      const { path, url } = await createPresignedUploadUrl(
        userId,
        input.filename,
      );
      return { path, url };
    }),
});

// To merge, add to server/trpc/router.ts:
//   import { uploadsRouter } from "./uploads.router"; // hygen:routers-import
//   export const appRouter = createTRPCRouter({
//     health: healthRouter,
//     uploads: uploadsRouter,                          // hygen:routers-merge
//   });
