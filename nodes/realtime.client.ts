// path: nodes/realtime.client.ts
/**
 * NODE: realtime.client
 * Phase: execute
 *
 * Purpose:
 *  - Provide a client-side helper to subscribe to Supabase Realtime channels
 *    and update TanStack Query cache keys on messages.
 *  - Update the realtime barrel to export client helpers.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/lib/realtime/client.ts
 *  - artifacts/${orc}/repo/lib/realtime/index.ts   (updated to export client)
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

const CLIENT_TS = lf(`"use client";
// path: lib/realtime/client.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return _client;
}

/**
 * Subscribe to 'lesiab:<entity>' and update a TanStack cache key when an event arrives.
 * updater(old, payload) should return the new cache value.
 */
export function useRealtimeChannel<T>(
  entity: string,
  event: string,
  cacheKey: unknown[],
  updater: (old: T | undefined, payload: any) => T
) {
  const qc = useQueryClient();
  useEffect(() => {
    const supa = getClient();
    const ch = supa.channel(\`lesiab:\${entity}\`).on("broadcast", { event }, (msg) => {
      qc.setQueryData<T>(cacheKey, (old) => updater(old, msg.payload));
    });
    ch.subscribe();
    return () => { ch.unsubscribe(); };
  }, [entity, event, qc, JSON.stringify(cacheKey)]);
}
`);

const INDEX_TS = lf(`// path: lib/realtime/index.ts
export * from "./server";
export * from "./client";
`);

export const RealtimeClientNode: NodeSpec<unknown, { files: string[] }> = {
  id: "realtime.client",
  phase: "execute",
  estimate: () => ({ tokens: 380, usd: 0.0015 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo/lib/realtime`;
    const clientPath = `${root}/client.ts`;
    const indexPath = `${root}/index.ts`;
    await ctx.storage.saveArtifact(clientPath, CLIENT_TS);
    await ctx.storage.saveArtifact(indexPath, INDEX_TS);
    ctx.logger.info({
      msg: "realtime.client:written",
      files: [clientPath, indexPath],
      correlationId: ctx.correlationId,
    });
    return { files: [clientPath, indexPath] };
  },
};

export default RealtimeClientNode;
