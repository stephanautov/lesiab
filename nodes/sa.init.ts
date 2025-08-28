// path: nodes/sa.init.ts
/**
 * NODE: sa.init
 * Phase: execute
 *
 * Purpose:
 *  - Provide a minimal Supabase config and a helper script for local dev/migrations.
 *  - Deterministically write:
 *      - supabase/config.toml (placeholder; safe to replace with `supabase init` later)
 *      - scripts/sa-init.ts (env sanity checks + CLI instructions)
 *
 * Outputs:
 *  - artifacts/${orc}/repo/supabase/config.toml
 *  - artifacts/${orc}/repo/scripts/sa-init.ts
 *
 * Notes:
 *  - Does NOT require network access or actual Supabase project refs.
 *  - Keeps content generic to avoid leaking environment data into the repo.
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

export const SaInitNode: NodeSpec<unknown, { files: string[] }> = {
  id: "sa.init",
  phase: "execute",
  estimate: () => ({ tokens: 240, usd: 0.001 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;
    const cfgPath = `${root}/supabase/config.toml`;
    const scriptPath = `${root}/scripts/sa-init.ts`;

    // Minimal, deterministic Supabase config (safe placeholder for MVP)
    // Developers may run `supabase init` later to replace with a project-specific config.
    const configToml =
      lf(`# supabase/config.toml — minimal, schema-correct, deterministic

project_id = "lesiab"

[api]
# Next two are the CLI defaults; keep them explicit for clarity:
port = 54321
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

# Optional local mail UI; these are the CLI defaults:
[inbucket]
enabled = true
port = 54324
smtp_port = 54325
pop3_port = 54326
admin_email = "admin@email.com"
sender_name = "Admin"

# Map our non-default function locations under edge-functions/
[functions.cron]
entrypoint = "edge-functions/cron/index.ts"

[functions.queue]
entrypoint = "edge-functions/queue/index.ts"

[functions.embeddings]
entrypoint = "edge-functions/embeddings/index.ts"

[functions.file-processor]
entrypoint = "edge-functions/file-processor/index.ts"
`);

    // A small helper script to sanity-check env and print CLI steps
    const saInitTs = lf(`/* eslint-disable no-console */
/**
 * scripts/sa-init.ts
 *
 * Purpose:
 *  - Quick sanity checks for required env vars.
 *  - Print a concise set of Supabase CLI instructions for local dev and migrations.
 *
 * Usage:
 *  - Run with ts-node or compile first. Example:
 *      npx ts-node scripts/sa-init.ts
 */

type Check = { name: string; present: boolean; value?: string };

const REQUIRED_SERVER = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY"
] as const;

const REQUIRED_CLIENT = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_NAME"
] as const;

function checkEnv(names: readonly string[]): Check[] {
  return names.map((n) => ({
    name: n,
    present: typeof process.env[n] === "string" && process.env[n]!.trim().length > 0,
    value: process.env[n]
  }));
}

function printChecks(title: string, checks: Check[]) {
  console.log("\\n" + title);
  checks.forEach((c) => {
    const mark = c.present ? "✓" : "✖";
    const note = c.present ? "" : "  (set this in your .env)";
    console.log(\`  \${mark} \${c.name}\${note}\`);
  });
}

function printCliGuide() {
  console.log("\\nSupabase CLI quick guide (local dev):");
  console.log("  1) Install CLI: https://supabase.com/docs/guides/cli");
  console.log("  2) Login:        supabase login");
  console.log("  3) (Optional) Initialize/regen config: supabase init   # Will write supabase/config.toml");
  console.log("  4) Start local:  supabase start");
  console.log("  5) Apply local migrations: supabase db reset");
  console.log("\\nLinking a remote project & pushing migrations:");
  console.log("  a) supabase link --project-ref <YOUR_PROJECT_REF>");
  console.log("  b) supabase db push");
  console.log("\\nDeploying Edge Functions:");
  console.log("  supabase functions deploy <name>");
  console.log("\\nTips:");
  console.log("  - Keep '.env' and '.env.example' in sync.");
  console.log("  - Vercel: set server & NEXT_PUBLIC_* env vars in project settings.");
}

async function main() {
  console.log("Env sanity checks:");

  const server = checkEnv(REQUIRED_SERVER);
  const client = checkEnv(REQUIRED_CLIENT);

  printChecks("Server env (required):", server);
  printChecks("Client env (required):", client);

  const missing = [...server, ...client].filter((c) => !c.present);
  if (missing.length > 0) {
    console.log("\\nSome env vars are missing. Copy .env.example to .env and fill the blanks.");
  } else {
    console.log("\\nAll required env vars appear to be set. Good to go!");
  }

  printCliGuide();
}

main().catch((err) => {
  console.error("sa-init failed:", err);
  process.exit(1);
});
`);

    const files = [
      { path: cfgPath, content: configToml },
      { path: scriptPath, content: saInitTs },
    ];

    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }

    ctx.logger.info({
      msg: "sa.init:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });

    return { files: files.map((f) => f.path) };
  },
};

export default SaInitNode;
