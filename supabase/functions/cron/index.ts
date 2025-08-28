// path: edge-functions/cron/index.ts
// Deno Edge Function for scheduled tasks.
// Configure schedule in Supabase dashboard -> Edge Functions -> Schedule.
Deno.serve(async (_req) => {
  const now = new Date().toISOString();
  const body = JSON.stringify({ ok: true, ranAt: now });
  return new Response(body, { headers: { "content-type": "application/json" } });
});
