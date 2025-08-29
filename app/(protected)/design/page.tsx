// path: app/(protected)/design/page.tsx
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { api } from "../../../lib/trpc";

type UploadDownloadType = "audio" | "code" | "image" | "text" | "pdf" | "video";
const ALL_TYPES: UploadDownloadType[] = [
  "audio",
  "code",
  "image",
  "text",
  "pdf",
  "video",
];

type Answers = {
  targets: "mobile" | "desktop" | "both";
  uploads: { enabled: boolean; types: UploadDownloadType[] };
  downloads: { enabled: boolean; types: UploadDownloadType[] };
  business: {
    isBusiness: boolean;
    model?: "subscription" | "services" | "products";
  };
  audience: string;
};
type FormValues = { description: string; answers: Answers };

const defaultAnswers: Answers = {
  targets: "both",
  uploads: { enabled: false, types: [] },
  downloads: { enabled: false, types: [] },
  business: { isBusiness: false },
  audience: "",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b bg-gradient-to-r from-neutral-50 to-white px-4 py-2.5">
        <h2 className="text-sm font-medium tracking-wide text-neutral-700">
          {title}
        </h2>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </section>
  );
}

function Checkbox(props: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const { id, label, checked, onChange } = props;
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function Radio(props: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
}) {
  const { name, value, checked, onChange, label } = props;
  const id = `${name}-${value}`;
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        type="radio"
        name={name}
        className="h-4 w-4"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{label}</span>
    </label>
  );
}

