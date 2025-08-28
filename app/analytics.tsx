"use client";
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
