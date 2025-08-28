"use client";
import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className = "", variant = "default", ...props }, ref) {
    const base =
      "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
    const variants: Record<string, string> = {
      default: "bg-black text-white hover:bg-neutral-800 focus:ring-black",
      outline:
        "border border-neutral-300 bg-white text-black hover:bg-neutral-50 focus:ring-neutral-300",
      ghost:
        "bg-transparent hover:bg-neutral-100 text-black focus:ring-neutral-300",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  },
);
