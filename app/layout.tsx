// path: app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "LESiAB",
  description: "Low-Effort, Stable, Iterative App Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-[15px] font-semibold tracking-wide">
              LESiAB
            </Link>
            <nav className="text-sm space-x-4">
              <Link href="/home" className="underline-offset-2 hover:underline">
                Home
              </Link>
              <Link
                href="/uploads"
                className="underline-offset-2 hover:underline"
              >
                Uploads
              </Link>
              <Link
                href="/flows"
                className="underline-offset-2 hover:underline"
              >
                Flows
              </Link>
              <Link
                href="/design"
                className="underline-offset-2 hover:underline"
              >
                Design
              </Link>
              <Link
                href="/posts"
                className="underline-offset-2 hover:underline"
              >
                Posts
              </Link>
            </nav>
          </div>
        </header>
        <main className="container-page">{children}</main>
      </body>
    </html>
  );
}
