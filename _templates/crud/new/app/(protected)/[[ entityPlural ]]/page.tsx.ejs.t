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
