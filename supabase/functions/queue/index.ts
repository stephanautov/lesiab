// path: edge-functions/queue/index.ts
// Deno Edge Function to accept enqueued jobs.
// Expects JSON: { jobName: string, payload: unknown, delaySeconds?: number }
Deno.serve(
  async (req: {
    headers: { get: (arg0: string) => string };
    json: () => Promise<any>;
  }) => {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing bearer auth" }),
        { status: 401 },
      );
    }
    const body = await req.json().catch(() => ({}));
    const { jobName, payload, delaySeconds = 0 } = body ?? {};
    const result = { ok: true, received: { jobName, delaySeconds, payload } };
    return new Response(JSON.stringify(result), {
      headers: { "content-type": "application/json" },
    });
  },
);
