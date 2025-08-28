// path: lib/upload.ts
// Minimal client util to PUT a file to a signed URL (Storage).
export async function putToSignedUrl(url: string, file: File | Blob) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "content-type": file.type || "application/octet-stream" },
    body: file
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  return true;
}
