// path: nodes/next.app.router.ts
/**
 * NODE: next.app.router
 * Phase: execute
 *
 * Purpose:
 *  - Provide root layout wrapping <Providers/> and a protected home page.
 *  - DO NOT emit middleware.ts (owned by auth.setup).
 *
 * Outputs:
 *  - artifacts/${orc}/repo/app/layout.tsx
 *  - artifacts/${orc}/repo/app/(protected)/home/page.tsx
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

export const NextAppRouterNode: NodeSpec<unknown, { files: string[] }> = {
  id: "next.app.router",
  phase: "execute",
  estimate: () => ({ tokens: 280, usd: 0.001 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo/app`;

    const layout = lf(`// path: app/layout.tsx
import "./globals.css";
import * as React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "App",
  description: "LESiAB MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`);

    const home = lf(`// path: app/(protected)/home/page.tsx
"use client";

import * as React from "react";
import { api } from "../../../lib/trpc";

export default function HomePage() {
  const { data } = api.health.ping.useQuery();
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Protected Home</h1>
      <p className="text-sm text-neutral-600">tRPC health: {data ?? "…"}</p>
    </div>
  );
}
`);

    const files = [
      { path: `${root}/layout.tsx`, content: layout },
      { path: `${root}/(protected)/home/page.tsx`, content: home },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "next.app.router:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });
    return { files: files.map((f) => f.path) };
  },
};

export default NextAppRouterNode;
