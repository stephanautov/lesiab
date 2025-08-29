// path: server/orchestration/run.ts
import crypto from "node:crypto";
import { createArtifactStorage } from "./storage";
export type ExecutionContext = {
  orchestrationId: string;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: ReturnType<typeof createArtifactStorage>;
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
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
};

// ────────────────────────────────────────────────────────────────────────────
// Helper: encode dynamic route segments for storage keys, e.g. [trpc] → _trpc_
// (Matches what our materializer expects; avoids "Invalid key" errors)
const BRACKET_SEG = /^\[(.+?)\]$/;
function encodePathForStorage(relPath: string): string {
  return relPath
    .replace(/^\/+/, "")
    .split("/")
    .map((seg) => {
      const m = seg.match(BRACKET_SEG);
      return m ? `_${m[1]}_` : seg;
    })
    .join("/");
}

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
    "materialize.repo": () => import("../../nodes/materialize.repo"),
    "vercel.config": () => import("../../nodes/vercel.config"),
    "monitoring.basics": () => import("../../nodes/monitoring.basics"),
    "github.setup": () => import("../../nodes/github.setup"),
    "deploy.docs": () => import("../../nodes/deploy.docs"),
  };
  try {
    const mod = await (map[id]?.() ?? Promise.reject());
    return (mod.default || Object.values(mod)[0]) as NodeSpec<any, any>;
  } catch {
    return null;
  }
}

function sha12(obj: unknown) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(obj))
    .digest("hex")
    .slice(0, 12);
}
function newRunId() {
  const iso = new Date().toISOString().replace(/:/g, "_");
  const nonce = Math.random().toString(36).slice(2, 8);
  return `${iso}-${nonce}`;
}

export async function runOrchestration(
  description: string,
  answers?: unknown,
  mode: "deterministic" | "unique" = "deterministic",
) {
  // Deterministic orc id derived from description + answers (so content changes → new orc)
  const orchestrationId = sha12({ description, answers });
  // Each run gets its own subfolder
  const runId =
    mode === "unique"
      ? `${sha12({ t: Date.now(), r: Math.random() })}`
      : newRunId();

  const storage = createArtifactStorage(orchestrationId, runId);
  // Collect every uploaded artifact key (even if nodes don't return out.files)
  const producedKeys: string[] = [];
  const baseSave = storage.saveArtifact.bind(storage);
  (storage as any).saveArtifact = async (
    relPath: string,
    content: string | Uint8Array,
  ) => {
    const res = await baseSave(relPath, content);
    // Build the exact storage key we (and the materializer) will reference
    const encoded = encodePathForStorage(relPath.replace(/^artifacts\/+/, ""));
    const key = `artifacts/${orchestrationId}/${runId}/${encoded}`;
    producedKeys.push(key);
    return res;
  };

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
    "materialize.repo",
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

    let input: unknown = {};
    if (id === "profile.normalize")
      input = answers ? { description, answers } : description;
    if (id === "materialize.repo") input = { files, runId };

    ctx.logger.info({ msg: "node.start", id });
    const out: any = await node.run(input as any, ctx);
    if (out && Array.isArray(out.files)) files.push(...out.files);
    ctx.logger.info({
      msg: "node.done",
      id,
      produced: Array.isArray(out?.files) ? out.files : [],
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Finalize: write manifest with *all* files (collected + node-reported)
  const all = Array.from(new Set([...files, ...producedKeys])).sort();
  const manifest = { orchestrationId, runId, files: all };
  await storage.saveArtifact(
    "manifest.json",
    Buffer.from(JSON.stringify(manifest, null, 2)),
  );
  await storage.saveArtifact(
    `refs/${orchestrationId}/latest.json`,
    Buffer.from(
      JSON.stringify(
        {
          runId,
          manifestPath: `artifacts/${orchestrationId}/${runId}/manifest.json`,
          files: all.length,
        },
        null,
        2,
      ),
    ),
  );
  return { orchestrationId, runId, files: all };
}
