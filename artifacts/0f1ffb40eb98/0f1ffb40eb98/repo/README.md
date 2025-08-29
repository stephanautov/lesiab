# LESiAB — MVP (Vercel + Supabase + tRPC)

Deterministic scaffold for an MVP that generates deployable codebases via a three-layer orchestration stack.

## Stack

- **Next.js (App Router) + TypeScript**
- **tRPC** (server procedures), **TanStack Query** (client cache)
- **Supabase**: Postgres, Auth, Storage, Realtime, Edge Functions, pgvector
- **Vercel**: hosting & analytics
- **OpenAI / Anthropic** helpers (opt-in)
- Minimal **shadcn-style** UI primitives + RHF form wrappers

## Repo Layout (key paths)

- `app/` — Next.js app routes (App Router)
- `server/trpc/` — tRPC server primitives, context, routers
- `lib/` — shared client/server utilities
- `supabase/` — migrations, config
- `edge-functions/` — Deno functions (cron, queue, embeddings, file-processor)
- `scripts/` — dev runner, materializer, tooling

## Prerequisites

- Node.js \>= 18.18
- pnpm (recommended)
- Supabase CLI (for local DB, migrations and functions)
- Vercel account (for deploy + analytics)

## Environment

Copy `.env.example` to `.env` and fill values:

```
# Server
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=

# Client
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_NAME=App
```

> Env validation is handled by `env.mjs` (owned by `env.schema` node).

## First-time bootstrap (artifacts → working tree)

1. Generate artifacts with the **Dev Runner**:
   ```bash
   npx ts-node scripts/dev-run.ts
   ```
2. (Optional) Materialize into the repo root:
   ```bash
   npx ts-node scripts/materialize-artifacts.ts
   ```
   Re-run with `--force` to overwrite regenerated files.

## Local development

```bash
pnpm install
pnpm format
pnpm lint:types
pnpm dev
```

### Supabase (local)

```bash
supabase start
supabase db reset
```

### Edge Functions (local deploy/test)

```bash
supabase functions deploy cron
supabase functions deploy queue
supabase functions deploy embeddings
supabase functions deploy file-processor
```

## Routing & auth

- Protected pages live under `app/(protected)/**`.
- Middleware gates access by checking the `sb-access-token` cookie.
- Server routes verify tokens via Supabase service client in tRPC context.

## tRPC wiring

- Base router: `server/trpc/router.ts`.
- Add feature routers and merge under the marked Hygen anchors:
  - `// hygen:routers-import`
  - `// hygen:routers-merge`

## Uploads

- Private bucket: `user-uploads` with owner policies.
- Presigned upload flow: tRPC mutation → client PUT to signed URL.

## Embeddings (optional)

- Edge Function: `edge-functions/embeddings` (averages chunk vectors).
- Requires a table (default `embeddings_index`) with:
  `id uuid primary key, content text, embedding vector(1536)`.
  Create via a migration before using.

## CI

See `.github/workflows/ci.yml`. Checks:

- `pnpm lint:types`
- `pnpm format --check`

## Deployment

See **DEPLOY.md** for step-by-step Vercel + Supabase deploy instructions.

## Determinism & Ownership

- Deterministic content only; idempotent regeneration is expected.
- Files owned by other nodes are not overwritten; patches are emitted in `_patches/`.
