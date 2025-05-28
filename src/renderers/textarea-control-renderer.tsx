import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { FieldConfig } from "../types";

interface TextareaControlRendererProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldConfig: FieldConfig;
}

export function TextareaControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({ field, fieldConfig }: TextareaControlRendererProps<TFieldValues, TName>) {
  return (
    <Textarea
      {...field}
      className="max-h-[400px] h-[200px]"
      placeholder={fieldConfig.placeholder}
      disabled={fieldConfig.disabled}
      value={(field.value as string | undefined) ?? ""}
    />
  );
}
