// path: scripts/materialize-artifacts.ts
/* eslint-disable no-console */
import { promises as fs } from "fs";
import * as path from "path";

async function exists(p: string) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src: string, dst: string, force = false) {
  await fs.mkdir(dst, { recursive: true });
  const items = await fs.readdir(src, { withFileTypes: true });
  for (const it of items) {
    const s = path.join(src, it.name);
    const d = path.join(dst, it.name);
    if (it.isDirectory()) {
      await copyDir(s, d, force);
    } else {
      if (!force && (await exists(d))) {
        console.log(`skip (exists): ${d}`);
        continue;
      }
      const buf = await fs.readFile(s);
      await fs.mkdir(path.dirname(d), { recursive: true });
      await fs.writeFile(d, buf);
      console.log(`wrote: ${d}`);
    }
  }
}

async function main() {
  const orcId = process.env.ORC_ID ?? "dev-orc-0001";
  const force = process.argv.includes("--force");
  const src = path.resolve(`artifacts/${orcId}/repo`);
  const dst = path.resolve(".");
  if (!(await exists(src))) {
    console.error(
      `Artifacts not found at ${src}. Run scripts/dev-run.ts first.`,
    );
    process.exit(1);
  }
  console.log(`Materializing from ${src} -> ${dst} ${force ? "(force)" : ""}`);
  await copyDir(src, dst, force);
  console.log("✔ Materialization complete");
}

main().catch((err) => {
  console.error("Materializer failed:", err);
  process.exit(1);
});
