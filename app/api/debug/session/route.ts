// path: app/api/debug/session/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/auth-server";

export async function GET() {
  const supa = await getSupabaseServer();
  const { data, error } = await supa.auth.getUser();
  if (error || !data?.user)
    return NextResponse.json({
      ok: false,
      error: error?.message ?? "Auth session missing!",
    });
  return NextResponse.json({
    ok: true,
    userId: data.user.id,
    email: data.user.email,
  });
}
