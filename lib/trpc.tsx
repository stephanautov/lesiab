// path: lib/trpc.tsx
"use client";

import * as React from "react";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/trpc/router";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import { getSupabaseBrowser } from "../lib/auth-client";

export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  const [trpcClient] = React.useState(() =>
    api.createClient({
      // ❌ transformer moved in tRPC v11 — do not put it here
      // transformer: superjson,

      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // ✅ In v11, set the transformer on the link:
          transformer: superjson,

          // Forward Supabase session token with each request (fixes 401 on protected routes)
          headers: async () => {
            try {
              const supa = getSupabaseBrowser();
              const { data } = await supa.auth.getSession();
              const token = data.session?.access_token;
              return token ? { Authorization: `Bearer ${token}` } : {};
            } catch {
              return {};
            }
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
