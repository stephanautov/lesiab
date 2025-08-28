// path: app/(protected)/flows/page.tsx
"use client";
import * as React from "react";
import Link from "next/link";

export default function FlowsLanding() {
  const items = [];
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Flows</h1>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-600">No complex flows defined yet.</p>
      ) : (
        <ul className="list-disc pl-5 text-sm">
          {items.map((it) => (
            <li key={it.href}><Link className="underline" href={it.href}>{it.name}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
