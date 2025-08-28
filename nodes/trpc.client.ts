// path: nodes/trpc.client.ts
/**
 * NODE: trpc.client
 * Phase: execute
 *
 * Purpose:
 *  - Create tRPC React client + a <TRPCProvider/> that composes with the existing
 *    QueryClientProvider from app/providers.tsx (owned by client.state.install).
 *  - Provide a tiny patch (unified diff) showing how to wrap <Providers/> children
 *    with <TRPCProvider/> WITHOUT overwriting the file.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/lib/trpc.tsx
 *  - artifacts/${orc}/repo/_patches/app_providers_trpc_injection.diff   (informational, not applied)
 *
 * Notes:
 *  - <TRPCProvider/> obtains the existing QueryClient via useQueryClient() so we do not
 *    create a second cache layer.
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

export const TrpcClientNode: NodeSpec<unknown, { files: string[] }> = {
  id: "trpc.client",
  phase: "execute",
  estimate: () => ({ tokens: 520, usd: 0.002 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const libTrpc = lf(`"use client";
// path: lib/trpc.tsx
import * as React from "react";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "../server/trpc/router";
import { useQueryClient } from "@tanstack/react-query";

export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  // In server contexts, prefer VERCEL_URL if present; fallback to localhost.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  return vercel ? \`https://\${vercel}\` : "http://localhost:3000";
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [client] = React.useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: \`\${getBaseUrl()}/api/trpc\`,
          // Optionally add headers() callback here if you later need auth headers.
        })
      ]
    })
  );
  return <api.Provider client={client} queryClient={queryClient}>{children}</api.Provider>;
}
`);

    const patch = lf(`--- a/app/providers.tsx
+++ b/app/providers.tsx
@@
-"use client";
-import * as React from "react";
-import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
-
-const queryClient = new QueryClient();
-
-export function Providers({ children }: { children: React.ReactNode }) {
-  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
-}
+"use client";
+import * as React from "react";
+import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
+import { TRPCProvider } from "../lib/trpc";
+
+const queryClient = new QueryClient();
+
+export function Providers({ children }: { children: React.ReactNode }) {
+  return (
+    <QueryClientProvider client={queryClient}>
+      <TRPCProvider>{children}</TRPCProvider>
+    </QueryClientProvider>
+  );
+}
`);

    const files = [
      { path: `${root}/lib/trpc.tsx`, content: libTrpc },
      {
        path: `${root}/_patches/app_providers_trpc_injection.diff`,
        content: patch,
      },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "trpc.client:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });
    return { files: files.map((f) => f.path) };
  },
};

export default TrpcClientNode;
