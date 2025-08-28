# path: scripts/codegen-addon-merge-safe.sh
#!/usr/bin/env bash
set -euo pipefail

PM=${PM:-pnpm}
if ! command -v "$PM" >/dev/null 2>&1; then echo "✖ package manager ($PM) not found"; exit 1; fi

ensure_dir(){ mkdir -p "$1"; }
stage(){ local target="$1"; local tmp; tmp="$(mktemp)"; cat >"$tmp"; if [[ -f "$target" ]]; then
  if cmp -s "$target" "$tmp"; then echo "✓ unchanged $target"; rm -f "$tmp"; else
    echo "↪ conflict (kept existing): $target"
    ensure_dir "_patches/merge/$(dirname "$target")"
    mv "$tmp" "_patches/merge/$target"
    echo "  → wrote candidate to _patches/merge/$target"
  fi
else
  ensure_dir "$(dirname "$target")"; mv "$tmp" "$target"; echo "＋ created $target"
fi; }

echo "→ Install runtime deps"
$PM add @trpc/client @trpc/server @trpc/react-query superjson @tanstack/react-query >/dev/null 2>&1 || true

# TRPC server/base (only create if missing)
[[ -f server/trpc/_trpc.ts ]] || stage "server/trpc/_trpc.ts" <<'EOT'
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';
const t = initTRPC.context<Context>().create({ transformer: superjson });
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) throw new Error('UNAUTHORIZED');
  return next({ ctx });
});
EOT

[[ -f server/trpc/context.ts ]] || stage "server/trpc/context.ts" <<'EOT'
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../../env.mjs';
export type Context = { supabase: SupabaseClient; userId?: string; headers?: Headers; };
export async function createContext(_req?: Request): Promise<Context> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
  return { supabase };
}
EOT

[[ -f server/trpc/router.ts ]] || stage "server/trpc/router.ts" <<'EOT'
import { createTRPCRouter } from './_trpc';
// hygen:routers-import
export const appRouter = createTRPCRouter({
  health: undefined as any,
  // hygen:routers-merge
});
export type AppRouter = typeof appRouter;
EOT

# API route adapter (skip if exists)
[[ -f app/api/trpc/[trpc]/route.ts ]] || stage "app/api/trpc/[trpc]/route.ts" <<'EOT'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';
export const runtime = 'nodejs';
const handler = (req: Request) => fetchRequestHandler({ endpoint: '/api/trpc', req, router: appRouter, createContext });
export { handler as GET, handler as POST };
EOT

# TRPC client provider (skip if exists)
[[ -f lib/trpc.tsx ]] || stage "lib/trpc.tsx" <<'EOT'
'use client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/router';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
export const api = createTRPCReact<AppRouter>();
function getBaseUrl(){ if(typeof window!=='undefined') return ''; return process.env.VERCEL_URL?`https://${process.env.VERCEL_URL}`:'http://localhost:3000'; }
const client = api.createClient({ links: [ loggerLink(), httpBatchLink({ url: `${getBaseUrl()}/api/trpc` }) ] });
const queryClient = new QueryClient();
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return (<api.Provider client={client} queryClient={queryClient}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></api.Provider>);
}
EOT

# Providers shim (skip if exists)
[[ -f app/providers.tsx ]] || stage "app/providers.tsx" <<'EOT'
'use client';
import * as React from 'react';
import { TRPCProvider } from '@/lib/trpc';
export function Providers({ children }: { children: React.ReactNode }) { return <TRPCProvider>{children}</TRPCProvider>; }
EOT

# Minimal DataTable (skip if exists)
[[ -f components/data-table.tsx ]] || stage "components/data-table.tsx" <<'EOT'
'use client';
import * as React from 'react'; import { useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
type AnyRow = Record<string, unknown>;
export function DataTable({ data }: { data: AnyRow[] }) {
  const columns = useMemo<ColumnDef<AnyRow>[]>(() => {
    const first = data?.[0] || {};
    return Object.keys(first).map((k) => ({ accessorKey: k, header: k, cell: (info) => String(info.getValue() ?? '') }));
  }, [data]);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  if (!data || data.length === 0) return <div className="text-sm text-gray-500">No data</div>;
  return (<div className="overflow-auto border rounded-md"><table className="min-w-full text-sm"><thead>{table.getHeaderGroups().map(hg=>(
    <tr key={hg.id} className="border-b bg-gray-50">{hg.headers.map(h=>(<th key={h.id} className="px-3 py-2 text-left font-medium">{h.isPlaceholder?null:flexRender(h.column.columnDef.header,h.getContext())}</th>))}</tr>
  ))}</thead><tbody>{table.getRowModel().rows.map(row=>(
    <tr key={row.id} className="border-b hover:bg-gray-50">{row.getVisibleCells().map(cell=>(
      <td key={cell.id} className="px-3 py-2">{flexRender(cell.column.columnDef.cell,cell.getContext())}</td>
    ))}</tr>
  ))}</tbody></table></div>);
}
EOT

echo "✓ Add-on merge-safe completed. Review _patches/merge/** if any."
