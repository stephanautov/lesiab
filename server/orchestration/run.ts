// path: server/orchestration/run.ts
import crypto from "node:crypto";
import { createArtifactStorage } from "./storage";

/* ────────────────────────────────────────────────────────────────────────────
   Shared lightweight contracts (align EXACTLY with node expectations)
   ──────────────────────────────────────────────────────────────────────────── */

export type NodePhase =
  | "processResponses"
  | "analyze"
  | "validate"
  | "plan"
  | "execute"
  | "codeGeneration"
  | "integrate"
  | "finalize";

export type NodeId = string;
export type OrchestrationId = string;
export type Mode = "deterministic" | "unique";

export interface ExecutionLogger {
  info(m: any): void;
  warn(m: any): void;
  error(m: any): void;
}

/** Must match nodes’ expectation: correlationId is REQUIRED; saveArtifact returns Promise<void> */
export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: ExecutionLogger;
  storage: {
    saveArtifact: (
      relPath: string,
      content: string | Uint8Array,
    ) => Promise<void>;
  };
}

export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase: NodePhase;
  estimate?: (input: I) => { tokens?: number; usd?: number };
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}

type NodeOutputWithFiles = { files?: string[] };
type RunResult = { orchestrationId: string; runId: string; files: string[] };

/* ────────────────────────────────────────────────────────────────────────────
   Small helpers
   ──────────────────────────────────────────────────────────────────────────── */

function stableStringify(x: unknown) {
  // stable stringify for hashing
  return JSON.stringify(x, Object.keys(x as any).sort());
}
function sha12(x: unknown) {
  return crypto
    .createHash("sha256")
    .update(stableStringify(x))
    .digest("hex")
    .slice(0, 12);
}
function newRunId(): string {
  const iso = new Date().toISOString().replace(/[:.]/g, "_");
  const slug = Math.random().toString(36).slice(2, 8);
  return `${iso}-${slug}`;
}

/* ────────────────────────────────────────────────────────────────────────────
   DAG plan + dynamic node loader (adjust paths if you move node files)
   ──────────────────────────────────────────────────────────────────────────── */

const PLAN: NodeId[] = [
  "profile.normalize",

  "trpc.server",
  "rest.public",

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

/** Map node id → default-exported NodeSpec */
const NODE_LOADERS: Record<NodeId, () => Promise<NodeSpec<any, any>>> = {
  "profile.normalize": async () =>
    (await import("../../nodes/profile.normalize")).default,

  "trpc.server": async () => (await import("../../nodes/trpc.server")).default,
  "rest.public": async () => (await import("../../nodes/rest.public")).default,

  "next.app.router": async () =>
    (await import("../../nodes/next.app.router")).default,

  "upload.direct": async () =>
    (await import("../../nodes/upload.direct")).default,

  "ai.openai.setup": async () =>
    (await import("../../nodes/ai.openai.setup")).default,
  "ai.anthropic.setup": async () =>
    (await import("../../nodes/ai.anthropic.setup")).default,
  "ai.langgraph.flow": async () =>
    (await import("../../nodes/ai.langgraph.flow")).default,

  "ai.embedder": async () => (await import("../../nodes/ai.embedder")).default,

  "realtime.client": async () =>
    (await import("../../nodes/realtime.client")).default,

  "ui.screens": async () => (await import("../../nodes/ui.screens")).default,

  "vercel.config": async () =>
    (await import("../../nodes/vercel.config")).default,
  "monitoring.basics": async () =>
    (await import("../../nodes/monitoring.basics")).default,

  "github.setup": async () =>
    (await import("../../nodes/github.setup")).default,
  "deploy.docs": async () => (await import("../../nodes/deploy.docs")).default,
};

/* ────────────────────────────────────────────────────────────────────────────
   Backward-compatible API (simple positional signature used by your router)
   ────────────────────────────────────────────────────────────────────────────
   Callers: runOrchestration(orcId, mode, { description, answers? })
   This function collects artifact keys (even if nodes don’t return files[])
   and writes:
     - artifacts/<orc>/<runId>/manifest.json
     - artifacts/refs/<orc>/latest.json
   without changing node contracts.
   ──────────────────────────────────────────────────────────────────────────── */

export async function runOrchestration(
  orchestrationId: string,
  mode: Mode,
  input: { description: string; answers?: unknown },
): Promise<RunResult> {
  // Resolve IDs
  const orc: OrchestrationId =
    orchestrationId ||
    sha12({
      description: input.description ?? "",
      answers: input.answers ?? null,
    });
  const runId =
    mode === "unique"
      ? newRunId()
      : sha12({
          description: input.description ?? "",
          answers: input.answers ?? null,
        });

  // Low-level storage (has saveArtifact, saveRef, buildKey)
  const storage = createArtifactStorage(orc, runId);

  // Collect exact object keys we upload to (for manifest)
  const producedKeys: string[] = [];

  // Wrap saveArtifact to collect keys; keep the node-expected signature (Promise<void>)
  const wrappedSave: ExecutionContext["storage"]["saveArtifact"] = async (
    relPath,
    content,
  ) => {
    await storage.saveArtifact(relPath, content);
    // Prefer builder if available, else reconstruct deterministic key
    const key =
      typeof storage.buildKey === "function"
        ? storage.buildKey(relPath)
        : `artifacts/${orc}/${runId}/${relPath.replace(/^\/+/, "")}`;
    producedKeys.push(key);
  };

  const logger: ExecutionLogger = {
    info: (m) => console.log("[orc]", m),
    warn: (m) => console.warn("[orc]", m),
    error: (m) => console.error("[orc]", m),
  };

  // Context that exactly matches what nodes were compiled against
  const ctx: ExecutionContext = {
    orchestrationId: orc,
    correlationId: runId, // REQUIRED (string)
    logger,
    storage: { saveArtifact: wrappedSave },
  };

  // Execute plan; also collect any node-reported files[]
  const filesFromNodes: string[] = [];
  for (const id of PLAN) {
    try {
      logger.info({ msg: "node.start", id });
      const loader = NODE_LOADERS[id];
      if (!loader) {
        logger.warn({ msg: "node.loader_missing", id });
        continue;
      }
      const node = await loader();
      const out = (await node.run(input, ctx)) as
        | NodeOutputWithFiles
        | undefined;
      if (out?.files?.length) filesFromNodes.push(...out.files);
      logger.info({ msg: "node.done", id, produced: out?.files ?? [] });
    } catch (err: any) {
      logger.error({
        msg: "node.error",
        id,
        error: err?.message ?? String(err),
      });
      // MVP: keep going so one failed node doesn’t stop others
    }
  }

  // Finalize manifest: union(node-reported, collected-by-wrapper)
  const allKeys = Array.from(
    new Set([...filesFromNodes, ...producedKeys]),
  ).sort();

  // Write manifest into the RUN folder
  await wrappedSave(
    "manifest.json",
    Buffer.from(
      JSON.stringify({ orchestrationId: orc, runId, files: allKeys }, null, 2),
    ),
  );

  // Write a stable "latest" pointer OUTSIDE the run folder
  await storage.saveRef(
    "latest.json",
    Buffer.from(
      JSON.stringify(
        {
          runId,
          manifestPath: `artifacts/${orc}/${runId}/manifest.json`,
          files: allKeys.length,
        },
        null,
        2,
      ),
    ),
  );

  logger.info({
    msg: "orchestration.done",
    orchestrationId: orc,
    runId,
    files: allKeys.length,
  });

  return { orchestrationId: orc, runId, files: allKeys };
}
