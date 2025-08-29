// path: app/(protected)/posts/page.tsx
"use client";

import * as React from "react";
import { api } from "../../../lib/trpc";
import { DataTable } from "../../../components/data-table";

export default function PostsListPage() {
  const { data, isLoading, isError, error } = api.posts.list.useQuery();

  if (isLoading)
    return <div className="p-6 text-sm text-neutral-600">Loading posts…</div>;
  if (isError) {
    return (
      <div className="p-6 rounded border border-red-300 bg-red-50 text-sm text-red-700">
        Failed to load posts: {String(error?.message ?? "Unknown error")}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Posts</h1>
      <p className="text-sm text-neutral-600">
        A simple, data-backed list generated from your orchestration.
      </p>
      <DataTable data={data ?? []} />
    </div>
  );
}
