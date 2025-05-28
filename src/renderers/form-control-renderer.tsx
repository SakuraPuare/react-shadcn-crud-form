"use client"

import { ReactNode } from "react";
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";
import { FieldConfig } from "../types";
import { CheckboxControlRenderer } from "./checkbox-control-renderer";
import { CustomControlRenderer } from "./custom-control-renderer";
import { ImageControlRenderer } from "./image-control-renderer";
import { InputControlRenderer } from "./input-control-renderer";
import { MultiSelectControlRenderer } from "./multiselect-control-renderer";
import { NumberControlRenderer } from "./number-control-renderer";
import { SelectControlRenderer } from "./select-control-renderer";
import { TextareaControlRenderer } from "./textarea-control-renderer";

interface FormControlRendererProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  fieldKey: string;
  field: ControllerRenderProps<TFieldValues, TName>;
  formSchema: z.ZodObject<z.ZodRawShape>;
  fieldConfigs: Record<string, FieldConfig>;
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
}

export function FormControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  fieldKey,
  field,
  formSchema,
  fieldConfigs = {},
  control,
  setValue,
}: FormControlRendererProps<TFieldValues, TName>): ReactNode {
  // 获取字段配置，默认为 input 类型
  const config = fieldConfigs[fieldKey] || { type: "input" };

  switch (config.type) {
    // 自定义渲染逻辑
    case "custom": {
      return (
        <CustomControlRenderer
          field={field}
          fieldConfig={config}
          control={control}
        />
      );
    }
    // 多选列表
    case "multiselect": {
      return (
        <MultiSelectControlRenderer
          field={field}
          fieldConfig={config}
          fieldKey={fieldKey}
        />
      );
    }
    // Select 选择框
    case "select": {
      return (
        <SelectControlRenderer
          field={field}
          fieldConfig={config}
          fieldKey={fieldKey}
          formSchema={formSchema}
        />
      );
    }
    // Textarea 文本域
    case "textarea": {
      return <TextareaControlRenderer field={field} fieldConfig={config} />;
    }
    // Checkbox 复选框
    case "checkbox": {
      return <CheckboxControlRenderer field={field} fieldConfig={config} />;
    }
    // Number 输入框
    case "number": {
      return (
        <NumberControlRenderer
          field={field}
          fieldConfig={config}
          setValue={setValue}
        />
      );
    }
    // Image 显示
    case "image": {
      return (
        <ImageControlRenderer
          field={field}
          fieldConfig={config}
          fieldKey={fieldKey}
        />
      );
    }
    // 默认 Input 输入框
    case "input":
    default: {
      return (
        <InputControlRenderer
          field={field}
          fieldConfig={config}
          setValue={setValue}
        />
      );
    }
  }
}
