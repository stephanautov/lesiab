#!/usr/bin/env bash
# scripts/mvp-codegen-installer.sh
# One-file installer: installs deps and drops ready-to-use helpers + Hygen CRUD template pack.
# Usage: bash scripts/mvp-codegen-installer.sh

set -euo pipefail

ROOT_DIR="$(pwd)"

echo "→ Checking package manager (pnpm preferred)…"
if command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
elif command -v npm >/dev/null 2>&1; then
  PM="npm"
else
  echo "✖ Neither pnpm nor npm found. Please install one and re-run."; exit 1
fi

ensure_dir() { mkdir -p "$1"; }
write_file() { local path="$1"; shift; ensure_dir "$(dirname "$path")"; cat >"$path" <<'EOF'
$CONTENT
EOF
}

node_edit_pkg() {
  node - "$@" <<'NODE'
const fs = require('fs');
const path = 'package.json';
if (!fs.existsSync(path)) { console.error('✖ package.json not found. Run in a Node project root.'); process.exit(1); }
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
const args = process.argv.slice(1);
for (let i=0;i<args.length;i+=2){
  const key=args[i]; const val=JSON.parse(args[i+1]);
  const seg=key.split('.');
  let cur=pkg; for(let j=0;j<seg.length-1;j++){ cur[seg[j]] ||= {}; cur=cur[seg[j]]; }
  cur[seg.at(-1)] = { ...(cur[seg.at(-1)]||{}), ...val };
}
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
console.log('✔ package.json updated');
NODE
}

############################################
# 1) Install dependencies
############################################

echo "→ Installing runtime dependencies…"
$PM add zod @t3-oss/env-nextjs @trpc/server @trpc/react-query superjson \
  @tanstack/react-query @tanstack/react-table react-hook-form @hookform/resolvers \
  class-variance-authority tailwind-merge lucide-react shadcn-ui \
  @supabase/supabase-js react-dropzone lru-cache \
  openai @anthropic-ai/sdk ai langgraph langchain @langchain/community

echo "→ Installing dev dependencies…"
$PM add -D hygen prettier eslint vitest @types/node @types/react @types/react-dom

############################################
# 2) package.json scripts & config
############################################

echo "→ Updating package.json scripts…"
node_edit_pkg \
  scripts '{"codegen:crud":"hygen crud new","format":"prettier --write .","lint:types":"tsc -p tsconfig.json --noEmit"}' \
  dependencies '{}' \
  devDependencies '{}'

############################################
# 3) Env validator (server/client separation)
############################################

echo "→ Creating env validators…"
cat > env.mjs <<'TS'
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default('App'),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
TS

cat > .env.example <<'ENV'
# Server
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=

# Client
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_NAME=MyApp
ENV

############################################
# 4) AI helpers (model/parsers/vector)
############################################

echo "→ Dropping AI helper modules…"
ensure_dir lib/ai
cat > lib/ai/model.ts <<'TS'
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../env.mjs';

let _openai: OpenAI | null = null;
let _anthropic: Anthropic | null = null;

export function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return _openai;
}

export function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  return _anthropic;
}

export type JsonLike = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

export async function openaiJSON(prompt: string, schema?: Record<string, unknown>) {
  const client = getOpenAI();
  // Responses API (JSON preference)
  const res = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
    response_format: schema ? { type: 'json_schema', json_schema: { name: 'schema', schema } } : { type: 'json_object' }
  });
  const out = res.output?.[0];
  if (out?.type === 'output_text') return JSON.parse(out.text()) as JsonLike;
  if (out?.type === 'output_json') return out.json();
  // fallback
  const txt = res.output_text ?? '';
  try { return JSON.parse(txt) as JsonLike; } catch { return { text: txt }; }
}

export async function anthropicJSON(prompt: string, system?: string) {
  const client = getAnthropic();
  const res = await client.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    system,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });
  const txt = res.content?.[0]?.type === 'text' ? res.content[0].text : '';
  try { return JSON.parse(txt) as JsonLike; } catch { return { text: txt }; }
}
TS

