// path: server/orchestration/storage.ts
import { createClient } from "@supabase/supabase-js";

export type OrchestrationId = string;

function toPosixPath(p: string) {
  return p.replace(/\\/g, "/");
}
function stripArtifactsPrefix(p: string) {
  return p.replace(/^artifacts\/+/, "");
}
function sanitizeSegment(seg: string) {
  return seg.replace(/\s+/g, "-").replace(/[\[\]\?#&<>:"%\\{}|\^~`]/g, "_");
}
function sanitizeKey(p: string) {
  let key = toPosixPath(stripArtifactsPrefix(p)).trim();
  key = key.replace(/^\/+|\/+$/g, "");
  key = key
    .split("/")
    .filter((s) => s && s !== "." && s !== "..")
    .map(sanitizeSegment)
    .join("/");
  if (!key) key = "artifact";
  if (key.length > 900) key = key.slice(0, 900);
  return key;
}

function inferContentType(key: string, isString: boolean) {
  const ext = key.split(".").pop()?.toLowerCase();
  if (ext === "json") return "application/json; charset=utf-8";
  if (ext === "md") return "text/markdown; charset=utf-8";
  if (
    [
      "ts",
      "tsx",
      "js",
      "jsx",
      "sql",
      "sh",
      "txt",
      "ejs",
      "env",
      "toml",
      "yaml",
      "yml",
      "cjs",
      "mjs",
    ].includes(ext ?? "")
  ) {
    return "text/plain; charset=utf-8";
  }
  return isString ? "text/plain; charset=utf-8" : "application/octet-stream";
}

export function createArtifactStorage(
  orchestrationId: OrchestrationId,
  runId?: string,
) {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;
  if (!url || !serviceKey) throw new Error("Supabase credentials missing");

  const supa = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  async function ensureBucket() {
    const { error } = await supa.storage.createBucket("artifacts", {
      public: false,
    });
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(`createBucket(artifacts) failed: ${error.message}`);
    }
  }

  return {
    async saveArtifact(path: string, content: string | Uint8Array) {
      await ensureBucket();
      // Insert runId after <orc>/ if provided: artifacts/<orc>/<runId>/...
      const stripped = stripArtifactsPrefix(path);
      const withRun = stripped.replace(
        new RegExp(`^${orchestrationId}/`),
        runId
          ? `${orchestrationId}/${sanitizeSegment(runId)}/`
          : `${orchestrationId}/`,
      );
      const objectKey = sanitizeKey(withRun);
      const data =
        typeof content === "string"
          ? new TextEncoder().encode(content)
          : content;
      const contentType = inferContentType(
        objectKey,
        typeof content === "string",
      );
      const { error } = await supa.storage
        .from("artifacts")
        .upload(objectKey, data, {
          upsert: true,
          contentType,
        });
      if (error) {
        if (/signature verification failed/i.test(error.message)) {
          throw new Error(
            "Supabase Storage auth failed: check SUPABASE_URL and SUPABASE_SERVICE_ROLE.",
          );
        }
        throw new Error(
          `Supabase upload failed (${objectKey}): ${error.message}`,
        );
      }
    },
  };
}

export type ArtifactStorage = ReturnType<typeof createArtifactStorage>;
