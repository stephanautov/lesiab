"use client";
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
