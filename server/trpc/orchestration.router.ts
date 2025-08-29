// path: server/trpc/orchestration.router.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./_trpc";
import { runOrchestration } from "../orchestration/run";
import ProfileNormalizeNode from "../../nodes/profile.normalize";
import { createArtifactStorage } from "../orchestration/storage";

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

const ModeSchema = z.enum(["deterministic", "unique"]).default("deterministic");

function newRunId() {
  // e.g. 2025-08-29T01_12_33Z-7hw3fj
  const iso = new Date().toISOString().replace(/:/g, "_");
  const nonce = Math.random().toString(36).slice(2, 8);
  return `${iso}-${nonce}`;
}

export const orchestrationRouter = createTRPCRouter({
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
      const runId = newRunId();
      const storage = createArtifactStorage(orchestrationId, runId);
      const ctx = {
        orchestrationId,
        correlationId: orchestrationId,
        logger: { info: () => {}, warn: () => {}, error: () => {} },
        storage,
      } as const;
      const out = await ProfileNormalizeNode.run(
        { description: input.description, answers: input.answers },
        ctx as any,
      );
      return { orchestrationId, runId, profile: out.profile };
    }),

  start: publicProcedure
    .input(
      z.object({
        description: z.string().min(5),
        answers: AnswersSchema.optional(),
        mode: ModeSchema.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await runOrchestration(
        input.description,
        input.answers,
        input.mode ?? "deterministic",
      );
      return res; // { orchestrationId, runId, files }
    }),
});
