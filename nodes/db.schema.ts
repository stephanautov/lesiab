// path: nodes/db.schema.ts
import { z } from "zod";

/**
 * NODE: db.schema
 * Phase: execute
 *
 * Purpose:
 *  - Generate an initial SQL migration from a canonical profile (entities → tables).
 *  - Enable pgcrypto (for gen_random_uuid) and pgvector (for embeddings).
 *  - If no entities are provided, still emit a valid migration (extensions only).
 *
 * Inputs (optional):
 *  - { profile?: { id: string; version?: string; entities?: Array<{ name, table, fields, vectorSearch? }> } }
 *    If absent, defaults to an empty profile and writes a minimal migration.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/supabase/migrations/0001_init.sql
 *
 * Notes:
 *  - RLS policies are emitted by a later node (sa.rls).
 *  - Keep the SQL deterministic. No timestamps inside file content.
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

// Minimal local Profile schema (kept in sync with profile.normalize outputs)
const FieldSchema = z.object({
  name: z.string().min(1),
  dbType: z.enum(["text", "int", "uuid", "json", "timestamp", "vector"]).default("text"),
  required: z.boolean().default(false),
  pk: z.boolean().optional(),
  fk: z.string().optional(), // "other_table.other_col"
});
const EntitySchema = z.object({
  name: z.string().min(1),
  table: z.string().min(1),
  fields: z.array(FieldSchema).default([]),
  vectorSearch: z.boolean().default(false),
});
const ProfileSchema = z.object({
  id: z.string().min(1).default("app"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).default("1.0.0"),
  entities: z.array(EntitySchema).default([]),
});
type Profile = z.infer<typeof ProfileSchema>;

const InputSchema = z.object({ profile: ProfileSchema.optional() });

const lf = (s: string) => s.replace(/\r\n/g, "\n");
const sqlIdent = (s: string) => s.replace(/[^a-zA-Z0-9_]/g, "_");

function sqlForField(f: z.infer<typeof FieldSchema>): string {
  const col = `"${f.name}"`;
  switch (f.dbType) {
    case "text":
      return `${col} text${f.required ? " not null" : ""}`;
    case "int":
      return `${col} integer${f.required ? " not null" : ""}`;
    case "uuid":
      return `${col} uuid${f.required ? " not null" : ""}`;
    case "json":
      return `${col} jsonb${f.required ? " not null" : ""}`;
    case "timestamp":
      return `${col} timestamptz${f.required ? " not null" : ""}`;
    case "vector":
      // 1536 works for many embedding models; adjust later as needed.
      return `${col} vector(1536)`;
    default:
      return `${col} text`;
  }
}

function genMigration(profile: Profile): string {
  const parts: string[] = [];

  parts.push(`-- LESiAB MVP initial migration`);
  parts.push(`-- Generated deterministically from profile`);
  parts.push(``);
  parts.push(`-- Required extensions`);
  parts.push(`create extension if not exists pgcrypto;`);
  parts.push(`create extension if not exists vector;`);
  parts.push(``);

  if (profile.entities.length === 0) {
    parts.push(`-- No entities defined; tables can be added in subsequent runs.`);
    return parts.join("\n") + "\n";
  }

  for (const ent of profile.entities) {
    const table = sqlIdent(ent.table);
    const cols: string[] = [];
    // Default id + timestamps
    cols.push(`"id" uuid primary key default gen_random_uuid()`);
    for (const f of ent.fields) {
      if (f.name === "id") continue; // avoid duplication
      cols.push(sqlForField(f));
    }
    cols.push(`"created_at" timestamptz not null default now()`);
    cols.push(`"updated_at" timestamptz not null default now()`);

    parts.push(`-- Table for entity: ${ent.name}`);
    parts.push(`create table if not exists "${table}" (`);
    parts.push(`  ${cols.join(",\n  ")}`);
    parts.push(`);`);
    parts.push(``);

    // Foreign keys
    for (const f of ent.fields) {
      if (!f.fk) continue;
      const [refTableRaw, refColRaw] = f.fk.split(".");
      if (!refTableRaw || !refColRaw) continue;
      const refTable = sqlIdent(refTableRaw);
      const refCol = sqlIdent(refColRaw);
      parts.push(
        `alter table "${table}" add constraint "${table}_${f.name}_fkey" foreign key ("${f.name}") references "${refTable}"("${refCol}") on delete set null;`
      );
    }
    parts.push(``);

    // Useful indexes
    parts.push(`create index if not exists "${table}_updated_at_idx" on "${table}" ("updated_at");`);
    if (ent.vectorSearch) {
      // IVF Flat or HNSW indexes can be added later; for MVP, leave without index.
      parts.push(`-- Vector column present; consider adding IVF/HNSW index post-MVP if needed.`);
    }
    parts.push(``);
  }

  return parts.join("\n") + "\n";
}

export const DbSchemaNode: NodeSpec<
  { profile?: Profile } | unknown,
  { files: string[] }
> = {
  id: "db.schema",
  phase: "execute",
  estimate: () => ({ tokens: 800, usd: 0.003 }),
  async run(input, ctx) {
    const parsed = InputSchema.safeParse(input);
    const profile = ProfileSchema.parse(parsed.success ? parsed.data.profile ?? {} : {});
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const migration = lf(genMigration(profile));
    const path = `${root}/supabase/migrations/0001_init.sql`;

    await ctx.storage.saveArtifact(path, migration);
    ctx.logger.info({
      msg: "db.schema:written",
      file: path,
      entities: profile.entities.length,
      correlationId: ctx.correlationId,
    });

    return { files: [path] };
  },
};

export default DbSchemaNode;
