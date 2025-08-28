"use client";
import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-neutral-700 ${className}`}
      {...props}
    />
  );
}
