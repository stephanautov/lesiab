// path: lib/storage.ts
// Server utilities for presigned upload/download URLs.
// Only import on the server.
import { createClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";

const BUCKET = "user-uploads";

function serviceClient() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
}

/** Create a presigned upload URL for a user-owned path. */
export async function createPresignedUploadUrl(userId: string, filename: string) {
  const key = `${userId}/${filename}`;
  const supa = serviceClient();
  const { data, error } = await supa.storage.from(BUCKET).createSignedUploadUrl(key);
  if (error || !data) throw new Error(error?.message ?? "Failed to create signed upload URL");
  return { path: key, url: data.signedUrl };
}

/** Create a presigned download URL. */
export async function createPresignedDownloadUrl(path: string, expiresInSeconds = 60 * 10) {
  const supa = serviceClient();
  const { data, error } = await supa.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw new Error(error?.message ?? "Failed to create signed download URL");
  return data.signedUrl;
}
