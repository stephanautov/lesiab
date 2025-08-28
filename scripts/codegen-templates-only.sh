# path: scripts/codegen-templates-only.sh
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

echo "→ Install dev deps (hygen, prettier, eslint)"
$PM add -D hygen prettier eslint >/dev/null 2>&1 || true

echo "→ Add package scripts"
node - <<'NODE'
const fs=require('fs');const p='package.json';const pkg=JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts ||= {};
pkg.scripts["codegen:crud"]="hygen crud new";
pkg.scripts["format"]=pkg.scripts["format"]||"prettier --write .";
pkg.scripts["format:check"]=pkg.scripts["format:check"]||"prettier --check .";
fs.writeFileSync(p, JSON.stringify(pkg,null,2)); console.log("✓ package.json updated");
NODE

echo "→ Write Hygen templates (no overwrite)"
# Minimal pack: routers + pages + injections
stage "_templates/crud/new/inject/router-import.ejs.t" <<'EOT'
---
inject: true
into: server/trpc/router.ts
after: // hygen:routers-import
---
import { <%= entity %>Router } from './<%= entity %>.router';
EOT

stage "_templates/crud/new/inject/router-merge.ejs.t" <<'EOT'
---
inject: true
into: server/trpc/router.ts
after: // hygen:routers-merge
---
  <%= entity %>: <%= entity %>Router,
EOT

stage "_templates/crud/new/server/trpc/[[ entity ]].router.ts.ejs.t" <<'EOT'
---
to: server/trpc/<%= entity %>.router.ts
---
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from './_trpc';
const CreateSchema = z.object({});
export const <%= entity %>Router = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase.from('<%= table %>').select('*').order('created_at',{ascending:false});
    if (error) throw new Error(error.message);
    return data;
  }),
});
EOT

stage "_templates/crud/new/app/(protected)/[[ entityPlural ]]/page.tsx.ejs.t" <<'EOT'
---
to: app/(protected)/<%= entityPlural %>/page.tsx
---
'use client';
import { api } from '@/lib/trpc';
import { DataTable } from '@/components/data-table';
export default function <%= Entity %>ListPage() {
  const { data } = api.<%= entity %>.list.useQuery();
  return (<div className="p-6"><DataTable data={data ?? []} /></div>);
}
EOT

echo "→ Done. Review any files under _patches/merge/** and merge manually."
