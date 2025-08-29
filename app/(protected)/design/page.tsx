// path: app/(protected)/design/page.tsx
"use client";

import * as React from "react";
import { useForm, Controller, type FieldValues } from "react-hook-form";
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
    <section className="rounded border p-4">
      <h2 className="mb-2 font-medium">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Checkbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function Radio({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
}) {
  const id = `${name}-${value}`;
  return (
    <label htmlFor={id} className="flex items-center gap-2">
      <input
        id={id}
        type="radio"
        name={name}
        className="h-4 w-4"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="text-sm">{label}</span>
    </label>
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

  const onPreview = (v: FormValues) =>
    preview.mutate({ description: v.description, answers: v.answers });
  const onGenerate = (v: FormValues) =>
    start.mutate({ description: v.description, answers: v.answers });

  const a = watch("answers");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Describe your application</h1>
      <p className="text-sm text-neutral-600">
        Tell LESiAB what you want to build. We’ll normalize your description
        into a canonical spec and generate deterministic artifacts.
      </p>

      <form
        onSubmit={handleSubmit(onGenerate)}
        className="grid gap-6 md:grid-cols-[1fr,380px]"
      >
        {/* Left: Description + actions */}
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
                disabled={preview.isPending || start.isPending}
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
                className="rounded border px-4 py-2 text-sm"
                disabled={start.isPending || preview.isPending}
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
                Looks good? Click <b>Generate</b> to run the full pipeline
                (artifacts will be persisted).
              </p>
            </Section>
          ) : null}

          {start.isSuccess ? (
            <Section title="Orchestration complete">
              <div className="space-y-1 text-sm text-neutral-700">
                <p>
                  <span className="font-mono">orc:</span>{" "}
                  {start.data.orchestrationId}
                </p>
                <p>
                  <span className="font-mono">files:</span>{" "}
                  {start.data.files.length}
                </p>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm underline">
                  Show artifact paths
                </summary>
                <ul className="mt-2 max-h-60 overflow-auto text-xs">
                  {start.data.files.map((p: string) => (
                    <li key={p} className="font-mono">
                      {p}
                    </li>
                  ))}
                </ul>
              </details>
              <p className="mt-3 text-xs text-neutral-500">
                Artifacts are saved to Supabase Storage bucket{" "}
                <code>artifacts</code>.
              </p>
              <div className="mt-3">
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

        {/* Right: Questionnaire */}
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
