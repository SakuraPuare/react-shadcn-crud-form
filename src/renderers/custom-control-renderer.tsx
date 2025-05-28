import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { FieldConfig } from "../types";

interface CustomControlRendererProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldConfig: FieldConfig;
  control: Control<TFieldValues>;
}

export function CustomControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldConfig,
  control,
}: CustomControlRendererProps<TFieldValues, TName>) {
  return fieldConfig.render
    ? fieldConfig.render({
        field,
        fieldConfig,
        control,
      })
    : null; // 如果没有 render 函数，则不渲染
}
