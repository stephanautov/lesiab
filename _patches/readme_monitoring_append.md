# Monitoring & Analytics

This project ships with **Vercel Analytics** enabled via `vercel.json` and a small wrapper component at `app/analytics.tsx`.

### How to enable on the page
In `app/layout.tsx`, render:
```tsx
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
```

### Where metrics appear
- In your Vercel project dashboard under **Analytics**.
- Basic page views and navigation events are captured automatically.
- No custom events are added in the MVP to keep code deterministic.

### Notes
- Keep analytics logic in client components only.
- Avoid placing analytics in middleware or server actions for latency reasons.