function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 active:scale-[.99]"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function DesignPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { description: "", answers: defaultAnswers },
  });

  const preview = api.orchestration.preview.useMutation();
  const start = api.orchestration.start.useMutation();

  const a = watch("answers");
  const disabled = preview.isPending || start.isPending;

  const onPreview = (v: FormValues) =>
    preview.mutate({ description: v.description, answers: v.answers });
  const onGenerate = (v: FormValues) =>
    start.mutate({ description: v.description, answers: v.answers });

  // Commands
  const orc = start.data?.orchestrationId ?? "";
  const runId = start.data?.runId ?? "";
  const recordLatestCmd =
    orc && runId ? `pnpm lesiab:write-latest -- ${orc} ${runId}` : "";
  const latestCmd = `pnpm lesiab:materialize:latest`;
  const exactCmd =
    orc && runId
      ? `node scripts/materialize-from-storage.mjs ${orc} ${runId}`
      : "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Design & Generate</h1>
        <p className="text-sm text-neutral-600">
          Describe your app, preview normalized specs, then generate artifacts.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onGenerate)}
        className="grid gap-6 md:grid-cols-[1fr,380px]"
      >
        {/* Left column */}
        <div className="space-y-6">
          <Section title="1) Project description">
            <textarea
              {...register("description", { required: true, minLength: 5 })}
              className="w-full min-h-[200px] rounded border px-3 py-2 text-sm"
              placeholder="Example: A blog with posts and comments. Users can sign in, create posts, comment, and upload images."
            />
            {errors.description ? (
              <p className="text-xs text-red-600">
                Please write at least a short sentence.
              </p>
            ) : null}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSubmit(onPreview)}
                disabled={disabled}
                className="rounded border px-4 py-2 text-sm"
              >
                {preview.isPending ? "Previewing…" : "Preview spec"}
              </button>
              <button
                type="submit"
                disabled={start.isPending}
                className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {start.isPending ? "Generating…" : "Generate"}
              </button>
              <button
                type="button"
                onClick={() =>
                  reset({ description: "", answers: defaultAnswers })
                }
                disabled={disabled}
                className="rounded border px-4 py-2 text-sm"
              >
                Clear
              </button>
            </div>
          </Section>

          {preview.isSuccess ? (
            <Section title="Proposed profile.json (preview)">
              <pre className="max-h-96 overflow-auto rounded bg-neutral-50 p-3 text-xs">
                {JSON.stringify(preview.data.profile, null, 2)}
              </pre>
              <p className="text-xs text-neutral-600">
                Looks good? Click <b>Generate</b> to persist artifacts.
              </p>
            </Section>
          ) : null}

          {start.isSuccess ? (
            <Section title="Orchestration complete">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded border p-3 text-sm">
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium">orchestrationId:</span>{" "}
                      <code className="rounded bg-neutral-100 px-1.5 py-0.5">
                        {orc}
                      </code>
                    </div>
                    {runId ? (
                      <div>
                        <span className="font-medium">runId:</span>{" "}
                        <code className="rounded bg-neutral-100 px-1.5 py-0.5">
                          {runId}
                        </code>
                      </div>
                    ) : null}
                    <div>
                      <span className="font-medium">files:</span>{" "}
                      {start.data?.files?.length ?? 0}
                    </div>
                    <p className="mt-1 text-xs text-neutral-600">
                      Artifacts are saved to Supabase Storage bucket{" "}
                      <code>artifacts</code>.
                    </p>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-sm font-medium">
                        Record this run as latest
                      </p>
                      <pre className="mt-1 overflow-x-auto rounded bg-neutral-100 p-2 text-xs">
                        {recordLatestCmd || "# Generate to see this command"}
                      </pre>
                      {recordLatestCmd ? (
                        <CopyButton text={recordLatestCmd} />
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Materialize locally (latest)
                      </p>
                      <pre className="mt-1 overflow-x-auto rounded bg-neutral-100 p-2 text-xs">
                        {latestCmd}
                      </pre>
                      <CopyButton text={latestCmd} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Materialize locally (this exact run)
                      </p>
                      <pre className="mt-1 overflow-x-auto rounded bg-neutral-100 p-2 text-xs">
                        {exactCmd || "# Generate to see this command"}
                      </pre>
                      {exactCmd ? <CopyButton text={exactCmd} /> : null}
                    </div>
                  </div>
                </div>

                <div className="rounded border p-3">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium">
                      Show artifact paths
                    </summary>
                    <ul className="mt-2 max-h-60 overflow-auto list-disc pl-5 text-xs">
                      {(start.data?.files ?? []).map((p: string) => (
                        <li key={p}>
                          <code>{p}</code>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <div className="mt-3 text-xs text-neutral-600">
                    Tip: use the exact-run command for reproducibility, or
                    latest to always fetch the newest run for this
                    orchestration.
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <a
                  href="/posts"
                  className="text-sm underline underline-offset-2"
                >
                  Go to Posts →
                </a>
              </div>
            </Section>
          ) : null}

          {preview.isError ? (
            <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {String(preview.error?.message ?? "Preview failed")}
            </p>
          ) : null}
          {start.isError ? (
            <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {String(start.error?.message ?? "Generation failed")}
            </p>
          ) : null}
        </div>

        {/* Right column — questionnaire */}
        <div className="space-y-6">
          <Section title="2) Targets">
            <Controller
              control={control}
              name="answers.targets"
              render={({ field }) => (
                <div className="flex gap-4">
                  <Radio
                    name="targets"
                    value="mobile"
                    checked={field.value === "mobile"}
                    onChange={field.onChange}
                    label="Mobile"
                  />
                  <Radio
                    name="targets"
                    value="desktop"
                    checked={field.value === "desktop"}
                    onChange={field.onChange}
                    label="Desktop"
                  />
                  <Radio
                    name="targets"
                    value="both"
                    checked={field.value === "both"}
                    onChange={field.onChange}
                    label="Both"
                  />
                </div>
              )}
            />
          </Section>

          <Section title="3) Uploads">
            <Controller
              control={control}
              name="answers.uploads.enabled"
              render={({ field }) => (
                <Checkbox
                  id="uploads-enabled"
                  label="Enable uploads"
                  checked={!!field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {a.uploads.enabled ? (
              <Controller
                control={control}
                name="answers.uploads.types"
                render={({ field }) => {
                  const set = new Set<string>(field.value ?? []);
                  return (
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_TYPES.map((t) => (
                        <Checkbox
                          key={`up-${t}`}
                          id={`up-${t}`}
                          label={t}
                          checked={set.has(t)}
                          onChange={(checked) => {
                            const next = new Set<string>(field.value ?? []);
                            if (checked) next.add(t);
                            else next.delete(t);
                            field.onChange(Array.from(next));
                          }}
                        />
                      ))}
                    </div>
                  );
                }}
              />
            ) : null}
          </Section>

          <Section title="4) Downloads">
            <Controller
              control={control}
              name="answers.downloads.enabled"
              render={({ field }) => (
                <Checkbox
                  id="downloads-enabled"
                  label="Enable downloads"
                  checked={!!field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {a.downloads.enabled ? (
              <Controller
                control={control}
                name="answers.downloads.types"
                render={({ field }) => {
                  const set = new Set<string>(field.value ?? []);
                  return (
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_TYPES.map((t) => (
                        <Checkbox
                          key={`dl-${t}`}
                          id={`dl-${t}`}
                          label={t}
                          checked={set.has(t)}
                          onChange={(checked) => {
                            const next = new Set<string>(field.value ?? []);
                            if (checked) next.add(t);
                            else next.delete(t);
                            field.onChange(Array.from(next));
                          }}
                        />
                      ))}
                    </div>
                  );
                }}
              />
            ) : null}
          </Section>

          <Section title="5) Business & Audience">
            <Controller
              control={control}
              name="answers.business.isBusiness"
              render={({ field }) => (
                <Checkbox
                  id="is-business"
                  label="This is a business app"
                  checked={!!field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {a.business.isBusiness ? (
              <label className="block text-sm">
                Business model
                <select
                  {...register("answers.business.model")}
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                  defaultValue="subscription"
                >
                  <option value="subscription">Subscription</option>
                  <option value="services">Services</option>
                  <option value="products">Products</option>
                </select>
              </label>
            ) : null}

            <label className="block text-sm">
              Who will use your app?
              <textarea
                {...register("answers.audience")}
                className="mt-1 w-full min-h-[80px] rounded border px-3 py-2 text-sm"
                placeholder="e.g. public visitors, internal staff, paying customers"
              />
            </label>
          </Section>
        </div>
      </form>
    </main>
  );
}
