// path: lib/ai/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../../env.mjs";

let _client: Anthropic | null = null;

export function getAnthropic() {
  if (_client) return _client;
  _client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  return _client;
}

type JsonOk<T> = { ok: true; data: T };
type JsonErr = { ok: false; rawText: string };

export async function jsonMessage<T = unknown>(
  prompt: string,
  system = "Return strict JSON only. No prose.",
): Promise<JsonOk<T> | JsonErr> {
  const client = getAnthropic();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

  const msg = await client.messages.create({
    model,
    max_tokens: 4024,
    system,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  } as any);

  // Try to get a single text blob
  const text =
    (msg as any)?.content?.map((c: any) => c?.text ?? "").join("") ??
    (msg as any)?.output_text ??
    "";

  try {
    const parsed = JSON.parse(text || "{}") as T;
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, rawText: String(text ?? "") };
  }
}
