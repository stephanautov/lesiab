// path: app/(protected)/design/page.tsx
"use client";

import * as React from "react";
import { api } from "../../../lib/trpc";

type Mode = "deterministic" | "unique"; // <— remove "overwrite"

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b bg-gradient-to-r from-neutral-50 to-white px-5 py-3">
        <h2 className="text-sm font-medium tracking-wide text-neutral-700">{props.title}</h2>
      </div>
      <div className="p-5">{props.children}</div>
    </section>
  );
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {}
      }}
      className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 active:scale-[.99]"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function DesignPage() {
  const [description, setDescription] = React.useState(
    "A simple app with posts (title, content) that supports uploads."
  );
  const [mode, setMode] = React.useState<Mode>("deterministic");

  const preview = api.orchestration.preview.useMutation();
  const start = api.orchestration.start.useMutation();

  const disabled = preview.isPending || start.isPending;

  const onPreview = () => preview.mutate({ description });
  const onGenerate = () => start.mutate({ description, mode });

  const files = (start.data?.files ?? []) as string[];

  const latestCmd = start.data?.orchestrationId
    ? `pnpm lesiab:materialize:latest`
    : "";
  const exactCmd =
    start.data?.orchestrationId && start.data?.runId
      ? `node scripts/materialize-from-storage.mjs ${start.data.orchestrationId} ${start.data.runId}`
      : "";
  const recordLatestCmd =
    start.data?.orchestrationId && start.data?.runId
      ? `pnpm lesiab:write-latest -- ${start.data.orchestrationId} ${start.data.runId}`
      : "";

  return (
    <div className="mx-auto w-full max-w-4xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Design & Generate</h1>
        <p className="text-sm text-neutral-600">
          Describe your app, preview normalized specs, and generate a repo artifact set.
        </p>
      </header>

      {/* Input */}
      <Section title="Describe your app">
        <div className="space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[120px] rounded-lg border px-4 py-3 text-sm"
            placeholder="Describe the application you want to build…"
          />
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs text-neutral-600">Run mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="rounded-md border bg-white px-2 py-1 text-sm"
            >
              <option value="deterministic">deterministic (stable orc + history)</option>
              <option value="unique">unique (new orc per run)</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <button
                disabled={disabled}
                onClick={onPreview}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-60"
              >
                {preview.isPending ? "Previewing…" : "Preview"}
              </button>
              <button
                disabled={disabled}
                onClick={onGenerate}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {start.isPending ? "Generating…" : "Generate"}
              </button>
            </div>
          </div>

          {preview.isError ? (
            <p className="text-sm text-red-600">Preview failed: {String(preview.error?.message ?? "Unknown")}</p>
          ) : null}
          {start.isError ? (
            <p className="text-sm text-red-600">Generate failed: {String(start.error?.message ?? "Unknown")}</p>
          ) : null}
        </div>
      </Section>

      {/* Preview */}
      {preview.isSuccess ? (
        <Section title="Preview: normalized profile.json">
          <pre className="overflow-x-auto rounded-lg bg-neutral-50 p-4 text-xs leading-relaxed">
            {JSON.stringify(preview.data?.profile, null, 2)}
          </pre>
        </Section>
      ) : null}

      {/* Results */}
      {start.isSuccess ? (
        <Section title="Orchestration complete">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">orchestrationId:</span>{" "}
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5">{start.data?.orchestrationId}</code>
                </div>
                {start.data?.runId ? (
                  <div>
                    <span className="font-medium">runId:</span>{" "}
                    <code className="rounded bg-neutral-100 px-1.5 py-0.5">{start.data?.runId}</code>
                  </div>
                ) : null}
                <div>
                  <span className="font-medium">files:</span> {files.length}
                </div>
                <p className="mt-1 text-xs text-neutral-600">
                  Artifacts are saved to Supabase Storage bucket <code>artifacts</code>.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium">Record this run as latest</p>
                  <pre className="mt-1 overflow-x-auto rounded bg-neutral-100 p-2 text-xs">
                    {recordLatestCmd || "# run Generate to see this command"}
                  </pre>
                  {recordLatestCmd ? <CopyButton text={recordLatestCmd} /> : null}
                </div>

                <div>
                  <p className="text-sm font-medium">Materialize locally (latest)</p>
                  <pre className="mt-1 overflow-x-auto rounded bg-neutral-100 p-2 text-xs">
                    {latestCmd || "# run Generate to see this command"}
                  </pre>
                  {latestCmd ? <CopyButton text={latestCmd} /> : null}
                </div>

                <div>
                  <p className="text-sm font-medium">Materialize locally (this exact run)</p>
                  <pre className="mt-1 overflow-x-auto rounded bg-neutral-100 p-2 text-xs">
                    {exactCmd || "# run Generate to see this command"}
                  </pre>
                  {exactCmd ? <CopyButton text={exactCmd} /> : null}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <details>
                <summary className="cursor-pointer text-sm font-medium">Show artifact paths</summary>
                <ul className="mt-2 list-disc pl-5 text-xs">
                  {files.map((f) => (
                    <li key={f}>
                      <code>{f}</code>
                    </li>
                  ))}
                </ul>
              </details>
              <div className="mt-4 text-xs text-neutral-600">
                Tip: use the “exact run” command for reproducible materialization, or the “latest” command to always
                pull the newest run for this orchestration.
              </div>
            </div>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
