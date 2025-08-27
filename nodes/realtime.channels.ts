// path: nodes/realtime.channels.ts
/**
 * NODE: realtime.channels
 * Phase: execute
 *
 * Purpose:
 *  - Provide server-side realtime helpers to broadcast events.
 *  - Client counterpart is generated later (realtime.client).
 *
 * Outputs:
 *  - artifacts/${orc}/repo/lib/realtime/server.ts
 *  - artifacts/${orc}/repo/lib/realtime/index.ts   (barrel; will export client later)
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

export const RealtimeChannelsNode: NodeSpec<unknown, { files: string[] }> = {
  id: "realtime.channels",
  phase: "execute",
  estimate: () => ({ tokens: 280, usd: 0.001 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo/lib/realtime`;

    const serverTs = lf(`// path: lib/realtime/server.ts
// Server-side broadcast helper using Supabase Realtime channels.
// Requires Realtime 'broadcast' to be enabled in project settings.
import { createClient } from "@supabase/supabase-js";
import { env } from "../../env.mjs";

const supa = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false }
});

/**
 * Publish an event to channel \`lesiab:\${entity}\`.
 * Consumers (clients) can subscribe to this channel and event name.
 */
export async function publish(entity: string, event: string, payload: Record<string, unknown>) {
  const channel = supa.channel(\`lesiab:\${entity}\`);
  const ok = await channel.send({ type: "broadcast", event, payload });
  try { await channel.unsubscribe(); } catch { /* noop */ }
  return ok;
}
`);

    const indexTs = lf(`// path: lib/realtime/index.ts
export * from "./server";
// Client helpers will be added by nodes/realtime.client.ts later.
`);

    const files = [
      { path: `${root}/server.ts`, content: serverTs },
      { path: `${root}/index.ts`, content: indexTs },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "realtime.channels:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });
    return { files: files.map((f) => f.path) };
  },
};

export default RealtimeChannelsNode;
