// path: server/orchestration/run.ts
// Minimal orchestrator runner: wires nodes, persists artifacts via Supabase Storage,
// and executes a fixed plan. Accepts description + optional questionnaire answers.

import crypto from "node:crypto";
import type { ArtifactStorage } from "./storage";
import { createArtifactStorage } from "./storage";

export type ExecutionContext = {
  orchestrationId: string;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: ArtifactStorage;
};

export type NodeSpec<I = unknown, O = unknown> = {
  id: string;
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
};

// Dynamic node loader map (add/remove as your repo grows)
async function loadNode(id: string): Promise<NodeSpec<any, any> | null> {
  const map: Record<string, () => Promise<any>> = {
    "profile.normalize": () => import("../../nodes/profile.normalize"),
    "trpc.server": () => import("../../nodes/trpc.server"),
    "rest.public": () => import("../../nodes/rest.public"),
    "trpc.client": () => import("../../nodes/trpc.client"),
    "next.app.router": () => import("../../nodes/next.app.router"),
    "upload.direct": () => import("../../nodes/upload.direct"),
    "ai.openai.setup": () => import("../../nodes/ai.openai.setup"),
    "ai.anthropic.setup": () => import("../../nodes/ai.anthropic.setup"),
    "ai.langgraph.flow": () => import("../../nodes/ai.langgraph.flow"),
    "ai.embedder": () => import("../../nodes/ai.embedder"),
    "realtime.client": () => import("../../nodes/realtime.client"),
    "ui.screens": () => import("../../nodes/ui.screens"),
    "vercel.config": () => import("../../nodes/vercel.config"),
    "monitoring.basics": () => import("../../nodes/monitoring.basics"),
    "github.setup": () => import("../../nodes/github.setup"),
    "deploy.docs": () => import("../../nodes/deploy.docs"),
  };
  const loader = map[id];
  if (!loader) return null;
  try {
    const mod = await loader();
    return (mod.default || Object.values(mod)[0]) as NodeSpec<any, any>;
  } catch (e) {
    return null;
  }
}

function stableId(s: string) {
  return crypto
    .createHash("sha256")
    .update(s || "app", "utf8")
    .digest("hex")
    .slice(0, 12);
}

export async function runOrchestration(description: string, answers?: unknown) {
  const orchestrationId = stableId(description);
  const storage = createArtifactStorage(orchestrationId);

  const ctx: ExecutionContext = {
    orchestrationId,
    correlationId: orchestrationId,
    logger: {
      info: (m) => console.log("[orc]", JSON.stringify(m)),
      warn: (m) => console.warn("[orc]", JSON.stringify(m)),
      error: (m) => console.error("[orc]", JSON.stringify(m)),
    },
    storage,
  };

  // Fixed plan. Missing nodes are skipped with a warning.
  const plan: string[] = [
    "profile.normalize",
    "trpc.server",
    "rest.public",
    "trpc.client",
    "next.app.router",
    "upload.direct",
    "ai.openai.setup",
    "ai.anthropic.setup",
    "ai.langgraph.flow",
    "ai.embedder",
    "realtime.client",
    "ui.screens",
    "vercel.config",
    "monitoring.basics",
    "github.setup",
    "deploy.docs",
  ];

  const files: string[] = [];

  for (const id of plan) {
    const node = await loadNode(id);
    if (!node) {
      ctx.logger.warn({ msg: "node.missing", id });
      continue;
    }

    // Thread the richer input only into profile.normalize.
    // Keep the original compatibility: string input OR { description, answers }.
    let input: unknown = {};
    if (id === "profile.normalize") {
      input = answers ? { description, answers } : description;
    }

    ctx.logger.info({ msg: "node.start", id });
    const out: any = await node.run(input as any, ctx);

    // Convention: nodes may return { files: string[] }
    if (out && Array.isArray(out.files)) {
      files.push(...out.files);
    }
    ctx.logger.info({
      msg: "node.done",
      id,
      produced: Array.isArray(out?.files) ? out.files : [],
    });
  }

  return { orchestrationId, files };
}
