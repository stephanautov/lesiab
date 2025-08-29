"use strict";exports.id=851,exports.ids=[851],exports.modules={851:(a,b,c)=>{c.r(b),c.d(b,{UploadDirectNode:()=>e,default:()=>f});let d=a=>a.replace(/\r\n/g,"\n"),e={id:"upload.direct",phase:"execute",estimate:()=>({tokens:780,usd:.003}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo`,e=d(`// path: server/trpc/uploads.router.ts
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
`),f=[{path:`${c}/server/trpc/uploads.router.ts`,content:e},{path:`${c}/lib/upload.ts`,content:d(`// path: lib/upload.ts
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
`)},{path:`${c}/app/(protected)/uploads/page.tsx`,content:d(`// path: app/(protected)/uploads/page.tsx
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
`)}];for(let a of f)await b.storage.saveArtifact(a.path,a.content);return b.logger.info({msg:"upload.direct:written",files:f.map(a=>a.path),correlationId:b.correlationId}),{files:f.map(a=>a.path)}}},f=e}};