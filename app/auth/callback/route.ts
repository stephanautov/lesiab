// path: app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  const supabase = await getSupabaseServer(); // <-- await the async helper

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // optional: log or surface a nicer error page
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, origin),
      );
    }
  }
  return NextResponse.redirect(new URL(next, origin));
}
