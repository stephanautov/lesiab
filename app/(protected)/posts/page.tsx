// path: app/(protected)/posts/page.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../lib/trpc";
import { DataTable } from "../../../components/data-table";

type CreateValues = { title: string; content?: string };

export default function PostsListPage() {
  const utils = api.useUtils();

  const list = api.posts.list.useQuery();
  const create = api.posts.create.useMutation({
    onSuccess: async () => {
      await utils.posts.list.invalidate();
      reset({ title: "", content: "" });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateValues>({ defaultValues: { title: "", content: "" } });

  const onSubmit = (v: CreateValues) => create.mutate(v);

  if (list.isLoading)
    return <div className="p-6 text-sm text-neutral-600">Loading posts…</div>;
  if (list.isError) {
    return (
      <div className="p-6 rounded border border-red-300 bg-red-50 text-sm text-red-700">
        Failed to load posts: {String(list.error?.message ?? "Unknown error")}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Posts</h1>
        <p className="text-sm text-neutral-600">
          Create a post, then see it appear in the table below.
        </p>
      </header>

      {/* Create form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded border p-4 space-y-3"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: true, minLength: 2 })}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            placeholder="My first post"
          />
          {errors.title ? (
            <p className="text-xs text-red-600 mt-1">Please enter a title.</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            {...register("content")}
            className="mt-1 w-full min-h-[100px] rounded border px-3 py-2 text-sm"
            placeholder="Optional content…"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {create.isPending ? "Saving…" : "Create"}
          </button>
          {create.isError ? (
            <span className="text-xs text-red-600">
              {String(create.error?.message ?? "Create failed")}
            </span>
          ) : null}
          {create.isSuccess ? (
            <span className="text-xs text-green-700">Saved.</span>
          ) : null}
        </div>
      </form>

      {/* List */}
      <DataTable data={list.data ?? []} />
    </div>
  );
}
