// path: nodes/ui.datatable.ts
/**
 * NODE: ui.datatable
 * Phase: execute
 *
 * Purpose:
 *  - Provide a minimal reusable DataTable for list pages using @tanstack/react-table.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/components/data-table.tsx
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: {
    saveArtifact: (path: string, content: string | Uint8Array) => Promise<void>;
  };
}
export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase:
    | "processResponses"
    | "analyze"
    | "validate"
    | "plan"
    | "execute"
    | "codeGeneration"
    | "integrate"
    | "finalize";
  estimate?: (input: I) => { tokens?: number; usd?: number };
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}

const lf = (s: string) => s.replace(/\r\n/g, "\n");

export const UiDataTableNode: NodeSpec<unknown, { files: string[] }> = {
  id: "ui.datatable",
  phase: "execute",
  estimate: () => ({ tokens: 220, usd: 0.001 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo/components`;

    const dataTable = lf(`"use client";
import * as React from "react";
import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

type AnyRow = Record<string, unknown>;

export function DataTable({ data }: { data: AnyRow[] }) {
  const columns = useMemo<ColumnDef<AnyRow>[]>(() => {
    const first = data?.[0] || {};
    return Object.keys(first).map((k) => ({
      accessorKey: k,
      header: k,
      cell: (info) => String(info.getValue() ?? "")
    }));
  }, [data]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel()
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
`);

    const files = [{ path: `${root}/data-table.tsx`, content: dataTable }];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "ui.datatable:written",
      files: files.map((f) => f.path),
    });
    return { files: files.map((f) => f.path) };
  },
};

export default UiDataTableNode;
