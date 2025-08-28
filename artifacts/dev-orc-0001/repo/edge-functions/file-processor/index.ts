// path: edge-functions/file-processor/index.ts
// Deno Edge Function: file processor (placeholder).
// Expects JSON: { jobId?: string, path?: string }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { jobId, path } = await req.json().catch(() => ({}));
  // TODO: fetch file from Storage and process; for MVP we ack and broadcast only.
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
    const supa = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
    const ch = supa.channel("lesiab:file");
    await ch.send({ type: "broadcast", event: "processed", payload: { jobId: jobId ?? null, path: path ?? null } });
    try { await ch.unsubscribe(); } catch {}
  } catch {
    // ignore broadcast errors in MVP
  }
  return new Response(JSON.stringify({ ok: true, jobId: jobId ?? null }), {
    headers: { "content-type": "application/json" }
  });
});
