"use strict";exports.id=431,exports.ids=[431],exports.modules={96431:(a,b,c)=>{c.r(b),c.d(b,{TrpcClientNode:()=>e,default:()=>f});let d=a=>a.replace(/\r\n/g,"\n"),e={id:"trpc.client",phase:"execute",estimate:()=>({tokens:520,usd:.002}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo`,e=[{path:`${c}/lib/trpc.tsx`,content:d(`"use client";
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
  return vercel ? \`https://\${vercel}\` : "http://localhost:3000";
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [client] = React.useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: \`\${getBaseUrl()}/api/trpc\`,
          // Optionally add headers() callback here if you later need auth headers.
        })
      ]
    })
  );
  return <api.Provider client={client} queryClient={queryClient}>{children}</api.Provider>;
}
`)},{path:`${c}/_patches/app_providers_trpc_injection.diff`,content:d(`--- a/app/providers.tsx
+++ b/app/providers.tsx
@@
-"use client";
-import * as React from "react";
-import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
-
-const queryClient = new QueryClient();
-
-export function Providers({ children }: { children: React.ReactNode }) {
-  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
-}
+"use client";
+import * as React from "react";
+import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
+import { TRPCProvider } from "../lib/trpc";
+
+const queryClient = new QueryClient();
+
+export function Providers({ children }: { children: React.ReactNode }) {
+  return (
+    <QueryClientProvider client={queryClient}>
+      <TRPCProvider>{children}</TRPCProvider>
+    </QueryClientProvider>
+  );
+}
`)}];for(let a of e)await b.storage.saveArtifact(a.path,a.content);return b.logger.info({msg:"trpc.client:written",files:e.map(a=>a.path),correlationId:b.correlationId}),{files:e.map(a=>a.path)}}},f=e}};