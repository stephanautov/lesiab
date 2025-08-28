/* eslint-disable no-console */
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
  console.log("\n" + title);
  checks.forEach((c) => {
    const mark = c.present ? "✓" : "✖";
    const note = c.present ? "" : "  (set this in your .env)";
    console.log(`  ${mark} ${c.name}${note}`);
  });
}

function printCliGuide() {
  console.log("\nSupabase CLI quick guide (local dev):");
  console.log("  1) Install CLI: https://supabase.com/docs/guides/cli");
  console.log("  2) Login:        supabase login");
  console.log("  3) (Optional) Initialize/regen config: supabase init   # Will write supabase/config.toml");
  console.log("  4) Start local:  supabase start");
  console.log("  5) Apply local migrations: supabase db reset");
  console.log("\nLinking a remote project & pushing migrations:");
  console.log("  a) supabase link --project-ref <YOUR_PROJECT_REF>");
  console.log("  b) supabase db push");
  console.log("\nDeploying Edge Functions:");
  console.log("  supabase functions deploy <name>");
  console.log("\nTips:");
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
    console.log("\nSome env vars are missing. Copy .env.example to .env and fill the blanks.");
  } else {
    console.log("\nAll required env vars appear to be set. Good to go!");
  }

  printCliGuide();
}

main().catch((err) => {
  console.error("sa-init failed:", err);
  process.exit(1);
});
