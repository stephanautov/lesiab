// path: app/api/debug/session/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/auth-server";

export async function GET() {
  try {
    const supa = await getSupabaseServer();
    const { data, error } = await supa.auth.getUser();
    if (error)
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 200 },
      );
    return NextResponse.json({
      ok: true,
      userId: data.user?.id ?? null,
      email: data.user?.email ?? null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 200 },
    );
  }
}
