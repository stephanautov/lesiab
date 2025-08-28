// path: app/layout.tsx
import "./globals.css";
import * as React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "App",
  description: "LESiAB MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
