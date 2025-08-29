// path: server/trpc/orchestration.router.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./_trpc";
import { runOrchestration } from "../orchestration/run";
import ProfileNormalizeNode from "../../nodes/profile.normalize";
import { createArtifactStorage } from "../orchestration/storage";

/** Keep this schema aligned with the node's QuestionnaireSchema */
const AnswersSchema = z
  .object({
    targets: z.enum(["mobile", "desktop", "both"]).default("both"),
    uploads: z
      .object({
        enabled: z.boolean().default(false),
        types: z
          .array(z.enum(["audio", "code", "image", "text", "pdf", "video"]))
          .default([]),
      })
      .default({ enabled: false, types: [] }),
    downloads: z
      .object({
        enabled: z.boolean().default(false),
        types: z
          .array(z.enum(["audio", "code", "image", "text", "pdf", "video"]))
          .default([]),
      })
      .default({ enabled: false, types: [] }),
    business: z
      .object({
        isBusiness: z.boolean().default(false),
        model: z.enum(["subscription", "services", "products"]).optional(),
      })
      .default({ isBusiness: false }),
    audience: z.string().default(""),
  })
  .strict();

export const orchestrationRouter = createTRPCRouter({
  /** Preview only runs profile.normalize to show the proposed profile.json */
  preview: publicProcedure
    .input(
      z.object({
        description: z.string().min(5),
        answers: AnswersSchema.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const orchestrationId =
        "preview-" + Math.random().toString(36).slice(2, 8);
      const storage = createArtifactStorage(orchestrationId);

      const ctx = {
        orchestrationId,
        correlationId: orchestrationId,
        logger: { info: () => {}, warn: () => {}, error: () => {} },
        storage,
      } as const;

      // Call the node directly with { description, answers }
      const out = await ProfileNormalizeNode.run(
        { description: input.description, answers: input.answers },
        ctx as any,
      );

      return { orchestrationId, profile: out.profile };
    }),

  /** Start the full plan and return artifact list + orchestration id */
  start: publicProcedure
    .input(
      z.object({
        description: z.string().min(5),
        answers: AnswersSchema.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { orchestrationId, files } = await runOrchestration(
        input.description,
        input.answers,
      );
      return { orchestrationId, files };
    }),
});
