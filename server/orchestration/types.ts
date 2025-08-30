// path: server/orchestration/types.ts

/** Phases a node can participate in */
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
export type RunId = string;

export interface ExecutionLogger {
  info(m: any): void;
  warn(m: any): void;
  error(m: any): void;
}

/**
 * Artifact storage API available to nodes.
 * `saveArtifact` writes into artifacts/<orc>/<runId>/...
 * `saveRef` writes into artifacts/refs/<orc>/...
 * Both return the exact storage key used (prefixed with "artifacts/").
 */
export interface ArtifactStorage {
  saveArtifact(
    relPath: string,
    content: string | Uint8Array,
  ): Promise<{ key: string }>;
  saveRef(
    relPath: string,
    content: string | Uint8Array,
  ): Promise<{ key: string }>;
  // Optional helpers (some engines expose these)
  buildKey?: (relPath: string) => string;
  buildRefKey?: (relPath: string) => string;
}

/** Context handed to every node by the engine */
export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  runId?: RunId;
  correlationId?: string;
  logger: ExecutionLogger;
  storage: ArtifactStorage;
}

/** Optional cost/time estimate */
export type NodeEstimate<I = unknown> = (input: I) => {
  tokens?: number;
  usd?: number;
};

/** Canonical node spec */
export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase: NodePhase;
  estimate?: NodeEstimate<I>;
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}

/** Optional common output field used by some nodes */
export type NodeOutputWithFiles = { files?: string[] };

/** Manifest shape written at the end of a run */
export interface RunManifest {
  orchestrationId: OrchestrationId;
  runId: RunId;
  files: string[]; // fully-qualified storage keys (start with "artifacts/")
}
