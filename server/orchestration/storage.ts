// path: server/orchestration/storage.ts
import { createClient } from "@supabase/supabase-js";

export type OrchestrationId = string;

export function createArtifactStorage(orchestrationId: OrchestrationId) {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;
  if (!url || !serviceKey) {
    throw new Error("Supabase credentials missing: set SUPABASE_URL and SUPABASE_SERVICE_ROLE");
  }

  const supa = createClient(url, serviceKey, { auth: { persistSession: false } });

  async function ensureBucket() {
    // Idempotent: ignore "Bucket already exists"
    const { error } = await supa.storage.createBucket("artifacts", { public: false });
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(`createBucket(artifacts) failed: ${error.message}`);
    }
  }

  return {
    async saveArtifact(path: string, content: string | Uint8Array) {
      await ensureBucket();
      // Accept caller paths like "artifacts/<id>/file" and store as "<id>/file" within the bucket
      const objectKey = path.replace(/^artifacts\/+/, "");
      const data = typeof content === "string" ? new TextEncoder().encode(content) : content;
      const contentType = typeof content === "string" ? "application/json; charset=utf-8" : "application/octet-stream";

      const { error } = await supa.storage.from("artifacts").upload(objectKey, data, {
        upsert: true,
        contentType,
      });
      if (error) {
        // Add a clearer message for the common 401 case
        if (/signature verification failed/i.test(error.message)) {
          throw new Error(
            "Supabase Storage auth failed: check SUPABASE_URL and SUPABASE_SERVICE_ROLE belong to the same project (and are set in this Vercel environment)."
          );
        }
        throw new Error(`Supabase upload failed (${objectKey}): ${error.message}`);
      }
    },
  };
}

export type ArtifactStorage = ReturnType<typeof createArtifactStorage>;
