// path: edge-functions/embeddings/index.ts
// Deno Edge Function: embeddings
// Splits text, calls provider embeddings, upserts into pgvector, and broadcasts completion.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = {
  jobId: string;
  text: string;
  table: string; // target table (must exist)
  vectorColumn: string; // e.g., "embedding"
  contentColumn: string; // e.g., "content"
};

function chunk(text: string, size = 1000): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

async function embedOpenAI(
  texts: string[],
  apiKey: string,
): Promise<number[][]> {
  const model =
    Deno.env.get("OPENAI_EMBEDDINGS_MODEL") || "text-embedding-3-small";
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: texts }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`OpenAI embeddings failed (${res.status}): ${t}`);
  }
  const json = await res.json();
  const vectors: number[][] = (json.data || []).map(
    (d: any) => d.embedding as number[],
  );
  return vectors;
}

async function embedAnthropic(
  texts: string[],
  apiKey: string,
): Promise<number[][]> {
  // Anthropic doesn't currently offer an embeddings endpoint; fallback to OpenAI
  return embedOpenAI(texts, apiKey);
}

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
  const supa = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false },
  });

  const { jobId, text, table, vectorColumn, contentColumn } = (await req
    .json()
    .catch(() => ({}))) as Partial<Payload>;
  if (!jobId || !text || !table || !vectorColumn || !contentColumn) {
    return new Response(
      JSON.stringify({ ok: false, error: "missing fields" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const parts = chunk(text, 1000);
  const provider = (Deno.env.get("EMBED_PROVIDER") || "openai").toLowerCase();
  const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY") || "";

  let vectors: number[][];
  if (provider === "anthropic") {
    vectors = await embedAnthropic(parts, anthropicKey || openaiKey);
  } else {
    vectors = await embedOpenAI(parts, openaiKey);
  }

  // For MVP: average chunk vectors to produce a single vector per text
  const dim = vectors[0]?.length ?? 0;
  const acc = new Array(dim).fill(0);
  for (const v of vectors) for (let i = 0; i < dim; i++) acc[i] += v[i];
  const mean = acc.map((x) => x / (vectors.length || 1));

  // Upsert into the provided table (expects vectorColumn and contentColumn)
  const { error } = await supa
    .from(table)
    .upsert([{ id: jobId, [contentColumn]: text, [vectorColumn]: mean }], {
      onConflict: "id",
    });
  const ok = !error;

  // Broadcast completion
  try {
    const ch = supa.channel("lesiab:embeddings");
    await ch.send({ type: "broadcast", event: "done", payload: { jobId, ok } });
    try {
      await ch.unsubscribe();
    } catch {}
  } catch {}

  const body = ok
    ? { ok: true, jobId }
    : { ok: false, error: String(error?.message || "upsert failed"), jobId };
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
  });
});
