"use client";
import * as React from "react";
import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type AnyRow = Record<string, unknown>;

export function DataTable({ data }: { data: AnyRow[] }) {
  const columns = useMemo<ColumnDef<AnyRow>[]>(() => {
    const first = data?.[0] || {};
    return Object.keys(first).map((k) => ({
      accessorKey: k,
      header: k,
      cell: (info) => String(info.getValue() ?? ""),
    }));
  }, [data]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) {
    return <div className="text-sm text-neutral-500">No data</div>;
  }

  return (
    <div className="overflow-auto rounded-md border">
      <table className="min-w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b bg-neutral-50">
              {hg.headers.map((h) => (
                <th key={h.id} className="px-3 py-2 text-left font-medium">
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-neutral-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
