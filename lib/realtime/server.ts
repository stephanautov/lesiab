// path: lib/realtime/server.ts
// Server-side broadcast helper using Supabase Realtime channels.
// Requires Realtime 'broadcast' to be enabled in project settings.
import { createClient } from "@supabase/supabase-js";
import { env } from "../../env.mjs";

const supa = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false }
});

/**
 * Publish an event to channel `lesiab:${entity}`.
 * Consumers (clients) can subscribe to this channel and event name.
 */
export async function publish(entity: string, event: string, payload: Record<string, unknown>) {
  const channel = supa.channel(`lesiab:${entity}`);
  const ok = await channel.send({ type: "broadcast", event, payload });
  try { await channel.unsubscribe(); } catch { /* noop */ }
  return ok;
}
