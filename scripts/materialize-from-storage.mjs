// path: scripts/materialize-from-storage.mjs
/**
 * One-shot materializer:
 *  Downloads artifacts/<orc>/manifest.json, then fetches each storage object and
 *  writes it into the working repo at its original path (stripping the "repo/" prefix).
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... node scripts/materialize-from-storage.mjs <orchestrationId> [--dry]
 *
 * Notes:
 *  - Requires service role or a key with access to the "artifacts" bucket.
 *  - Recreates dynamic route segments: any path segment that looks like "_name_"
 *    will be written as "[name]" (reverse of the sanitizer used for Storage keys).
 */
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const [, , ORC, flagDry] = process.argv;
const DRY = flagDry === "--dry";
if (!ORC) {
  console.error(
    "Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... node scripts/materialize-from-storage.mjs <orchestrationId> [--dry]",
  );
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE");
  process.exit(1);
}
const supa = createClient(url, key, { auth: { persistSession: false } });

function desegment(seg) {
  // reverse the sanitizer rule for bracketed Next.js segments:
  // "_trpc_" -> "[trpc]", "_id_" -> "[id]"
  const m = /^_(.+)_$/.exec(seg);
  return m ? `[${m[1]}]` : seg;
}

function toLocalPath(originalPath) {
  // Strip "repo/" prefix; write into cwd
  const rel = originalPath.replace(/^repo\//, "");
  const parts = rel.split("/").map(desegment);
  return join(process.cwd(), parts.join("/"));
}

async function download(key) {
  const { data, error } = await supa.storage.from("artifacts").download(key);
  if (error) throw new Error(`download failed for ${key}: ${error.message}`);
  // Convert Blob to Buffer (Node 18+ has Blob)
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

(async function main() {
  const manifestKey = `${ORC}/manifest.json`;
  const { data: manifestBlob, error: mErr } = await supa.storage
    .from("artifacts")
    .download(manifestKey);
  if (mErr) {
    console.error(
      `Unable to download manifest ${manifestKey}: ${mErr.message}`,
    );
    process.exit(1);
  }
  const manifest = JSON.parse(await manifestBlob.text());

  console.log(
    `Materializing ${manifest.files.length} file(s) from orchestration ${manifest.orchestrationId} …`,
  );
  let wrote = 0;

  for (const entry of manifest.files) {
    const localPath = toLocalPath(entry.originalPath);
    const dir = dirname(localPath);

    if (DRY) {
      console.log(`[dry] ${entry.storageKey} -> ${localPath}`);
      continue;
    }

    await mkdir(dir, { recursive: true });
    const buf = await download(entry.storageKey);
    await writeFile(localPath, buf);
    console.log(`wrote ${localPath}`);
    wrote++;
  }

  if (!DRY)
    console.log(`Done. Wrote ${wrote} file(s). Commit and push your changes.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
