// path: nodes/monitoring.basics.ts
/**
 * NODE: monitoring.basics
 * Phase: integrate
 *
 * Purpose:
 *  - Provide a client-side Vercel Analytics component wrapper.
 *  - Emit a README snippet (append-only) explaining where metrics appear and usage.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/app/analytics.tsx
 *  - artifacts/${orc}/repo/_patches/readme_monitoring_append.md  (informational snippet to append)
 *
 * Notes:
 *  - We do not overwrite README.md; instead we write a snippet to append.
 *  - Consumer can import <AppAnalytics/> in app/layout.tsx (near <Providers/>).
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

export const MonitoringBasicsNode: NodeSpec<unknown, { files: string[] }> = {
  id: "monitoring.basics",
  phase: "integrate",
  estimate: () => ({ tokens: 220, usd: 0.001 }),
  async run(_input, ctx) {
    const base = `artifacts/${ctx.orchestrationId}/repo`;

    const analyticsTsx = lf(`"use client";
// path: app/analytics.tsx
import * as React from "react";
import { Analytics } from "@vercel/analytics/react";

/**
 * Mount this in app/layout.tsx inside <body>, typically after <Providers/>.
 * Example:
 *   <body>
 *     <Providers>{children}</Providers>
 *     <AppAnalytics />
 *   </body>
 */
export function AppAnalytics() {
  return <Analytics />;
}
`);

    const readmeAppend = lf(`# Monitoring & Analytics

This project ships with **Vercel Analytics** enabled via \`vercel.json\` and a small wrapper component at \`app/analytics.tsx\`.

### How to enable on the page
In \`app/layout.tsx\`, render:
\`\`\`tsx
import { AppAnalytics } from "./analytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* your Providers, etc. */}
        {children}
        <AppAnalytics />
      </body>
    </html>
  );
}
\`\`\`

### Where metrics appear
- In your Vercel project dashboard under **Analytics**.
- Basic page views and navigation events are captured automatically.
- No custom events are added in the MVP to keep code deterministic.

### Notes
- Keep analytics logic in client components only.
- Avoid placing analytics in middleware or server actions for latency reasons.
`);

    const files = [
      { path: `${base}/app/analytics.tsx`, content: analyticsTsx },
      { path: `${base}/_patches/readme_monitoring_append.md`, content: readmeAppend },
    ];

    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }

    ctx.logger.info({
      msg: "monitoring.basics:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });

    return { files: files.map((f) => f.path) };
  },
};

export default MonitoringBasicsNode;
