// path: nodes/cron.queue.setup.ts
/**
 * NODE: cron.queue.setup
 * Phase: execute
 *
 * Purpose:
 *  - Scaffold a Cron function and a Queue intake function.
 *  - Provide a server helper to enqueue jobs via Supabase Functions REST.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/supabase/functions/cron/index.ts
 *  - artifacts/${orc}/repo/supabase/functions/queue/index.ts
 *  - artifacts/${orc}/repo/lib/queue.ts
 *
 * Notes:
 *  - This MVP version stores no DB state; it simply logs payloads.
 *  - You can wire DB-backed job tables later if needed.
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: { saveArtifact: (path: string, content: string | Uint8Array) => Promise<void> };
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

export const CronQueueSetupNode: NodeSpec<unknown, { files: string[] }> = {
  id: "cron.queue.setup",
  phase: "execute",
  estimate: () => ({ tokens: 360, usd: 0.0015 }),
  async run(_input, ctx) {
    const rootEf = `artifacts/${ctx.orchestrationId}/repo/supabase/functions`;
    const rootLib = `artifacts/${ctx.orchestrationId}/repo/lib`;

    const cron = lf(`// path: supabase/functions/cron/index.ts
// Deno Edge Function for scheduled tasks.
// Configure schedule in Supabase dashboard -> Edge Functions -> Schedule.
Deno.serve(async (_req) => {
  const now = new Date().toISOString();
  const body = JSON.stringify({ ok: true, ranAt: now });
  return new Response(body, { headers: { "content-type": "application/json" } });
});
`);

    const queue = lf(`// path: supabase/functions/queue/index.ts
// Deno Edge Function to accept enqueued jobs.
// Expects JSON: { jobName: string, payload: unknown, delaySeconds?: number }
Deno.serve(async (req) => {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ ok: false, error: "missing bearer auth" }), { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { jobName, payload, delaySeconds = 0 } = body ?? {};
  const result = { ok: true, received: { jobName, delaySeconds, payload } };
  return new Response(JSON.stringify(result), { headers: { "content-type": "application/json" } });
});
`);

    const helper = lf(`// path: lib/queue.ts
// Server helper to enqueue a job via Supabase Functions REST.
import { env } from "../env.mjs";

export type EnqueueOptions = { delaySeconds?: number };

export async function enqueue(jobName: string, payload: unknown, opts: EnqueueOptions = {}) {
  const url = new URL("/functions/v1/queue", env.SUPABASE_URL).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": \`Bearer \${env.SUPABASE_SERVICE_ROLE}\`
    },
    body: JSON.stringify({ jobName, payload, delaySeconds: opts.delaySeconds ?? 0 })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(\`enqueue failed (\${res.status}): \${text}\`);
  }
  return (await res.json().catch(() => ({}))) as unknown;
}
`);

    const files = [
      { path: `${rootEf}/cron/index.ts`, content: cron },
      { path: `${rootEf}/queue/index.ts`, content: queue },
      { path: `${rootLib}/queue.ts`, content: helper },
    ];

    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }

    ctx.logger.info({
      msg: "cron.queue.setup:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });

    return { files: files.map((f) => f.path) };
  },
};

export default CronQueueSetupNode;
