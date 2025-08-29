// path: app/api/public/health/route.ts
export const runtime = "edge";
export const revalidate = 60;

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}
