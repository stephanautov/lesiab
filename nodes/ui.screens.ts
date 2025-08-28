// path: nodes/ui.screens.ts
/**
 * NODE: ui.screens
 * Phase: codeGeneration
 *
 * Purpose:
 *  - Generate screens for multi-entity flows using tRPC hooks + RHF + shadcn.
 *  - If the profile contains no entities, emit a deterministic placeholder screen.
 *
 * Inputs (optional):
 *  - { profile?: { id: string; entities?: Array<{ name: string }> } }
 *
 * Outputs (examples):
 *  - artifacts/${orc}/repo/app/(protected)/flows/page.tsx
 *  - (If entities exist, additional pages under app/(protected)/* and components/forms/*)
 */

import { z } from "zod";

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

const ProfileSchema = z.object({
  id: z.string().default("app"),
  entities: z.array(z.object({ name: z.string().min(1) })).default([]),
});
type Profile = z.infer<typeof ProfileSchema>;
const InputSchema = z.object({ profile: ProfileSchema.optional() });

export const UiScreensNode: NodeSpec<
  { profile?: Profile } | unknown,
  { files: string[] }
> = {
  id: "ui.screens",
  phase: "codeGeneration",
  estimate: () => ({ tokens: 700, usd: 0.003 }),
  async run(input, ctx) {
    const parsed = InputSchema.safeParse(input);
    const profile: Profile = parsed.success
      ? (parsed.data.profile ?? { id: "app", entities: [] })
      : { id: "app", entities: [] };

    const base = `artifacts/${ctx.orchestrationId}/repo`;
    const outputs: Array<{ path: string; content: string }> = [];

    // Always emit a flows landing page, deterministic content.
    const flowsPage = lf(`// path: app/(protected)/flows/page.tsx
"use client";
import * as React from "react";
import Link from "next/link";

export default function FlowsLanding() {
  const items = ${JSON.stringify(profile.entities.map((e) => ({ name: e.name, href: `/app/(protected)/${e.name}` })))};
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Flows</h1>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-600">No complex flows defined yet.</p>
      ) : (
        <ul className="list-disc pl-5 text-sm">
          {items.map((it) => (
            <li key={it.href}><Link className="underline" href={it.href}>{it.name}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
`);
    outputs.push({
      path: `${base}/app/(protected)/flows/page.tsx`,
      content: flowsPage,
    });

    // If entities exist, emit a simple per-entity page using tRPC hook placeholders.
    for (const ent of profile.entities) {
      const page = lf(`// path: app/(protected)/${ent.name}/page.tsx
"use client";
import * as React from "react";
import { api } from "../../lib/trpc";
import { DataTable } from "../../components/data-table";

export default function ${ent.name[0].toUpperCase() + ent.name.slice(1)}Flow() {
  // Expected to exist after CRUD routers are generated:
  // const { data = [] } = api.${ent.name}.list.useQuery();
  const data: any[] = [];
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">${ent.name} flow</h1>
      <DataTable data={data} />
    </div>
  );
}
`);
      outputs.push({
        path: `${base}/app/(protected)/${ent.name}/page.tsx`,
        content: page,
      });
    }

    for (const f of outputs) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }

    ctx.logger.info({
      msg: "ui.screens:written",
      files: outputs.map((x) => x.path),
      entities: profile.entities.length,
      correlationId: ctx.correlationId,
    });

    return { files: outputs.map((x) => x.path) };
  },
};

export default UiScreensNode;
