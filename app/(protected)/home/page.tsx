// path: app/(protected)/home/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { api } from "../../../lib/trpc";

export default function HomePage() {
  const { data } = api.health.ping.useQuery();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">LESiAB — Dashboard</h1>
      <p className="text-sm text-neutral-600">tRPC health: {data ?? "…"}</p>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href="/uploads" className="rounded border p-4 hover:bg-neutral-50">
          <h2 className="font-medium">Uploads</h2>
          <p className="text-sm text-neutral-600">Direct-to-Supabase Storage via presigned URL.</p>
        </Link>

        <Link href="/flows" className="rounded border p-4 hover:bg-neutral-50">
          <h2 className="font-medium">Flows</h2>
          <p className="text-sm text-neutral-600">Multi-entity screens (generated from profile.json).</p>
        </Link>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-2 font-medium">Next steps</h2>
        <ol className="list-decimal pl-5 text-sm leading-6 text-neutral-700">
          <li>Generate CRUD routers & pages from your <code>profile.json</code>.</li>
          <li>Wire new routers under <code>server/trpc/router.ts</code> using the Hygen anchors.</li>
          <li>(Optional) Add login to protect these routes.</li>
        </ol>
      </section>
    </main>
  );
}
