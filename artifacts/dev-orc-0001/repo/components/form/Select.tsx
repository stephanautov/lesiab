"use client";
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
