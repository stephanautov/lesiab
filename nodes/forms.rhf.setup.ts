// path: nodes/forms.rhf.setup.ts
/**
 * NODE: forms.rhf.setup
 * Phase: execute
 *
 * Purpose:
 *  - Provide reusable React Hook Form inputs that wrap shadcn primitives.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/components/form/TextField.tsx
 *  - artifacts/${orc}/repo/components/form/TextArea.tsx
 *  - artifacts/${orc}/repo/components/form/Select.tsx
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: { saveArtifact: (path: string, content: string | Uint8Array) => Promise<void> };
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

export const FormsRHFSetupNode: NodeSpec<unknown, { files: string[] }> = {
  id: "forms.rhf.setup",
  phase: "execute",
  estimate: () => ({ tokens: 320, usd: 0.0015 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo/components/form`;

    const textField = lf(`"use client";
import * as React from "react";
import { Controller, type Control } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props<T> = {
  control: Control<T>;
  name: keyof T & string;
  label?: string;
  placeholder?: string;
};

export function TextField<T>({ control, name, label, placeholder }: Props<T>) {
  return (
    <div className="space-y-1">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Controller
        control={control}
        name={name as any}
        render={({ field, fieldState }) => (
          <>
            <Input id={name} placeholder={placeholder} {...field} />
            {fieldState.error ? (
              <p className="text-xs text-red-600">{String(fieldState.error.message ?? "Invalid")}</p>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
`);

    const textArea = lf(`"use client";
import * as React from "react";
import { Controller, type Control } from "react-hook-form";
import { Label } from "../ui/label";

type Props<T> = {
  control: Control<T>;
  name: keyof T & string;
  label?: string;
  placeholder?: string;
  rows?: number;
};

export function TextArea<T>({ control, name, label, placeholder, rows = 4 }: Props<T>) {
  return (
    <div className="space-y-1">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Controller
        control={control}
        name={name as any}
        render={({ field, fieldState }) => (
          <>
            <textarea
              id={name}
              rows={rows}
              className="flex w-full rounded-md border border-neutral-300 bg-white p-2 text-sm shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-300"
              placeholder={placeholder}
              {...field}
            />
            {fieldState.error ? (
              <p className="text-xs text-red-600">{String(fieldState.error.message ?? "Invalid")}</p>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
`);

    const select = lf(`"use client";
import * as React from "react";
import { Controller, type Control } from "react-hook-form";
import { Label } from "../ui/label";

type Option = { value: string; label: string };

type Props<T> = {
  control: Control<T>;
  name: keyof T & string;
  label?: string;
  options: Option[];
};

export function Select<T>({ control, name, label, options }: Props<T>) {
  return (
    <div className="space-y-1">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Controller
        control={control}
        name={name as any}
        render={({ field, fieldState }) => (
          <>
            <select
              id={name}
              className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-300"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              <option value="" disabled>Choose…</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {fieldState.error ? (
              <p className="text-xs text-red-600">{String(fieldState.error.message ?? "Invalid")}</p>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
`);

    const files = [
      { path: `${root}/TextField.tsx`, content: textField },
      { path: `${root}/TextArea.tsx`, content: textArea },
      { path: `${root}/Select.tsx`, content: select },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({ msg: "forms.rhf.setup:written", files: files.map((f) => f.path) });
    return { files: files.map((f) => f.path) };
  },
};

export default FormsRHFSetupNode;
