"use strict";exports.id=272,exports.ids=[272],exports.modules={62272:(a,b,c)=>{c.r(b),c.d(b,{NextAppRouterNode:()=>e,default:()=>f});let d=a=>a.replace(/\r\n/g,"\n"),e={id:"next.app.router",phase:"execute",estimate:()=>({tokens:280,usd:.001}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo/app`,e=[{path:`${c}/layout.tsx`,content:d(`// path: app/layout.tsx
import "./globals.css";
import * as React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "App",
  description: "LESiAB MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`)},{path:`${c}/(protected)/home/page.tsx`,content:d(`// path: app/(protected)/home/page.tsx
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
`)}];for(let a of e)await b.storage.saveArtifact(a.path,a.content);return b.logger.info({msg:"next.app.router:written",files:e.map(a=>a.path),correlationId:b.correlationId}),{files:e.map(a=>a.path)}}},f=e}};