cat > lib/ai/parsers.ts <<'TS'
import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';

export function parserFromZod<T extends z.ZodTypeAny>(schema: T) {
  const parser = StructuredOutputParser.fromZodSchema(schema);
  return { parser, format: parser.getFormatInstructions() };
}
TS

cat > lib/ai/vector.ts <<'TS'
import { createClient } from '@supabase/supabase-js';
import { env } from '../../env.mjs';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

export function supabaseAdmin() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
}

export async function makeSupabaseVectorStore(table = 'documents', queryName = 'match_documents') {
  const client = supabaseAdmin();
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  return new SupabaseVectorStore(embeddings, {
    client,
    tableName: table,
    queryName,
  });
}
TS

############################################
# 5) Codegen tool helpers (filesystem utilities)
############################################

echo "→ Adding codegen tool helpers…"
ensure_dir lib/codegen
cat > lib/codegen/tools.ts <<'TS'
import fs from 'node:fs/promises';
import path from 'node:path';
import { execa } from 'execa';

export async function ensureDir(p: string) { await fs.mkdir(p, { recursive: true }); }
export async function writeFileSafe(p: string, content: string) {
  await ensureDir(path.dirname(p));
  await fs.writeFile(p, content, 'utf8');
}
export async function writeJSON(p: string, obj: unknown) {
  await writeFileSafe(p, JSON.stringify(obj, null, 2));
}
export async function formatRepo() {
  try { await execa('pnpm', ['prettier', '--write', '.'], { stdio: 'inherit' }); }
  catch { /* ignore */ }
}
TS

############################################
# 6) Hygen bootstrap + CRUD template pack
############################################

echo "→ Bootstrapping Hygen template pack…"
ensure_dir _templates/crud/new

cat > hygen.js <<'JS'
module.exports = { templates: `${__dirname}/_templates` };
JS

cat > _templates/crud/new/prompt.js <<'JS'
module.exports = [
  { type: 'input', name: 'Entity', message: 'Entity name (PascalCase):' },
  { type: 'input', name: 'entity', message: 'entity name (camelCase):' },
  { type: 'input', name: 'entityPlural', message: 'plural (camelCase):' },
  { type: 'input', name: 'table', message: 'Table name (snake_case plural):' },
  { type: 'input', name: 'fields', message: 'Fields CSV (name:type:required?), e.g. name:text:1, description:text:0' },
];
JS

cat > _templates/crud/new/server/trpc/[[ entity ]].router.ts.ejs.t <<'EJS'
---
to: server/trpc/<%= entity %>.router.ts
---
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from './_trpc';

const CreateSchema = z.object({
  <%_ fields.split(',').map(f=>f.trim()).filter(Boolean).forEach((f,i)=>{ const [name, type, req='1']=f.split(':'); -%>
  <%= name %>: z.<%= type === 'text' ? 'string()' : type === 'int' ? 'number().int()' : 'string()' %><%= req==='1' ? '.min(1)' : '.optional()' %>,
  <%_ }) -%>
});

export const <%= entity %>Router = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from('<%= table %>').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    }),
  create: protectedProcedure
    .input(CreateSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.from('<%= table %>').insert(input).select().single();
      if (error) throw new Error(error.message);
      return data;
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.from('<%= table %>').select('*').eq('id', input.id).single();
      if (error) throw new Error(error.message);
      return data;
    }),
  update: protectedProcedure
    .input(CreateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const { data, error } = await ctx.supabase.from('<%= table %>').update(rest).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return data;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from('<%= table %>').delete().eq('id', input.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }),
});
EJS

cat > _templates/crud/new/zod/[[ Entity ]].schema.ts.ejs.t <<'EJS'
---
to: zod/<%= Entity %>.schema.ts
---
import { z } from 'zod';

export const <%= Entity %>Schema = z.object({
  <%_ fields.split(',').map(f=>f.trim()).filter(Boolean).forEach((f,i)=>{ const [name, type, req='1']=f.split(':'); -%>
  <%= name %>: z.<%= type === 'text' ? 'string()' : type === 'int' ? 'number().int()' : 'string()' %><%= req==='1' ? '' : '.optional()' %>,
  <%_ }) -%>
});
EJS

