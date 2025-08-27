// path: nodes/ui.shadcn.init.ts
/**
 * NODE: ui.shadcn.init
 * Phase: execute
 *
 * Purpose:
 *  - Provide minimal shadcn-style UI primitives so generated screens compile.
 *  - Deterministic, unbranded styles with Tailwind classes.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/components/ui/button.tsx
 *  - artifacts/${orc}/repo/components/ui/input.tsx
 *  - artifacts/${orc}/repo/components/ui/label.tsx
 *  - artifacts/${orc}/repo/components/ui/dialog.tsx
 *  - artifacts/${orc}/repo/components/ui/toast.tsx
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

function lf(s: string) {
  return s.replace(/\r\n/g, "\n");
}

export const UiShadcnInitNode: NodeSpec<unknown, { files: string[] }> = {
  id: "ui.shadcn.init",
  phase: "execute",
  estimate: () => ({ tokens: 300, usd: 0.001 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo/components/ui`;

    const button = lf(`"use client";
import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "default", ...props },
  ref
) {
  const base = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-black text-white hover:bg-neutral-800 focus:ring-black",
    outline: "border border-neutral-300 bg-white text-black hover:bg-neutral-50 focus:ring-neutral-300",
    ghost: "bg-transparent hover:bg-neutral-100 text-black focus:ring-neutral-300"
  };
  return <button ref={ref} className={\`\${base} \${variants[variant]} \${className}\`} {...props} />;
});
`);

    const input = lf(`"use client";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...props },
  ref
) {
  const base = "flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-300";
  return <input ref={ref} className={\`\${base} \${className}\`} {...props} />;
});
`);

    const label = lf(`"use client";
import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
export function Label({ className = "", ...props }: LabelProps) {
  return <label className={\`block text-sm font-medium text-neutral-700 \${className}\`} {...props} />;
}
`);

    const dialog = lf(`"use client";
import * as React from "react";

/** Minimal dialog (non-portal) for MVP; adequate for forms and confirmations. */
export function Dialog({
  open,
  onClose,
  children
}: React.PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg">
        <div className="flex justify-end pb-2">
          <button aria-label="Close" onClick={onClose} className="text-neutral-500 hover:text-black">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
`);

    const toast = lf(`"use client";
import * as React from "react";

type ToastMsg = { id: number; text: string };
let counter = 1;

export function useToast() {
  const [items, setItems] = React.useState<ToastMsg[]>([]);
  const push = (text: string) => setItems((xs) => [...xs, { id: counter++, text }]);
  const dismiss = (id: number) => setItems((xs) => xs.filter((x) => x.id !== id));
  const element = (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {items.map((t) => (
        <div key={t.id} className="rounded bg-black px-3 py-2 text-white shadow">
          <div className="flex items-center gap-3">
            <span className="text-sm">{t.text}</span>
            <button onClick={() => dismiss(t.id)} className="text-xs underline">Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
  return { push, element };
}
`);

    const files = [
      { path: `${root}/button.tsx`, content: button },
      { path: `${root}/input.tsx`, content: input },
      { path: `${root}/label.tsx`, content: label },
      { path: `${root}/dialog.tsx`, content: dialog },
      { path: `${root}/toast.tsx`, content: toast },
    ];

    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({ msg: "ui.shadcn.init:written", files: files.map((f) => f.path) });
    return { files: files.map((f) => f.path) };
  },
};

export default UiShadcnInitNode;
