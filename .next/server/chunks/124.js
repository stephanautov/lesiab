"use strict";exports.id=124,exports.ids=[124],exports.modules={59124:(a,b,c)=>{c.r(b),c.d(b,{AiAnthropicSetupNode:()=>d,default:()=>e});let d={id:"ai.anthropic.setup",phase:"execute",estimate:()=>({tokens:320,usd:.0015}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo/lib/ai/anthropic.ts`,d=`// path: lib/ai/anthropic.ts
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
`.replace(/\r\n/g,"\n");return await b.storage.saveArtifact(c,d),b.logger.info({msg:"ai.anthropic.setup:written",files:[c],correlationId:b.correlationId}),{files:[c]}}},e=d}};