// path: middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * Minimal protection for /app/(protected)/** routes.
 * For performance, we check for the presence of 'sb-access-token' cookie.
 * Real verification happens server-side in tRPC context using service role.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname || "/";
  const isProtected = pathname.startsWith("/app/(protected)");

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) {
    const login = new URL("/login", url.origin);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/(protected)/(.*)"],
};
