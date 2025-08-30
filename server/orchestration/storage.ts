// path: server/orchestration/storage.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "../../env.mjs";

const BUCKET = "artifacts";
const BRACKET_SEG = /^\[(.+?)\]$/;

function encodeSegment(seg: string) {
  const m = seg.match(BRACKET_SEG);
  return m ? `_${m[1]}_` : seg;
}

function encodePathSegments(p: string) {
  return p.split("/").filter(Boolean).map(encodeSegment).join("/");
}

/**
 * Build a normalized, idempotent key for artifacts under:
 *   artifacts/<orc>/<runId>/<relPath>
 *
 * Rules:
 * - strip any leading "artifacts/"
 * - if path already begins with "<orc>/" or "<orc>/<runId>/", remove that prefix
 * - encode bracketed segments: [name] -> _name_
 */
function buildArtifactKey(
  orc: string,
  runId: string | undefined,
  relPath: string,
) {
  let rel = relPath.replace(/^\/+/, "").replace(/^artifacts\/+/, "");

  // If rel already starts with "<orc>/..." optionally "<runId>/..."
  if (rel.startsWith(`${orc}/`)) {
    rel = rel.slice(`${orc}/`.length);
    if (runId && rel.startsWith(`${runId}/`)) {
      rel = rel.slice(runId.length + 1);
    }
  }

  rel = encodePathSegments(rel);

  const prefix = [orc, runId].filter(Boolean).join("/");
  return prefix ? `${prefix}/${rel}` : `${orc}/${rel}`;
}

/**
 * Build a normalized key for refs under:
 *   artifacts/refs/<orc>/<relPath>
 */
function buildRefKey(orc: string, relPath: string) {
  let rel = relPath
    .replace(/^\/+/, "")
    .replace(/^artifacts\/+/, "")
    .replace(/^refs\/+/, "");
  rel = encodePathSegments(rel);
  return `refs/${orc}/${rel}`;
}

export function createArtifactStorage(orchestrationId: string, runId?: string) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  return {
    /** Save an artifact scoped to this orchestration/run. Returns the full storage key (with "artifacts/"). */
    async saveArtifact(relPath: string, content: string | Uint8Array) {
      const key = buildArtifactKey(orchestrationId, runId, relPath);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(key, content, { upsert: true });
      if (error)
        throw new Error(`Supabase upload failed (${key}): ${error.message}`);
      return { key: `artifacts/${key}` };
    },

    /** Save a "ref" (pointer) outside the run folder: artifacts/refs/<orc>/<relPath> */
    async saveRef(relPath: string, content: string | Uint8Array) {
      const key = buildRefKey(orchestrationId, relPath);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(key, content, { upsert: true });
      if (error)
        throw new Error(`Supabase upload failed (${key}): ${error.message}`);
      return { key: `artifacts/${key}` };
    },

    /** Expose the builders so callers can re-use if needed. */
    buildKey: (relPath: string) =>
      `artifacts/${buildArtifactKey(orchestrationId, runId, relPath)}`,
    buildRefKey: (relPath: string) =>
      `artifacts/${buildRefKey(orchestrationId, relPath)}`,
  };
}
