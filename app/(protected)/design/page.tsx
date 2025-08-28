// path: app/(protected)/design/page.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../lib/trpc";

type FormValues = { description: string };

export default function DesignPage() {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: { description: "" },
  });
  const start = api.orchestration.start.useMutation();

  const onSubmit = (values: FormValues) => {
    start.mutate({ description: values.description });
  };

  const isWorking = start.isPending;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Describe your application</h1>
      <p className="text-sm text-neutral-600">
        Tell LESiAB what you want to build. We’ll scaffold a repo and artifacts deterministically.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <label className="block text-sm font-medium">Project description</label>
        <textarea
          {...register("description", { required: true, minLength: 5 })}
          className="w-full min-h-[160px] rounded border px-3 py-2 text-sm"
          placeholder="Example: A blog with posts and comments. Users can sign in, create posts, and comment. I want a posts table (title, content) and comments table (post_id, body)."
        />
        {formState.errors.description ? (
          <p className="text-xs text-red-600">Please write at least a short sentence.</p>
        ) : null}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isWorking}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isWorking ? "Generating…" : "Generate"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded border px-4 py-2 text-sm"
            disabled={isWorking}
          >
            Clear
          </button>
        </div>
      </form>

      {start.isSuccess ? (
        <section className="rounded border p-4">
          <h2 className="mb-2 font-medium">Orchestration complete</h2>
          <p className="text-sm text-neutral-700">
            <span className="font-mono">orc:</span> {start.data.orchestrationId}
          </p>
          <p className="text-sm text-neutral-700">
            <span className="font-mono">files:</span> {start.data.files.length}
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm underline">Show artifact paths</summary>
            <ul className="mt-2 max-h-60 overflow-auto text-xs">
              {start.data.files.map((p) => (
                <li key={p} className="font-mono">{p}</li>
              ))}
            </ul>
          </details>
          <p className="mt-3 text-xs text-neutral-500">
            Artifacts are saved to Supabase Storage bucket <code>artifacts</code>. You can pull them
            into the repo with your existing materializer, or review via Supabase.
          </p>
        </section>
      ) : null}

      {start.isError ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {String(start.error?.message ?? "Something went wrong")}
        </p>
      ) : null}
    </main>
  );
}
