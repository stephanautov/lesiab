// path: nodes/rest.public.ts
/**
 * NODE: rest.public
 * Phase: execute
 *
 * Purpose:
 *  - Provide an example Edge-cached public REST endpoint (health).
 *  - Public endpoints are suitable for CDN caching; keep logic stateless.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/app/api/public/health/route.ts
 *
 * Notes:
 *  - Uses Next.js App Router route conventions. Revalidates every 60s.
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

export const RestPublicNode: NodeSpec<unknown, { files: string[] }> = {
  id: "rest.public",
  phase: "execute",
  estimate: () => ({ tokens: 180, usd: 0.001 }),
  async run(_input, ctx) {
    const path = `artifacts/${ctx.orchestrationId}/repo/app/api/public/health/route.ts`;

    const route = lf(`// path: app/api/public/health/route.ts
export const runtime = "edge";
export const revalidate = 60;

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" }
  });
}
`);

    await ctx.storage.saveArtifact(path, route);

    ctx.logger.info({
      msg: "rest.public:written",
      files: [path],
      correlationId: ctx.correlationId,
    });

    return { files: [path] };
  },
};

export default RestPublicNode;
