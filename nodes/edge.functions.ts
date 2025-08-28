// path: nodes/edge.functions.ts
/**
 * NODE: edge.functions
 * Phase: execute
 *
 * Purpose:
 *  - Provide two MVP edge functions: embeddings and file-processor.
 *  - Broadcast a completion event on success.
 *
 * Inputs (optional): none (placeholders; wire specifics later).
 *
 * Outputs:
 *  - artifacts/${orc}/repo/supabase/functions/embeddings/index.ts
 *  - artifacts/${orc}/repo/supabase/functions/file-processor/index.ts
 *
 * Notes:
 *  - These run on Deno. Use ESM imports.
 *  - Access env via Deno.env.get("KEY").
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

export const EdgeFunctionsNode: NodeSpec<unknown, { files: string[] }> = {
  id: "edge.functions",
  phase: "execute",
  estimate: () => ({ tokens: 420, usd: 0.002 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo/supabase/functions`;

    const embeddings = lf(`// path: supabase/functions/embeddings/index.ts
// Deno Edge Function: embeddings (placeholder).
// Expects JSON: { jobId?: string, text?: string }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { jobId, text } = await req.json().catch(() => ({}));
  // TODO: compute embeddings using your provider; for MVP we skip and just ack.
  // Broadcast completion event so clients can refresh.
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
    const supa = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
    const ch = supa.channel("lesiab:embeddings");
    await ch.send({ type: "broadcast", event: "done", payload: { jobId: jobId ?? null, len: (text ?? "").length } });
    try { await ch.unsubscribe(); } catch {}
  } catch {
    // ignore broadcast errors in MVP
  }
  return new Response(JSON.stringify({ ok: true, jobId: jobId ?? null }), {
    headers: { "content-type": "application/json" }
  });
});
`);

    const fileProcessor =
      lf(`// path: supabase/functions/file-processor/index.ts
// Deno Edge Function: file processor (placeholder).
// Expects JSON: { jobId?: string, path?: string }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { jobId, path } = await req.json().catch(() => ({}));
  // TODO: fetch file from Storage and process; for MVP we ack and broadcast only.
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
    const supa = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
    const ch = supa.channel("lesiab:file");
    await ch.send({ type: "broadcast", event: "processed", payload: { jobId: jobId ?? null, path: path ?? null } });
    try { await ch.unsubscribe(); } catch {}
  } catch {
    // ignore broadcast errors in MVP
  }
  return new Response(JSON.stringify({ ok: true, jobId: jobId ?? null }), {
    headers: { "content-type": "application/json" }
  });
});
`);

    const files = [
      { path: `${root}/embeddings/index.ts`, content: embeddings },
      { path: `${root}/file-processor/index.ts`, content: fileProcessor },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }

    ctx.logger.info({
      msg: "edge.functions:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });

    return { files: files.map((f) => f.path) };
  },
};

export default EdgeFunctionsNode;
