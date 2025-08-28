// path: server/orchestration/storage.ts
// Supabase Storage backend for node artifacts (bucket: "artifacts")
import { createClient } from "@supabase/supabase-js";

export type OrchestrationId = string;

export function createArtifactStorage(orchestrationId: OrchestrationId) {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;
  const supa = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  async function ensureBucket() {
    // idempotent: ignore if exists
    await supa.storage
      .createBucket("artifacts", { public: false })
      .catch(() => {});
  }

  return {
    async saveArtifact(path: string, content: string | Uint8Array) {
      await ensureBucket();
      const key = path; // we store the full artifacts/<orc>/... path for clarity
      const data =
        typeof content === "string"
          ? new TextEncoder().encode(content)
          : content;
      const contentType =
        typeof content === "string"
          ? "text/plain; charset=utf-8"
          : "application/octet-stream";
      const { error } = await supa.storage.from("artifacts").upload(key, data, {
        upsert: true,
        contentType,
      });
      if (error) throw new Error(error.message);
    },
  };
}

export type ArtifactStorage = ReturnType<typeof createArtifactStorage>;
