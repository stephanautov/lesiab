"use client";
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
