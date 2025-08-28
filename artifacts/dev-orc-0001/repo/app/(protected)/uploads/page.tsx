// path: app/(protected)/uploads/page.tsx
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
