// path: server/trpc/embeddings.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "./_trpc";

/**
 * Enqueue embeddings work by calling the embeddings Edge Function directly.
 * Deterministic jobId is computed as a simple hash of the text.
 */
import crypto from "crypto";

function stableId(text: string) {
  const h = crypto.createHash("sha256").update(text, "utf8").digest("hex");
  return h.slice(0, 32); // deterministic, short
}

export const embeddingsRouter = createTRPCRouter({
  enqueue: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        table: z.string().min(1).default("embeddings_index"),
        id: z.string().uuid().optional(), // optional record id to upsert
        vectorColumn: z.string().min(1).default("embedding"),
        contentColumn: z.string().min(1).default("content"),
      }),
    )
    .mutation(async ({ input }) => {
      const jobId = input.id ?? stableId(input.text);
      const url = new URL(
        "/functions/v1/embeddings",
        process.env.SUPABASE_URL!,
      );
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE!}`,
        },
        body: JSON.stringify({
          jobId,
          text: input.text,
          table: input.table,
          vectorColumn: input.vectorColumn,
          contentColumn: input.contentColumn,
        }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`embeddings enqueue failed (${res.status}): ${t}`);
      }
      const data = await res.json().catch(() => ({}));
      return { ok: true as const, jobId, data };
    }),
});

// To merge, add to server/trpc/router.ts:
//   import { embeddingsRouter } from "./embeddings.router"; // hygen:routers-import
//   export const appRouter = createTRPCRouter({
//     health: healthRouter,
//     embeddings: embeddingsRouter,                       // hygen:routers-merge
//   });
