// path: components/form/Select.tsx
"use client";

import * as React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

export type Option = { label: string; value: string };

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select…",
  disabled,
}: Props<T>) {
  const { field, fieldState } = useController<T>({ control, name });
  const id = React.useId();

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      ) : null}

      <select
        id={id}
        className="w-full rounded border px-3 py-2 text-sm"
        value={field.value ?? ""}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {fieldState.error ? (
        <p className="text-xs text-red-600">{fieldState.error.message}</p>
      ) : null}
    </div>
  );
}
