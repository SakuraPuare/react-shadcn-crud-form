"use client"

import { Input } from "../components/ui/input";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { FieldConfig } from "../types";

interface InputControlRendererProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldConfig: FieldConfig;
  setValue: UseFormSetValue<TFieldValues>;
}

export function InputControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldConfig,
  setValue,
}: InputControlRendererProps<TFieldValues, TName>) {
  const inputElement = (
    <Input
      {...field}
      placeholder={fieldConfig.placeholder}
      disabled={fieldConfig.disabled}
      value={(field.value as string | number | undefined) ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        field.onChange(e);
        if (fieldConfig.onChange) {
          fieldConfig.onChange(e.target.value);
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
