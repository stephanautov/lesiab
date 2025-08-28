"use client";
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

export function TextArea<T>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
}: Props<T>) {
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
              <p className="text-xs text-red-600">
                {String(fieldState.error.message ?? "Invalid")}
              </p>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
