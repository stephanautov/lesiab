// path: app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/auth-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  const supabase = await getSupabaseServer();
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, origin),
      );
  }
  return NextResponse.redirect(new URL(next, origin));
}
