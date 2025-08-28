// path: scripts/codegen-run.ts
import { buildCodegenFlow, type CodegenRequest } from "../lib/ai/flows/codegenFlow";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(_exec);

async function toolWriteFile({ path, content }: { path: string; content: string }) {
  const abs = resolve(process.cwd(), path);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, content, "utf8");
  return { ok: true as const };
}
async function toolFormatRepo() {
  await exec("pnpm format");
  return { ok: true as const };
}

async function main() {
  const req: CodegenRequest = {
    profile: { id: "app", entities: [{ name: "posts", table: "posts" }] },
    goals: ["scaffold posts list page & router"],
  };
  const flow = buildCodegenFlow({ writeFile: toolWriteFile, formatRepo: toolFormatRepo });
  const result = await flow.invoke(req);
  console.log("files:", result.synthesized.map(f => f.path));
}
main().catch((e) => { console.error(e); process.exit(1); });
