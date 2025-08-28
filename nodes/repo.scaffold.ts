// path: nodes/repo.scaffold.ts
import { z } from "zod";

/**
 * NODE: repo.scaffold
 * Phase: plan -> execute
 *
 * Purpose:
 *  - Create a deterministic Next.js (App Router) + TypeScript repo skeleton.
 *  - Write files under artifacts/${orc}/repo/... so the Engine can package/zip.
 *  - No environment-conditional behavior; no vercel.json here (owned by vercel.config).
 *
 * Input contract:
 *  - { profile?: { id: string; version?: string } }
 *    If absent or invalid, defaults to { id: "app", version: "1.0.0" }.
 *
 * Engine contract:
 *  - ctx.storage.saveArtifact(path, content) persists artifacts.
 *  - ctx.logger for structured logs.
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

// Minimal profile shape (keep local to avoid cross-node import coupling)
const ProfileSchema = z.object({
  id: z.string().min(1).default("app"),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .default("1.0.0"),
});
type Profile = z.infer<typeof ProfileSchema>;

const InputSchema = z.object({
  profile: ProfileSchema.optional(),
});

function json(content: unknown) {
  return JSON.stringify(content, null, 2) + "\n";
}

function file(path: string, content: string) {
  return { path, content: normalizeLf(content) };
}

function normalizeLf(s: string) {
  // Ensure deterministic LF endings
  return s.replace(/\r\n/g, "\n");
}

export const RepoScaffoldNode: NodeSpec<
  unknown,
  { root: string; files: Array<{ path: string }> }
> = {
  id: "repo.scaffold",
  phase: "plan",
  estimate: () => ({ tokens: 500, usd: 0.002 }),
  async run(input, ctx) {
    ctx.logger.info({
      msg: "repo.scaffold:start",
      correlationId: ctx.correlationId,
    });

    const parsed = InputSchema.safeParse(input);
    const profile: Profile = ProfileSchema.parse(
      parsed.success ? parsed.data.profile : {},
    );

    const root = `artifacts/${ctx.orchestrationId}/repo`;

    // --- File contents (deterministic) ---
    const pkg = {
      name: profile.id,
      version: profile.version,
      private: true,
      scripts: {
        "codegen:crud": "hygen crud new",
        format: "prettier --write .",
        "lint:types": "tsc -p tsconfig.json --noEmit",
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      engines: { node: ">=18.18.0" },
    };

    const tsconfig = {
      compilerOptions: {
        target: "ES2022",
        lib: ["DOM", "DOM.Iterable", "ES2022"],
        module: "ESNext",
        moduleResolution: "Bundler",
        allowJs: false,
        checkJs: false,
        noEmit: true,
        resolveJsonModule: true,
        isolatedModules: true,
        strict: true,
        noUncheckedIndexedAccess: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        jsx: "react-jsx",
        baseUrl: ".",
        paths: {},
      },
      include: ["**/*.ts", "**/*.tsx"],
      exclude: ["node_modules", ".next", "dist", "out"],
    };

    const eslint = `/** Minimal ESLint config; other nodes may extend but should not overwrite. */
module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  env: { es2022: true, node: true, browser: true },
  extends: [],
  rules: {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "no-console": "off"
  },
  ignorePatterns: ["node_modules/", ".next/", "dist/", "out/", "artifacts/"]
};
`;

    const prettier = json({
      printWidth: 100,
      singleQuote: false,
      semi: true,
      trailingComma: "es5",
      arrowParens: "always",
      tabWidth: 2,
    });

    const gitignore = `# Dependencies
/node_modules

# Builds
/.next
/out
/dist

# Env
.env
.env.local
.env.*.local

# Artifacts & logs
/artifacts
*.log
npm-debug.log*
pnpm-debug.log*
yarn-error.log*

# Misc
.DS_Store
`;

    const postinstall = `#!/usr/bin/env bash
# Deterministic postinstall placeholder for LESiAB MVP scaffold.
set -euo pipefail
echo "Postinstall: nothing to do yet. (LESiAB scaffold)"
`;

    // Directory placeholders (gitkeep files)
    const dirs = [
      "app/.gitkeep",
      "server/trpc/.gitkeep",
      "components/.gitkeep",
      "lib/.gitkeep",
      "supabase/.gitkeep",
      "edge-functions/.gitkeep",
      "scripts/.gitkeep",
    ];

    const files = [
      file(`${root}/scripts/postinstall.sh`, postinstall),
      file(`${root}/package.json`, json(pkg)),
      file(`${root}/tsconfig.json`, json(tsconfig)),
      file(`${root}/.eslintrc.cjs`, eslint),
      file(`${root}/.prettier`, prettier),
      file(`${root}/.gitignore`, gitignore),
      ...dirs.map((p) => file(`${root}/${p}`, "")),
    ];

    // Persist
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }

    ctx.logger.info({
      msg: "repo.scaffold:written",
      count: files.length,
      correlationId: ctx.correlationId,
      root,
    });

    return { root, files: files.map(({ path }) => ({ path })) };
  },
};

export default RepoScaffoldNode;
