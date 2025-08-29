// path: scripts/write-latest.mjs
import { writeFile } from "node:fs/promises";

const [, , orc, runId] = process.argv;
if (!orc || !runId) {
  console.error("Usage: pnpm lesiab:write-latest -- <orchestrationId> <runId>");
  process.exit(1);
}

const payload = { orchestrationId: orc, runId };
await writeFile(
  ".lesiab-latest.json",
  JSON.stringify(payload, null, 2),
  "utf8",
);
console.log(`Wrote .lesiab-latest.json for ${orc} / ${runId}`);
