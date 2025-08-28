"use client";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className = "", ...props }, ref) {
    const base =
      "flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-300";
    return <input ref={ref} className={`${base} ${className}`} {...props} />;
  },
);
