"use strict";exports.id=544,exports.ids=[544],exports.modules={36544:(a,b,c)=>{c.r(b),c.d(b,{MonitoringBasicsNode:()=>e,default:()=>f});let d=a=>a.replace(/\r\n/g,"\n"),e={id:"monitoring.basics",phase:"integrate",estimate:()=>({tokens:220,usd:.001}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo`,e=[{path:`${c}/app/analytics.tsx`,content:d(`"use client";
// path: app/analytics.tsx
import * as React from "react";
import { Analytics } from "@vercel/analytics/react";

/**
 * Mount this in app/layout.tsx inside <body>, typically after <Providers/>.
 * Example:
 *   <body>
 *     <Providers>{children}</Providers>
 *     <AppAnalytics />
 *   </body>
 */
export function AppAnalytics() {
  return <Analytics />;
}
`)},{path:`${c}/_patches/readme_monitoring_append.md`,content:d(`# Monitoring & Analytics

This project ships with **Vercel Analytics** enabled via \`vercel.json\` and a small wrapper component at \`app/analytics.tsx\`.

### How to enable on the page
In \`app/layout.tsx\`, render:
\`\`\`tsx
import { AppAnalytics } from "./analytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* your Providers, etc. */}
        {children}
        <AppAnalytics />
      </body>
    </html>
  );
}
\`\`\`

### Where metrics appear
- In your Vercel project dashboard under **Analytics**.
- Basic page views and navigation events are captured automatically.
- No custom events are added in the MVP to keep code deterministic.

### Notes
- Keep analytics logic in client components only.
- Avoid placing analytics in middleware or server actions for latency reasons.
`)}];for(let a of e)await b.storage.saveArtifact(a.path,a.content);return b.logger.info({msg:"monitoring.basics:written",files:e.map(a=>a.path),correlationId:b.correlationId}),{files:e.map(a=>a.path)}}},f=e}};