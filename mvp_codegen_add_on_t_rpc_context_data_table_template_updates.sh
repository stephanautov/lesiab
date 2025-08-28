#!/usr/bin/env bash
# scripts/mvp-codegen-addon-trpc-datatable.sh
# Add‑on for the one‑file installer: adds tRPC server context, Next route adapter,
# tRPC client/provider, and a minimal DataTable component. Also patches Hygen templates
# to use tRPC hooks so generated pages compile cleanly.
# Usage: bash scripts/mvp-codegen-addon-trpc-datatable.sh

set -euo pipefail

PM=${PM:-pnpm}
if ! command -v $PM >/dev/null 2>&1; then echo "✖ package manager ($PM) not found"; exit 1; fi

# 0) deps
$PM add @trpc/client @trpc/server @trpc/react-query superjson @tanstack/react-query

# 1) server/trpc base
mkdir -p server/trpc
cat > server/trpc/_trpc.ts <<'TS'
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({ transformer: superjson });
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Minimal auth gate; replace with real session check later
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) throw new Error('UNAUTHORIZED');
  return next({ ctx });
});
TS

cat > server/trpc/context.ts <<'TS'
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { headers as nextHeaders } from 'next/headers';
import { env } from '../../env.mjs';

export type Context = {
  supabase: SupabaseClient;
  userId?: string; // TODO: derive from session/JWT
  headers: Headers;
};

export async function createContext(_req?: Request): Promise<Context> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
  // TODO: Replace with real auth extraction
  const headers = typeof nextHeaders === 'function' ? new Headers(nextHeaders() as any) : new Headers();
  const userId = undefined;
  return { supabase, userId, headers };
}
TS

cat > server/trpc/router.ts <<'TS'
import { createTRPCRouter } from './_trpc';

// hygen:routers-import

export const appRouter = createTRPCRouter({
  // hygen:routers-merge
});

export type AppRouter = typeof appRouter;
TS

# 2) Next.js route adapter (tRPC fetch adapter)
mkdir -p app/api/trpc/[trpc]
cat > app/api/trpc/[trpc]/route.ts <<'TS'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';

export const runtime = 'nodejs';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
TS

# 3) TRPC client & Providers
mkdir -p lib
cat > lib/trpc.tsx <<'TSX'
'use client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/router';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
}

const client = api.createClient({
  links: [
    loggerLink(),
    httpBatchLink({ url: `${getBaseUrl()}/api/trpc` }),
  ],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <api.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
TSX

# 4) Minimal DataTable component
mkdir -p components
cat > components/data-table.tsx <<'TSX'
'use client';
import * as React from 'react';
import { useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type AnyRow = Record<string, unknown>;

export function DataTable({ data }: { data: AnyRow[] }) {
  const columns = useMemo<ColumnDef<AnyRow>[]>(() => {
    const first = data?.[0] || {};
    return Object.keys(first).map((k) => ({
      accessorKey: k,
      header: k,
      cell: (info) => String(info.getValue() ?? ''),
    }));
  }, [data]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500">No data</div>;
  }

  return (
    <div className="overflow-auto border rounded-md">
      <table className="min-w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b bg-gray-50">
              {hg.headers.map((h) => (
                <th key={h.id} className="px-3 py-2 text-left font-medium">
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
TSX

# 5) Patch Hygen templates to use tRPC + DataTable import
mkdir -p _templates/crud/new/inject
cat > _templates/crud/new/inject/router-import.ejs.t <<'EJS'
---
inject: true
into: server/trpc/router.ts
after: // hygen:routers-import
---
import { <%= entity %>Router } from './<%= entity %>.router';
EJS

cat > _templates/crud/new/inject/router-merge.ejs.t <<'EJS'
---
inject: true
into: server/trpc/router.ts
after: // hygen:routers-merge
---
  <%= entity %>: <%= entity %>Router,
EJS

# overwrite router template to ensure it exports router type
# (created earlier in step 1)

# Update CRUD router template (unchanged path)
cat > _templates/crud/new/server/trpc/[[ entity ]].router.ts.ejs.t <<'EJS'
---
to: server/trpc/<%= entity %>.router.ts
---
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from './_trpc';

const CreateSchema = z.object({
  <%_ fields.split(',').map(f=>f.trim()).filter(Boolean).forEach((f)=>{ const [name, type, req='1']=f.split(':'); -%>
  <%= name %>: z.<%= type === 'text' ? 'string()' : type === 'int' ? 'number().int()' : 'string()' %><%= req==='1' ? '.min(1)' : '.optional()' %>,
  <%_ }) -%>
});

export const <%= entity %>Router = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase.from('<%= table %>').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }),
  create: protectedProcedure.input(CreateSchema).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from('<%= table %>').insert(input).select().single();
    if (error) throw new Error(error.message);
    return data;
  }),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from('<%= table %>').select('*').eq('id', input.id).single();
    if (error) throw new Error(error.message);
    return data;
  }),
  update: protectedProcedure.input(CreateSchema.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id, ...rest } = input;
    const { data, error } = await ctx.supabase.from('<%= table %>').update(rest).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }),
  remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { error } = await ctx.supabase.from('<%= table %>').delete().eq('id', input.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  }),
});
EJS

# Update pages to use tRPC hooks and DataTable alias import
cat > _templates/crud/new/app/(protected)/[[ entityPlural ]]/page.tsx.ejs.t <<'EJS'
---
to: app/(protected)/<%= entityPlural %>/page.tsx
---
'use client';
import Link from 'next/link';
import { api } from '@/lib/trpc';
import { DataTable } from '@/components/data-table';

export default function <%= Entity %>ListPage() {
  const { data } = api.<%= entity %>.list.useQuery();
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
import { useParams } from 'next/navigation';
import { api } from '@/lib/trpc';
import { <%= Entity %>Form } from '@/components/forms/<%= Entity %>Form';

export default function <%= Entity %>DetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data } = api.<%= entity %>.getById.useQuery({ id }, { enabled: !!id });
  return <div className="p-6"><%= Entity %>Form initialData={data as any} id={id} /></div>;
}
EJS

# 6) Providers hint (do not overwrite layout automatically)
mkdir -p app
cat > app/providers.tsx <<'TSX'
'use client';
import * as React from 'react';
import { Providers as TRPCProviders } from '@/lib/trpc';

export function Providers({ children }: { children: React.ReactNode }) {
  return <TRPCProviders>{children}</TRPCProviders>;
}
TSX

echo "\n✔ Add‑on installed.\nNext steps:\n  1) Wrap your root layout with <Providers> from 'app/providers'.\n  2) Use 'hygen crud new' to generate an entity; it will inject router imports/merge into server/trpc/router.ts.\n  3) Start dev server; CRUD pages should compile and use tRPC hooks with a minimal DataTable.\n"
