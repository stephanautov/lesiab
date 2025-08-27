// path: nodes/upload.direct.ts
/**
 * NODE: upload.direct
 * Phase: execute
 *
 * Purpose:
 *  - Provide a tRPC mutation to create a presigned upload URL (Storage bucket).
 *  - Provide a client util to PUT a file to the signed URL.
 *  - Provide a simple page using react-dropzone to pick and upload a file.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/server/trpc/uploads.router.ts
 *  - artifacts/${orc}/repo/lib/upload.ts
 *  - artifacts/${orc}/repo/app/(protected)/uploads/page.tsx
 *
 * Notes:
 *  - Does not modify server/trpc/router.ts to merge the router; you can inject via Hygen later.
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: { saveArtifact: (path: string, content: string | Uint8Array) => Promise<void> };
}
export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase:
    | "processResponses"
    | "analyze"
    | "validate"
    | "plan"
    | "execute"
    | "codeGeneration"
    | "integrate"
    | "finalize";
  estimate?: (input: I) => { tokens?: number; usd?: number };
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}
const lf = (s: string) => s.replace(/\r\n/g, "\n");

export const UploadDirectNode: NodeSpec<unknown, { files: string[] }> = {
  id: "upload.direct",
  phase: "execute",
  estimate: () => ({ tokens: 780, usd: 0.003 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const router = lf(`// path: server/trpc/uploads.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "./_trpc";
import { createPresignedUploadUrl } from "../../lib/storage";

export const uploadsRouter = createTRPCRouter({
  createUrl: protectedProcedure
    .input(z.object({ filename: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) throw new Error("Unauthorized");
      const { path, url } = await createPresignedUploadUrl(userId, input.filename);
      return { path, url };
    }),
});

// To merge, add to server/trpc/router.ts:
//   import { uploadsRouter } from "./uploads.router"; // hygen:routers-import
//   export const appRouter = createTRPCRouter({
//     health: healthRouter,
//     uploads: uploadsRouter,                          // hygen:routers-merge
//   });
`);

    const libUpload = lf(`// path: lib/upload.ts
// Minimal client util to PUT a file to a signed URL (Storage).
export async function putToSignedUrl(url: string, file: File | Blob) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "content-type": file.type || "application/octet-stream" },
    body: file
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(\`Upload failed (\${res.status}): \${text}\`);
  }
  return true;
}
`);

    const page = lf(`// path: app/(protected)/uploads/page.tsx
"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../../../lib/trpc";
import { putToSignedUrl } from "../../../lib/upload";
import { useToast } from "../../../components/ui/toast";

export default function UploadsPage() {
  const { push, element } = useToast();
  const createUrl = api.uploads.createUrl.useMutation();

  const onDrop = React.useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      try {
        const { url } = await createUrl.mutateAsync({ filename: file.name });
        await putToSignedUrl(url, file);
        push("Upload complete!");
      } catch (err: any) {
        push(String(err?.message ?? "Upload failed"));
      }
    },
    [createUrl, push]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="p-4 space-y-4">
      {element}
      <h1 className="text-lg font-semibold">Direct Uploads</h1>
      <div
        {...getRootProps()}
        className={"flex h-40 items-center justify-center rounded border border-dashed " + (isDragActive ? "bg-neutral-50" : "")}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop a file here, or click to select one</p>
      </div>
    </div>
  );
}
`);

    const files = [
      { path: `${root}/server/trpc/uploads.router.ts`, content: router },
      { path: `${root}/lib/upload.ts`, content: libUpload },
      { path: `${root}/app/(protected)/uploads/page.tsx`, content: page },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "upload.direct:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });
    return { files: files.map((f) => f.path) };
  },
};

export default UploadDirectNode;
