"use client";
// path: lib/trpc.tsx
import * as React from "react";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "../server/trpc/router";
import { useQueryClient } from "@tanstack/react-query";

export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  // In server contexts, prefer VERCEL_URL if present; fallback to localhost.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [client] = React.useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // Optionally add headers() callback here if you later need auth headers.
        }),
      ],
    }),
  );
  return (
    <api.Provider client={client} queryClient={queryClient}>
      {children}
    </api.Provider>
  );
}
