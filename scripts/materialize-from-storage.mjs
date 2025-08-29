// path: scripts/materialize-from-storage.mjs
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const [, , ORC, RUN] = process.argv;
if (!ORC) {
  console.error(
    "Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... node scripts/materialize-from-storage.mjs <orchestrationId> [runId] [--dry]",
  );
  process.exit(1);
}
const DRY = process.argv.includes("--dry");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE");
  process.exit(1);
}
const supa = createClient(url, key, { auth: { persistSession: false } });

function desegment(seg) {
  const m = /^_(.+)_$/.exec(seg);
  return m ? `[${m[1]}]` : seg;
}
function toLocalPath(originalPath) {
  const rel = originalPath.replace(/^repo\//, "");
  return join(process.cwd(), rel.split("/").map(desegment).join("/"));
}

async function download(key) {
  const { data, error } = await supa.storage.from("artifacts").download(key);
  if (error) throw new Error(`download failed for ${key}: ${error.message}`);
  const buf = Buffer.from(await data.arrayBuffer());
  return buf;
}

async function resolveManifestKey(orc, run) {
  if (run) return `${orc}/${run}/manifest.json`;
  // Try refs/<orc>/latest.json
  const latestKey = `refs/${orc}/latest.json`;
  const latest = await supa.storage.from("artifacts").download(latestKey);
  if (!latest.error) {
    const { runId, manifestPath } = JSON.parse(await latest.data.text());
    return manifestPath
      ? manifestPath.replace(/^artifacts\//, "")
      : `${orc}/${runId}/manifest.json`;
  }
  // Fallback for legacy: <orc>/manifest.json
  return `${orc}/manifest.json`;
}

(async function main() {
  const manifestKey = await resolveManifestKey(ORC, RUN);
  const m = await supa.storage.from("artifacts").download(manifestKey);
  if (m.error) {
    console.error(
      `Unable to download manifest ${manifestKey}: ${m.error.message}`,
    );
    process.exit(1);
  }
  const manifest = JSON.parse(await m.data.text());

  console.log(
    `Materializing ${manifest.files.length} file(s) from orchestration ${manifest.orchestrationId}${manifest.runId ? " / " + manifest.runId : ""} …`,
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
