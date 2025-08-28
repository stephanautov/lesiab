// path: nodes/env.schema.ts
import { z } from "zod";

/**
 * NODE: env.schema
 * Phase: validate -> execute
 *
 * Purpose:
 *  - Emit env validation and examples for the repo.
 *  - Sole owner of env.mjs and .env.example.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/env.mjs
 *  - artifacts/${orc}/repo/.env.example
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

function normalizeLf(s: string) {
  return s.replace(/\r\n/g, "\n");
}

export const EnvSchemaNode: NodeSpec<unknown, { files: string[] }> = {
  id: "env.schema",
  phase: "validate",
  estimate: () => ({ tokens: 250, usd: 0.001 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const envMjs = normalizeLf(`import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE: z.string().min(1)
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default('App')
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME
  }
});
`);

    const envExample = normalizeLf(`# Server
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=

# Client
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_NAME=App
`);

    const files = [
      { path: `${root}/env.mjs`, content: envMjs },
      { path: `${root}/.env.example`, content: envExample },
    ];

    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "env.schema:written",
      files: files.map((f) => f.path),
    });
    return { files: files.map((f) => f.path) };
  },
};

export default EnvSchemaNode;
