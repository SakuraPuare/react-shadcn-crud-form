"use client"

import { Input } from "../components/ui/input";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { FieldConfig } from "../types";

interface NumberControlRendererProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldConfig: FieldConfig;
  setValue: UseFormSetValue<TFieldValues>;
}

export function NumberControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldConfig,
  setValue,
}: NumberControlRendererProps<TFieldValues, TName>) {
  const inputElement = (
    <Input
      {...field}
      type="number"
      placeholder={fieldConfig.placeholder}
      disabled={fieldConfig.disabled}
      value={(field.value as number | string | undefined) ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = value === "" ? undefined : parseFloat(value);
        field.onChange(numValue as PathValue<TFieldValues, TName>);
        if (fieldConfig.onChange) {
          fieldConfig.onChange(numValue);
        }
      }}
    />
  );

  // Check if renderAccessory is provided
  if (fieldConfig.renderAccessory) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-grow">{inputElement}</div>
        {fieldConfig.renderAccessory({ setValue: setValue })}
      </div>
    );
  }

  return inputElement;
}
