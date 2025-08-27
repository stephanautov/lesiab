// path: nodes/client.state.install.ts
/**
 * NODE: client.state.install
 * Phase: execute
 *
 * Purpose:
 *  - Provide the React Query (TanStack) client and a root <Providers/> wrapper.
 *  - Owns app/providers.tsx for the project (tRPC will extend without overwriting).
 *
 * Outputs:
 *  - artifacts/${orc}/repo/app/providers.tsx
 *  - artifacts/${orc}/repo/lib/cache.ts
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

export const ClientStateInstallNode: NodeSpec<unknown, { files: string[] }> = {
  id: "client.state.install",
  phase: "execute",
  estimate: () => ({ tokens: 220, usd: 0.001 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const providers = lf(`"use client";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
`);

    const cache = lf(`/** Tiny in-memory LRU for server utilities if needed (MVP). */
type Key = string;
type Val = unknown;

export function createLRU(capacity = 200) {
  const map = new Map<Key, Val>();
  function get(k: Key) {
    const v = map.get(k);
    if (v !== undefined) {
      map.delete(k); map.set(k, v);
    }
    return v;
  }
  function set(k: Key, v: Val) {
    if (map.has(k)) map.delete(k);
    map.set(k, v);
    if (map.size > capacity) {
      const first = map.keys().next().value;
      map.delete(first);
    }
  }
  function has(k: Key) { return map.has(k); }
  return { get, set, has };
}
`);

    const files = [
      { path: `${root}/app/providers.tsx`, content: providers },
      { path: `${root}/lib/cache.ts`, content: cache },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({ msg: "client.state.install:written", files: files.map((f) => f.path) });
    return { files: files.map((f) => f.path) };
  },
};

export default ClientStateInstallNode;
