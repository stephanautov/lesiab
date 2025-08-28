// path: nodes/ai.anthropic.setup.ts
/**
 * NODE: ai.anthropic.setup
 * Phase: execute
 *
 * Purpose:
 *  - Export a singleton Anthropic client and a helper to request JSON-parseable
 *    replies from Claude (Messages API). When possible, use JSON mode.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/lib/ai/anthropic.ts
 *
 * Notes:
 *  - Defensive parsing similar to OpenAI helper.
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: {
    saveArtifact: (path: string, content: string | Uint8Array) => Promise<void>;
  };
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

export const AiAnthropicSetupNode: NodeSpec<unknown, { files: string[] }> = {
  id: "ai.anthropic.setup",
  phase: "execute",
  estimate: () => ({ tokens: 320, usd: 0.0015 }),
  async run(_input, ctx) {
    const path = `artifacts/${ctx.orchestrationId}/repo/lib/ai/anthropic.ts`;

    const content = lf(`// path: lib/ai/anthropic.ts
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

export async function jsonMessage<T = unknown>(prompt: string, system = "Return strict JSON only. No prose."): Promise<JsonOk<T> | JsonErr> {
  const client = getAnthropic();
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620";

  const msg = await client.messages.create({
    model,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: prompt }],
    // If supported, prefer structured JSON mode:
    // @ts-ignore - newer SDKs support response_format; ignore if not available
    response_format: { type: "json_object" }
  } as any);

  // Try to get a single text blob
  const text =
    (msg as any)?.content?.map((c: any) => c?.text ?? "").join("") ??
    ((msg as any)?.output_text ?? "");

  try {
    const parsed = JSON.parse(text || "{}") as T;
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, rawText: String(text ?? "") };
  }
}
`);

    await ctx.storage.saveArtifact(path, content);
    ctx.logger.info({
      msg: "ai.anthropic.setup:written",
      files: [path],
      correlationId: ctx.correlationId,
    });
    return { files: [path] };
  },
};

export default AiAnthropicSetupNode;
