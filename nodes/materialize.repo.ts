// path: nodes/materialize.repo.ts
/**
 * NODE: materialize.repo
 * Phase: integrate
 *
 * Purpose:
 *  - Produce a manifest that maps original "repo/**" artifact paths to the exact
 *    sanitized Storage object keys, so a local script can pull and write them into
 *    the working repo deterministically.
 *
 * Input: { files: string[] }  // list returned by runOrchestration (paths like "repo/app/.../page.tsx")
 * Output:
 *  - artifacts/<orc>/manifest.json (with [{ originalPath, storageKey }])
 *  - return { manifestPath, count }
 *
 * NOTE: We cannot write to the deployed repo on Vercel. This node prepares the
 *       manifest; the companion script (scripts/materialize-from-storage.mjs)
 *       performs the local checkout merge.
 */
import type { NodeSpec } from "../server/orchestration/run"; // If path differs, inline the type
type ExecutionContext = {
  orchestrationId: string;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: {
    saveArtifact: (path: string, content: string | Uint8Array) => Promise<void>;
  };
};

function toPosixPath(p: string) {
  return p.replace(/\\/g, "/");
}
function stripArtifactsPrefix(p: string) {
  return p.replace(/^artifacts\/+/, "");
}
// Use the SAME sanitizer as server/orchestration/storage.ts to compute object keys.
function sanitizeKey(p: string) {
  let key = toPosixPath(stripArtifactsPrefix(p)).trim();
  key = key.replace(/^\/+|\/+$/g, "");
  key = key
    .split("/")
    .filter((seg) => seg !== "." && seg !== ".." && seg !== "")
    .join("/");
  key = key
    .split("/")
    .map((seg) =>
      seg.replace(/\s+/g, "-").replace(/[\[\]\?#&<>:"%\\{}|\^~`]/g, "_"),
    )
    .join("/");
  if (!key) key = "artifact";
  if (key.length > 900) key = key.slice(0, 900);
  return key;
}
function stableStringify(obj: unknown) {
  const seen = new WeakSet();
  const sort = (v: any): any => {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v)) return v;
    seen.add(v);
    if (Array.isArray(v)) return v.map(sort);
    const out: Record<string, any> = {};
    for (const k of Object.keys(v).sort()) out[k] = sort(v[k]);
    return out;
  };
  return JSON.stringify(sort(obj), null, 2) + "\n";
}

type Input = { files?: string[]; runId?: string };

const MaterializeRepoNode: NodeSpec<
  Input,
  { manifestPath: string; count: number }
> = {
  id: "materialize.repo",
  phase: "integrate",
  async run(input, ctx) {
    const repoFiles = (input?.files ?? []).filter((p) => p.startsWith("repo/"));
    const runId = input?.runId ? `/${input.runId}` : "";

    const entries = repoFiles.map((originalPath) => {
      const storageKey = sanitizeKey(
        `artifacts/${ctx.orchestrationId}${runId}/${originalPath}`,
      );
      return { originalPath, storageKey };
    });

    const manifest = {
      orchestrationId: ctx.orchestrationId,
      runId: input?.runId ?? null,
      files: entries,
    };

    // Write manifest for this run
    const manifestPath = `artifacts/${ctx.orchestrationId}${runId}/manifest.json`;
    await ctx.storage.saveArtifact(manifestPath, stableStringify(manifest));
    ctx.logger.info({
      msg: "materialize.repo:manifest_written",
      path: manifestPath,
      count: entries.length,
    });

    // ALSO write/update a "latest" pointer outside the run folder
    // Important: use a path that does NOT match the run injection rule in storage.ts
    const latestPath = `artifacts/refs/${ctx.orchestrationId}/latest.json`;
    const latest = {
      orchestrationId: ctx.orchestrationId,
      runId: input?.runId ?? null,
      manifestPath,
    };
    await ctx.storage.saveArtifact(latestPath, stableStringify(latest));
    ctx.logger.info({
      msg: "materialize.repo:latest_written",
      path: latestPath,
    });

    return { manifestPath, count: entries.length };
  },
};

export default MaterializeRepoNode;
