// path: components/Header.tsx
"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/home" className="font-semibold">LESiAB</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/home" className="underline-offset-4 hover:underline">Home</Link>
          <Link href="/uploads" className="underline-offset-4 hover:underline">Uploads</Link>
          <Link href="/flows" className="underline-offset-4 hover:underline">Flows</Link>
        </nav>
      </div>
    </header>
  );
}
