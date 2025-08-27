// path: nodes/github.setup.ts
/**
 * NODE: github.setup
 * Phase: finalize
 *
 * Purpose:
 *  - Author a clear README with local dev & deploy steps.
 *  - Add CI workflow that runs `pnpm lint:types` and `pnpm format --check`.
 *  - Provide a concise PR template.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/README.md
 *  - artifacts/${orc}/repo/.github/workflows/ci.yml
 *  - artifacts/${orc}/repo/.github/pull_request_template.md
 *
 * Notes:
 *  - Deterministic, no timestamps. No environment probing.
 *  - CI avoids `next build` to keep bootstrap friction low.
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

export const GithubSetupNode: NodeSpec<unknown, { files: string[] }> = {
  id: "github.setup",
  phase: "finalize",
  estimate: () => ({ tokens: 600, usd: 0.0025 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const readme = lf(`# LESiAB — MVP (Vercel + Supabase + tRPC)

Deterministic scaffold for an MVP that generates deployable codebases via a three-layer orchestration stack.

## Stack
- **Next.js (App Router) + TypeScript**
- **tRPC** (server procedures), **TanStack Query** (client cache)
- **Supabase**: Postgres, Auth, Storage, Realtime, Edge Functions, pgvector
- **Vercel**: hosting & analytics
- **OpenAI / Anthropic** helpers (opt-in)
- Minimal **shadcn-style** UI primitives + RHF form wrappers

## Repo Layout (key paths)
- \`app/\` — Next.js app routes (App Router)
- \`server/trpc/\` — tRPC server primitives, context, routers
- \`lib/\` — shared client/server utilities
- \`supabase/\` — migrations, config
- \`edge-functions/\` — Deno functions (cron, queue, embeddings, file-processor)
- \`scripts/\` — dev runner, materializer, tooling

## Prerequisites
- Node.js \\>= 18.18
- pnpm (recommended)
- Supabase CLI (for local DB, migrations and functions)
- Vercel account (for deploy + analytics)

## Environment
Copy \`.env.example\` to \`.env\` and fill values:

\`\`\`
# Server
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=

# Client
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_NAME=App
\`\`\`

> Env validation is handled by \`env.mjs\` (owned by \`env.schema\` node).

## First-time bootstrap (artifacts → working tree)
1. Generate artifacts with the **Dev Runner**:
   \`\`\`bash
   npx ts-node scripts/dev-run.ts
   \`\`\`
2. (Optional) Materialize into the repo root:
   \`\`\`bash
   npx ts-node scripts/materialize-artifacts.ts
   \`\`\`
   Re-run with \`--force\` to overwrite regenerated files.

## Local development
\`\`\`bash
pnpm install
pnpm format
pnpm lint:types
pnpm dev
\`\`\`

### Supabase (local)
\`\`\`bash
supabase start
supabase db reset
\`\`\`

### Edge Functions (local deploy/test)
\`\`\`bash
supabase functions deploy cron
supabase functions deploy queue
supabase functions deploy embeddings
supabase functions deploy file-processor
\`\`\`

## Routing & auth
- Protected pages live under \`app/(protected)/**\`.
- Middleware gates access by checking the \`sb-access-token\` cookie.
- Server routes verify tokens via Supabase service client in tRPC context.

## tRPC wiring
- Base router: \`server/trpc/router.ts\`.
- Add feature routers and merge under the marked Hygen anchors:
  - \`// hygen:routers-import\`
  - \`// hygen:routers-merge\`

## Uploads
- Private bucket: \`user-uploads\` with owner policies.
- Presigned upload flow: tRPC mutation → client PUT to signed URL.

## Embeddings (optional)
- Edge Function: \`edge-functions/embeddings\` (averages chunk vectors).
- Requires a table (default \`embeddings_index\`) with:
  \`id uuid primary key, content text, embedding vector(1536)\`.
  Create via a migration before using.

## CI
See \`.github/workflows/ci.yml\`. Checks:
- \`pnpm lint:types\`
- \`pnpm format --check\`

## Deployment
See **DEPLOY.md** for step-by-step Vercel + Supabase deploy instructions.

## Determinism & Ownership
- Deterministic content only; idempotent regeneration is expected.
- Files owned by other nodes are not overwritten; patches are emitted in \`_patches/\`.
`);

    const ci = lf(`name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
          run_install: false

      - name: Install deps
        run: pnpm install --no-frozen-lockfile

      - name: Type check
        run: pnpm lint:types

      - name: Prettier check
        run: pnpm format --check
`);

    const pr = lf(`## Summary
Explain the change in 1–3 sentences.

## Checklist
- [ ] CI passes (types + format)
- [ ] No files owned by other nodes were overwritten
- [ ] Deterministic content (no timestamps/randomness)
- [ ] Updated docs if behavior changed (README / DEPLOY.md)

## Screenshots (optional)
Attach before/after if UI changes apply.
`);

    const files = [
      { path: `${root}/README.md`, content: readme },
      { path: `${root}/.github/workflows/ci.yml`, content: ci },
      { path: `${root}/.github/pull_request_template.md`, content: pr },
    ];

    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "github.setup:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });

    return { files: files.map((f) => f.path) };
  },
};

export default GithubSetupNode;
