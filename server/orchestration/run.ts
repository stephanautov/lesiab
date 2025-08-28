// path: server/orchestration/run.ts
// Minimal runner that wires your NodeSpecs and executes a fixed plan.
// Uses Supabase Storage for artifacts and returns the file list.
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

// Try to load a node dynamically (safe on Vercel Node runtime)
async function loadNode(id: string): Promise<NodeSpec<any, any> | null> {
  const map: Record<string, () => Promise<any>> = {
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
    // Optional (include if you have it):
    "profile.normalize": () => import("../../nodes/profile.normalize"),
  };
  const loader = map[id];
  if (!loader) return null;
  try {
    const mod = await loader();
    return (mod.default || Object.values(mod)[0]) as NodeSpec<any, any>;
  } catch {
    return null;
  }
}

function stableId(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex").slice(0, 12);
}

export async function runOrchestration(description: string) {
  const orchestrationId = stableId(description || "app");
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

  // Fixed plan (skip gracefully if a node is missing)
  const plan = [
    "profile.normalize", // optional, if present it will emit profile.json
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
    const input = id === "profile.normalize" ? { text: description } : {};
    ctx.logger.info({ msg: "node.start", id });
    const out: any = await node.run(input, ctx);
    const produced = Array.isArray(out?.files) ? out.files : [];
    files.push(...produced);
    ctx.logger.info({ msg: "node.done", id, produced });
  }

  return { orchestrationId, files };
}
