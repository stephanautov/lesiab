// path: lib/queue.ts
// Server helper to enqueue a job via Supabase Functions REST.
import { env } from "../env.mjs";

export type EnqueueOptions = { delaySeconds?: number };

export async function enqueue(jobName: string, payload: unknown, opts: EnqueueOptions = {}) {
  const url = new URL("/functions/v1/queue", env.SUPABASE_URL).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE}`
    },
    body: JSON.stringify({ jobName, payload, delaySeconds: opts.delaySeconds ?? 0 })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`enqueue failed (${res.status}): ${text}`);
  }
  return (await res.json().catch(() => ({}))) as unknown;
}
