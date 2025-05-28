import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { FieldConfig } from "../types";

interface MultiSelectControlRendererProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldConfig: FieldConfig;
  fieldKey: string;
}

export function MultiSelectControlRenderer<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldConfig,
  fieldKey,
}: MultiSelectControlRendererProps<TFieldValues, TName>) {
  const selectedValues = (
    Array.isArray(field.value) ? field.value : []
  ) as string[];
  const allOptions = fieldConfig.options || []; // 获取所有选项

  // 确保有选项可用
  if (allOptions.length === 0) {
    return <div className="text-sm text-muted-foreground">无可用选项</div>;
  }

  // 检查是否所有选项都被选中
  const allSelected = selectedValues.length === allOptions.length;

  /**
   * 处理全选/取消全选按钮点击事件
   */
  const handleSelectAll = () => {
    let newValues: string[];
    if (allSelected) {
      // 如果已全选，则取消全选
      newValues = [];
    } else {
      // 否则，选择所有选项
      newValues = allOptions.map((opt) => opt.value);
    }
    field.onChange(newValues as PathValue<TFieldValues, TName>);
    if (fieldConfig.onChange) {
      fieldConfig.onChange(newValues);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center gap-2">
        {/* 显示已选择的项目 */}
        <div className="flex grow flex-wrap gap-1 min-h-10 p-2 border rounded-md">
          {selectedValues.length > 0 ? (
            selectedValues.map((value: string) => {
              const option = fieldConfig.options?.find(
                (opt) => opt.value === value,
              );
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {option?.label || value}
                  <button
                    type="button"
                    onClick={() => {
                      const newValues = selectedValues.filter(
                        (v: string) => v !== value,
                      );
                      field.onChange(
                        newValues as PathValue<TFieldValues, TName>,
                      );
                      if (fieldConfig.onChange) {
                        fieldConfig.onChange(newValues);
                      }
                    }}
                    className="rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground">
              {fieldConfig.placeholder || "请选择选项"}
            </div>
          )}
        </div>
        {/* 全选/取消全选按钮 */}
        <Button
          type="button"
          variant="outline"
          onClick={handleSelectAll}
          disabled={fieldConfig.disabled || allOptions.length === 0}
        >
          {allSelected ? "取消全选" : "全选"}
        </Button>
      </div>

      {/* 选项列表 */}
      <div className="border rounded-md p-2 max-h-[80%] overflow-y-auto">
        {allOptions.map((option) => {
          const isChecked = selectedValues.includes(option.value);
          return (
            <div
              key={option.value}
              className="flex items-center space-x-2 py-1"
            >
              <Checkbox
                id={`${fieldKey}-${option.value}`}
                checked={isChecked}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  let newValues: string[];
                  if (checked) {
                    newValues = [...selectedValues, option.value];
                  } else {
                    newValues = selectedValues.filter(
                      (v: string) => v !== option.value,
                    );
                  }
                  field.onChange(newValues as PathValue<TFieldValues, TName>);
                  if (fieldConfig.onChange) {
                    fieldConfig.onChange(newValues);
                  }
                }}
                disabled={fieldConfig.disabled}
              />
              <label
                htmlFor={`${fieldKey}-${option.value}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
