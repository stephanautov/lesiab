// path: tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  // v4 doesn’t require `content`, but keeping these globs is fine.
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./server/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: { xl: "var(--radius)", "2xl": "calc(var(--radius) + 6px)" },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;
