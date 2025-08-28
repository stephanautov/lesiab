// path: app/layout.tsx
import "./globals.css";
import * as React from "react";
import { Providers } from "./providers";
import { Header } from "../components/Header";
import { AppAnalytics } from "./analytics";

export const metadata = {
  title: "LESiAB",
  description: "MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Providers>{children}</Providers>
        <AppAnalytics />
      </body>
    </html>
  );
}
