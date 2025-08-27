// path: nodes/sa.rls.ts
import { z } from "zod";

/**
 * NODE: sa.rls
 * Phase: execute
 *
 * Purpose:
 *  - Enable RLS and add owner-based policies per entity table.
 *  - Safe when tables/columns are missing (guards with IF EXISTS checks).
 *
 * Inputs (optional):
 *  - { profile?: { entities: Array<{ name, table }> } }
 *
 * Outputs:
 *  - artifacts/${orc}/repo/supabase/migrations/0003_rls.sql
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

const EntitySchema = z.object({
  name: z.string().min(1),
  table: z.string().min(1),
});
const ProfileSchema = z.object({
  entities: z.array(EntitySchema).default([]),
});
type Profile = z.infer<typeof ProfileSchema>;
const InputSchema = z.object({ profile: ProfileSchema.optional() });

const lf = (s: string) => s.replace(/\r\n/g, "\n");
const sqlIdent = (s: string) => s.replace(/[^a-zA-Z0-9_]/g, "_");

function genRlsSql(profile: Profile): string {
  const out: string[] = [];
  out.push(`-- Enable RLS and add owner-based policies where possible`);
  out.push(`-- Guarded with IF EXISTS checks to be idempotent/safe`);
  out.push(``);

  if (profile.entities.length === 0) {
    out.push(`-- No entities provided; nothing to enable.`);
    return out.join("\n") + "\n";
  }

  for (const ent of profile.entities) {
    const table = sqlIdent(ent.table);
    out.push(`-- RLS for ${ent.name} (${table})`);
    out.push(`alter table if exists "${table}" enable row level security;`);
    out.push(``);

    // Policies only if column "owner_id" exists.
    out.push(`do $$`);
    out.push(`begin`);
    out.push(`  if exists (`);
    out.push(`    select 1 from information_schema.columns`);
    out.push(`    where table_schema = 'public' and table_name = '${table}' and column_name = 'owner_id'`);
    out.push(`  ) then`);
    out.push(`    if not exists (`);
    out.push(`      select 1 from pg_policies where schemaname = 'public' and tablename = '${table}' and policyname = '${table}_select_owner'`);
    out.push(`    ) then`);
    out.push(`      create policy "${table}_select_owner" on "${table}"`);
    out.push(`        for select using (owner_id = auth.uid());`);
    out.push(`    end if;`);
    out.push(`    if not exists (`);
    out.push(`      select 1 from pg_policies where schemaname = 'public' and tablename = '${table}' and policyname = '${table}_insert_owner'`);
    out.push(`    ) then`);
    out.push(`      create policy "${table}_insert_owner" on "${table}"`);
    out.push(`        for insert with check (owner_id = auth.uid());`);
    out.push(`    end if;`);
    out.push(`    if not exists (`);
    out.push(`      select 1 from pg_policies where schemaname = 'public' and tablename = '${table}' and policyname = '${table}_update_owner'`);
    out.push(`    ) then`);
    out.push(`      create policy "${table}_update_owner" on "${table}"`);
    out.push(`        for update using (owner_id = auth.uid());`);
    out.push(`    end if;`);
    out.push(`    if not exists (`);
    out.push(`      select 1 from pg_policies where schemaname = 'public' and tablename = '${table}' and policyname = '${table}_delete_owner'`);
    out.push(`    ) then`);
    out.push(`      create policy "${table}_delete_owner" on "${table}"`);
    out.push(`        for delete using (owner_id = auth.uid());`);
    out.push(`    end if;`);
    out.push(`  end if;`);
    out.push(`end`);
    out.push(`$$ language plpgsql;`);
    out.push(``);
  }

  return out.join("\n") + "\n";
}

export const SaRlsNode: NodeSpec<{ profile?: Profile } | unknown, { files: string[] }> = {
  id: "sa.rls",
  phase: "execute",
  estimate: () => ({ tokens: 600, usd: 0.002 }),
  async run(input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;
    const parsed = InputSchema.safeParse(input);
    const profile: Profile = parsed.success ? parsed.data.profile ?? { entities: [] } : { entities: [] };

    const sql = genRlsSql(profile);
    const outPath = `${root}/supabase/migrations/0003_rls.sql`;
    await ctx.storage.saveArtifact(outPath, lf(sql));

    ctx.logger.info({
      msg: "sa.rls:written",
      file: outPath,
      entities: profile.entities.length,
      correlationId: ctx.correlationId,
    });

    return { files: [outPath] };
  },
};

export default SaRlsNode;
