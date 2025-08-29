// path: lib/ai/openai.ts
import OpenAI from "openai";
import { env } from "../../env.mjs";

let _client: OpenAI | null = null;

export function getOpenAI() {
  if (_client) return _client;
  _client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return _client;
}

type JsonOk<T> = { ok: true; data: T };
type JsonErr = { ok: false; rawText: string };

export async function jsonResponse<T = unknown>(
  prompt: string,
  schema?: Record<string, unknown>,
): Promise<JsonOk<T> | JsonErr> {
  const client = getOpenAI();

  // Pick a small, cost-effective default model; callers can tweak later.
  const model = process.env.OPENAI_RESPONSES_MODEL || "gpt-4.1-mini";

  const hasSchema = !!schema && typeof schema === "object";
  const resp = await client.responses.create({
    model,
    input: prompt,
    ...(hasSchema
      ? {
          response_format: {
            type: "json_schema",
            json_schema: { name: "Output", schema, strict: true },
          },
        }
      : { response_format: { type: "json_object" } }),
  });

  // Try to extract consolidated text from Responses API result
  // The SDK exposes a convenience: resp.output_text; fallback to concatenating content.
  const text =
    (resp as any).output_text ??
    (Array.isArray((resp as any).output)
      ? (resp as any).output
          .map((o: any) => {
            if (!o?.content) return "";
            const c = Array.isArray(o.content) ? o.content : [o.content];
            return c.map((p: any) => p?.text ?? "").join("");
          })
          .join("")
      : "");

  try {
    const parsed = JSON.parse(text || "{}") as T;
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, rawText: String(text ?? "") };
  }
}
