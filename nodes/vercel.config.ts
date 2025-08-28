// path: nodes/vercel.config.ts
/**
 * NODE: vercel.config
 * Phase: integrate
 *
 * Purpose:
 *  - Emit a minimal, deterministic vercel.json with:
 *    * Analytics enabled
 *    * Default region(s)
 *    * Cache headers for public REST endpoints
 *
 * Outputs:
 *  - artifacts/${orc}/repo/vercel.json   (sole owner)
 *
 * Notes:
 *  - Do not include runtime env parsing here (owned by env.schema).
 *  - Keep settings conservative and portable across projects.
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

export const VercelConfigNode: NodeSpec<unknown, { files: string[] }> = {
  id: "vercel.config",
  phase: "integrate",
  estimate: () => ({ tokens: 160, usd: 0.001 }),
  async run(_input, ctx) {
    const path = `artifacts/${ctx.orchestrationId}/repo/vercel.json`;

    // Regions kept generic; iad1 is a common default. Adjust later if needed.
    // Cache public endpoints aggressively but briefly; pages/SSR are left to Next.
    const vercelJson = lf(`{
  "analytics": { "enabled": true },
  "regions": ["iad1"],
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/api/public/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, s-maxage=60, stale-while-revalidate=600" }
      ]
    }
  ]
}
`);

    await ctx.storage.saveArtifact(path, vercelJson);
    ctx.logger.info({
      msg: "vercel.config:written",
      files: [path],
      correlationId: ctx.correlationId,
    });
    return { files: [path] };
  },
};

export default VercelConfigNode;
