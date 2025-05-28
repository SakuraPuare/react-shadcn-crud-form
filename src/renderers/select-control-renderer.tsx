"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { z } from "zod";
import { FieldConfig } from "../types";

interface SelectControlRendererProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldConfig: FieldConfig;
  fieldKey: string;
  formSchema: z.ZodObject<z.ZodRawShape>;
}

export function SelectControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldConfig,
  fieldKey,
  formSchema,
}: SelectControlRendererProps<TFieldValues, TName>) {
  const shape = formSchema.shape as Record<
    string,
    z.ZodTypeAny | z.ZodOptional<any> | z.ZodNullable<any>
  >;
  const fieldSchema = shape[fieldKey];
  const isOptional =
    fieldSchema instanceof z.ZodOptional ||
    fieldSchema instanceof z.ZodNullable;

  // 如果字段是可选的，并且没有提供选项或选项为空，则显示提示信息，而不是渲染 Select 组件
  if (
    isOptional &&
    (!fieldConfig.options || fieldConfig.options.length === 0)
  ) {
    return <div className="text-sm text-muted-foreground">无可用选项</div>;
  }

  // 渲染 Select 组件
  return (
    <Select
      onValueChange={(value: string) => {
        field.onChange(value as PathValue<TFieldValues, TName>);
        if (fieldConfig.onChange) {
          fieldConfig.onChange(value);
        }
      }}
      value={(field.value as string | undefined) ?? ""}
      disabled={fieldConfig.disabled}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={
            fieldConfig.placeholder || `选择${fieldConfig.label || fieldKey}`
          }
        />
      </SelectTrigger>
      <SelectContent>
        {fieldConfig.options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
