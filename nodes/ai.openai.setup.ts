// path: nodes/ai.openai.setup.ts
/**
 * NODE: ai.openai.setup
 * Phase: execute
 *
 * Purpose:
 *  - Export a singleton OpenAI client and a helper to request JSON responses
 *    via the Responses API with optional JSON Schema enforcement.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/lib/ai/openai.ts
 *
 * Notes:
 *  - Defensive parsing: returns { ok: true, data } on success or { ok: false, rawText } on fallback.
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: { saveArtifact: (path: string, content: string | Uint8Array) => Promise<void> };
}
export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase:
    | "processResponses"
    | "analyze"
    | "validate"
    | "plan"
    | "execute"
    | "codeGeneration"
    | "integrate"
    | "finalize";
  estimate?: (input: I) => { tokens?: number; usd?: number };
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}
const lf = (s: string) => s.replace(/\r\n/g, "\n");

export const AiOpenaiSetupNode: NodeSpec<unknown, { files: string[] }> = {
  id: "ai.openai.setup",
  phase: "execute",
  estimate: () => ({ tokens: 320, usd: 0.0015 }),
  async run(_input, ctx) {
    const path = `artifacts/${ctx.orchestrationId}/repo/lib/ai/openai.ts`;

    const content = lf(`// path: lib/ai/openai.ts
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

export async function jsonResponse<T = unknown>(prompt: string, schema?: Record<string, unknown>): Promise<JsonOk<T> | JsonErr> {
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
            json_schema: { name: "Output", schema, strict: true }
          }
        }
      : { response_format: { type: "json_object" } }),
  });

  // Try to extract consolidated text from Responses API result
  // The SDK exposes a convenience: resp.output_text; fallback to concatenating content.
  const text = (resp as any).output_text
    ?? (Array.isArray((resp as any).output)
          ? ((resp as any).output.map((o: any) => {
              if (!o?.content) return "";
              const c = Array.isArray(o.content) ? o.content : [o.content];
              return c.map((p: any) => p?.text ?? "").join("");
            }).join(""))
          : "");

  try {
    const parsed = JSON.parse(text || "{}") as T;
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, rawText: String(text ?? "") };
  }
}
`);

    await ctx.storage.saveArtifact(path, content);
    ctx.logger.info({ msg: "ai.openai.setup:written", files: [path], correlationId: ctx.correlationId });
    return { files: [path] };
  },
};

export default AiOpenaiSetupNode;