cat > _templates/crud/new/app/(protected)/[[ entityPlural ]]/page.tsx.ejs.t <<'EJS'
---
to: app/(protected)/<%= entityPlural %>/page.tsx
---
'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { DataTable } from '../../components/data-table'; // assume you have a generic table

export default function <%= Entity %>ListPage() {
  const { data } = useQuery({ queryKey: ['<%= entityPlural %>'], queryFn: async () => {
    const res = await fetch('/api/trpc/<%= entity %>.list');
    return res.json();
  }});
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold"><%= Entity %>s</h1>
        <Link href="/<%= entityPlural %>/new" className="underline">New</Link>
      </div>
      <DataTable data={data ?? []} />
    </div>
  );
}
EJS

cat > _templates/crud/new/app/(protected)/[[ entityPlural ]]/[id]/page.tsx.ejs.t <<'EJS'
---
to: app/(protected)/<%= entityPlural %>/[id]/page.tsx
---
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { <%= Entity %>Form } from '../../../../components/forms/<%= Entity %>Form';

export default function <%= Entity %>DetailPage() {
  const params = useSearchParams();
  const id = params.get('id');
  const { data } = useQuery({ queryKey: ['<%= entity %>', id], queryFn: async () => {
    const res = await fetch(`/api/trpc/<%= entity %>.getById?id=${id}`);
    return res.json();
  }, enabled: !!id });
  return <div className="p-6"><%= Entity %>Form initialData={data} id={id as string} /></div>;
}
EJS

cat > _templates/crud/new/components/forms/[[ Entity ]]Form.tsx.ejs.t <<'EJS'
---
to: components/forms/<%= Entity %>Form.tsx
---
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { <%= Entity %>Schema } from '../../../zod/<%= Entity %>.schema';
import { z } from 'zod';

export function <%= Entity %>Form({ initialData, id }: { initialData?: any; id?: string }) {
  const form = useForm<z.infer<typeof <%= Entity %>Schema>>({
    resolver: zodResolver(<%= Entity %>Schema),
    defaultValues: initialData ?? {}
  });
  const onSubmit = async (values: z.infer<typeof <%= Entity %>Schema>) => {
    const qs = id ? `?id=${id}` : '';
    await fetch(`/api/trpc/<%= entity %>.${id ? 'update' : 'create'}${qs}`,{ method:'POST', body: JSON.stringify(values)});
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* TODO: render fields with shadcn inputs */}
      <button type="submit" className="px-4 py-2 rounded bg-black text-white">Save</button>
    </form>
  );
}
EJS

cat > _templates/crud/new/supabase/migrations/[[ timestamp ]]_create_[[ table ]].sql.ejs.t <<'EJS'
---
to: supabase/migrations/<%= timestamp %>_create_<%= table %>.sql
---
-- Migration for <%= table %>
create table if not exists public.<%= table %> (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- TODO: add fields
-- alter table public.<%= table %> enable row level security;
EJS

############################################
# 7) Sample profile.json (optional starter)
############################################

cat > profile.json <<'JSON'
{
  "id": "deployable-codegen",
  "version": "1.0.0",
  "entities": [
    { "name": "Project", "table": "projects", "fields": [
      {"name":"name","dbType":"text","required":true},
      {"name":"description","dbType":"text"}
    ]}
  ],
  "routes": [
    { "path": "/projects", "entity": "Project", "type": "list" },
    { "path": "/projects/[id]", "entity": "Project", "type": "detail" }
  ]
}
JSON

############################################
# 8) Done
############################################

echo "\n✔ Installer finished. Next steps:"
echo "  1) Review env.mjs and .env.example; set keys."
echo "  2) Run: $PM format  (format generated files)"
echo "  3) Generate CRUD with: pnpm codegen:crud  (Hygen will prompt for fields)"
echo "  4) Wire server TRPC context (ctx.supabase) and route proxies as needed."
