// path: nodes/ai.embedder.ts
/**
 * NODE: ai.embedder
 * Phase: execute
 *
 * Purpose:
 *  - Provide a tRPC router with an 'enqueue' mutation to request embeddings work.
 *  - Provide an Edge Function that chunks text, calls embeddings, and upserts into pgvector.
 *  - Publish a realtime broadcast when done.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/server/trpc/embeddings.router.ts
 *  - artifacts/${orc}/repo/supabase/functions/embeddings/index.ts   (extends/overwrites MVP stub)
 *
 * Assumptions:
 *  - pgvector extension is enabled (done in db.schema).
 *  - A target table exists (default: 'embeddings_index') with:
 *      id uuid primary key, content text, embedding vector(1536)
 *    If the table is absent, the Edge Function will return { ok: false, error }.
 *
 * Notes:
 *  - Provider selection via Deno.env.get("EMBED_PROVIDER") in the Edge Function:
 *      "openai" (default) or "anthropic" (falls back to OpenAI with a comment).
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: {
    saveArtifact: (path: string, content: string | Uint8Array) => Promise<void>;
  };
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

const ROUTER_TS = lf(`// path: server/trpc/embeddings.router.ts
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
    .input(z.object({
      text: z.string().min(1),
      table: z.string().min(1).default("embeddings_index"),
      id: z.string().uuid().optional(),         // optional record id to upsert
      vectorColumn: z.string().min(1).default("embedding"),
      contentColumn: z.string().min(1).default("content")
    }))
    .mutation(async ({ input }) => {
      const jobId = input.id ?? stableId(input.text);
      const url = new URL("/functions/v1/embeddings", process.env.SUPABASE_URL!);
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": \`Bearer \${process.env.SUPABASE_SERVICE_ROLE!}\`
        },
        body: JSON.stringify({
          jobId,
          text: input.text,
          table: input.table,
          vectorColumn: input.vectorColumn,
          contentColumn: input.contentColumn
        })
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(\`embeddings enqueue failed (\${res.status}): \${t}\`);
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
`);

const EDGE_TS = lf(`// path: supabase/functions/embeddings/index.ts
// Deno Edge Function: embeddings
// Splits text, calls provider embeddings, upserts into pgvector, and broadcasts completion.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = {
  jobId: string;
  text: string;
  table: string;          // target table (must exist)
  vectorColumn: string;   // e.g., "embedding"
  contentColumn: string;  // e.g., "content"
};

function chunk(text: string, size = 1000): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

async function embedOpenAI(texts: string[], apiKey: string): Promise<number[][]> {
  const model = Deno.env.get("OPENAI_EMBEDDINGS_MODEL") || "text-embedding-3-small";
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "content-type": "application/json", "authorization": \`Bearer \${apiKey}\` },
    body: JSON.stringify({ model, input: texts })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(\`OpenAI embeddings failed (\${res.status}): \${t}\`);
  }
  const json = await res.json();
  const vectors: number[][] = (json.data || []).map((d: any) => d.embedding as number[]);
  return vectors;
}

async function embedAnthropic(texts: string[], apiKey: string): Promise<number[][]> {
  // Anthropic doesn't currently offer an embeddings endpoint; fallback to OpenAI
  return embedOpenAI(texts, apiKey);
}

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
  const supa = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  const { jobId, text, table, vectorColumn, contentColumn } = (await req.json().catch(() => ({}))) as Partial<Payload>;
  if (!jobId || !text || !table || !vectorColumn || !contentColumn) {
    return new Response(JSON.stringify({ ok: false, error: "missing fields" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const parts = chunk(text, 1000);
  const provider = (Deno.env.get("EMBED_PROVIDER") || "openai").toLowerCase();
  const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY") || "";

  let vectors: number[][];
  if (provider === "anthropic") {
    vectors = await embedAnthropic(parts, anthropicKey || openaiKey);
  } else {
    vectors = await embedOpenAI(parts, openaiKey);
  }

  // For MVP: average chunk vectors to produce a single vector per text
  const dim = vectors[0]?.length ?? 0;
  const acc = new Array(dim).fill(0);
  for (const v of vectors) for (let i = 0; i < dim; i++) acc[i] += v[i];
  const mean = acc.map((x) => x / (vectors.length || 1));

  // Upsert into the provided table (expects vectorColumn and contentColumn)
  const { error } = await supa.from(table).upsert([{ id: jobId, [contentColumn]: text, [vectorColumn]: mean }], { onConflict: "id" });
  const ok = !error;

  // Broadcast completion
  try {
    const ch = supa.channel("lesiab:embeddings");
    await ch.send({ type: "broadcast", event: "done", payload: { jobId, ok } });
    try { await ch.unsubscribe(); } catch {}
  } catch {}

  const body = ok ? { ok: true, jobId } : { ok: false, error: String(error?.message || "upsert failed"), jobId };
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
});
`);

export const AiEmbedderNode: NodeSpec<unknown, { files: string[] }> = {
  id: "ai.embedder",
  phase: "execute",
  estimate: () => ({ tokens: 1100, usd: 0.0045 }),
  async run(_input, ctx) {
    const base = `artifacts/${ctx.orchestrationId}/repo`;
    const routerPath = `${base}/server/trpc/embeddings.router.ts`;
    const edgePath = `${base}/supabase/functions/embeddings/index.ts`;
    await ctx.storage.saveArtifact(routerPath, ROUTER_TS);
    await ctx.storage.saveArtifact(edgePath, EDGE_TS);
    ctx.logger.info({
      msg: "ai.embedder:written",
      files: [routerPath, edgePath],
      correlationId: ctx.correlationId,
    });
    return { files: [routerPath, edgePath] };
  },
};

export default AiEmbedderNode;
