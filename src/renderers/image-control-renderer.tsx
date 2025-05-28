import React from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { FieldConfig } from "../types";

interface ImageControlRendererProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldConfig: FieldConfig;
  fieldKey: string;
}

export function ImageControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldConfig,
  fieldKey,
}: ImageControlRendererProps<TFieldValues, TName>) {
  const handleError = (_e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Attempt to set a fallback, but ensure it's a generic one or configurable
    // For now, just log or do nothing to avoid assuming a specific asset path
    // (e.target as HTMLImageElement).src = "/placeholder.png"; // Avoid project-specific paths
    console.warn(`Image failed to load: ${field.value}`);
  };

  return (
    <img // Changed from next/image to img
      src={(field.value as string | undefined) || ""} // Provide a default empty string if no value
      alt={fieldConfig.alt || `Image for ${fieldKey}`}
      width={fieldConfig.width || 100}
      height={fieldConfig.height || 100}
      className="rounded border object-cover"
      onError={handleError}
    />
  );
}
