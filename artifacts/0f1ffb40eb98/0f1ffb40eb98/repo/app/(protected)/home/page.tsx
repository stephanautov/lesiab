// path: app/(protected)/home/page.tsx
"use client";

import * as React from "react";
import { api } from "../../../lib/trpc";

export default function HomePage() {
  const { data } = api.health.ping.useQuery();
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Protected Home</h1>
      <p className="text-sm text-neutral-600">tRPC health: {data ?? "…"}</p>
    </div>
  );
}
