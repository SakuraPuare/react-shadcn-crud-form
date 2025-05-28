"use client"; // Add this if using Next.js App Router and hooks like useForm

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"; // Remove React import, only keep useEffect
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  Resolver,
  useForm,
  UseFormReturn,
} from "react-hook-form"; // Import Resolver and UseFormReturn
import { z } from "zod";
import { FormControlRenderer } from "../renderers/form-control-renderer";
import { DialogFormProps, FieldConfig, InferredOutput } from "../types"; // Import types
import { useFormContext, useFormInstance } from "../context/form-context";

/**
 * 一个基于 Shadcn UI Dialog 和 react-hook-form 的通用对话框表单组件。
 * 它根据传入的 Zod Schema 动态生成表单项，并处理表单的验证和提交。
 * @template Schema - Zod 对象类型，用于表单验证
 */
export function DialogForm<
  Schema extends z.ZodObject<z.ZodRawShape>,
  // Directly use InferredOutput<Schema> for the form values type
  TFormValues extends FieldValues = InferredOutput<Schema>,
>({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  formSchema,
  defaultValues,
  fieldConfigs = {},
  formMethods: externalFormMethods,
  submitButtonText,
  cancelButtonText,
  showCancelButton,
  onCancel,
  footer,
  hideFields = [],
  fieldOrder,
}: DialogFormProps<Schema>) {
  // 使用表单上下文获取全局配置
  const {
    defaultSubmitText,
    defaultCancelText,
    defaultShowCancelButton,
    theme,
    globalFieldConfigs,
  } = useFormContext();

  // 合并全局配置和局部配置
  const finalSubmitText = submitButtonText || defaultSubmitText || "提交";
  const finalCancelText = cancelButtonText || defaultCancelText || "取消";
  const finalShowCancelButton = showCancelButton ?? defaultShowCancelButton ?? false;
  
  // 合并字段配置
  const mergedFieldConfigs = {
    ...globalFieldConfigs,
    ...fieldConfigs,
  };

  // Type for the form instance, whether internal or external
  type CurrentFormMethods = UseFormReturn<TFormValues>;

  // 内部创建的 react-hook-form 实例，仅在未提供外部 formMethods 时使用
  // Use a temporary variable to hold the internally created form methods if needed
  const internalForm = useForm<TFormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<TFormValues>,
    // defaultValues are handled by reset below OR by external form methods
  });

  // 优先使用外部传入的 formMethods
  // Explicitly type formMethods to CurrentFormMethods
  const formMethods: CurrentFormMethods = externalFormMethods
    ? (externalFormMethods as unknown as UseFormReturn<TFormValues>) // Use double assertion for stricter type safety
    : internalForm;
  const { handleSubmit, control, reset, setValue } = formMethods; // Destructure AFTER deciding which form methods to use

  // Reset form when defaultValues or open state changes, ONLY if using internal form
  useEffect(() => {
    // Only run this effect if we are using the internal form methods
    if (!externalFormMethods && open) {
      // Use defaultValues directly as it should match TFormValues (InferredOutput<Schema>)
      reset(defaultValues as TFormValues);
    }
    // Add externalFormMethods to dependency array to track its presence
  }, [open, defaultValues, reset, externalFormMethods]);

  /**
   * 处理表单提交事件
   * @param data 表单数据 (type is TFormValues)
   */
  const handleFormSubmit = handleSubmit((data: TFormValues) => {
    // Cast data back to InferredOutput<Schema> for the onSubmit prop,
    // although TFormValues should generally be the same.
    onSubmit(data as InferredOutput<Schema>);
  });

  /**
   * 处理取消事件
   * 如果提供了 onCancel 回调，则调用它，否则直接关闭对话框。
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  // 确定需要渲染的字段列表，过滤掉 hideFields 中指定的字段
  const fieldsToRender = Object.keys(formSchema.shape).filter(
    // Cast hideFields to string[] for includes check, assuming keys are strings
    (key) => !(hideFields as string[]).includes(key),
  );

  // 根据 fieldOrder 对字段进行排序，如果未提供 fieldOrder，则使用默认顺序
  const orderedFields = fieldOrder
    ? fieldOrder.filter((key) => fieldsToRender.includes(key)) // 过滤掉不存在于 fieldsToRender 中的字段
    : fieldsToRender; // 使用过滤后的字段列表

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`sm:max-w-[${theme?.dialogMaxWidth || '60%'}] max-h-[${theme?.dialogMaxHeight || '80vh'}] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Use the correctly typed formMethods here */}
        <Form {...formMethods}>
          <form onSubmit={handleFormSubmit} className={theme?.fieldSpacing || "space-y-4"}>
            {/* 遍历排序后的字段并渲染 */}
            {orderedFields.map((key) => {
              // Ensure key is a valid path for the form values
              const fieldName = key as Path<TFormValues>;
              return (
                <FormField
                  key={fieldName}
                  control={control} // Use the control from the determined formMethods
                  name={fieldName}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<TFormValues, typeof fieldName>;
                  }) => (
                    <FormItem>
                      {/* 根据配置决定是否显示标签 */}
                      {!mergedFieldConfigs[key]?.hideLabel && (
                        <FormLabel>{mergedFieldConfigs[key]?.label || key}</FormLabel>
                      )}
                      {/* 渲染表单控件 */}
                      <FormControl>
                        {/* Pass both generic types to FormControlRenderer */}
                        <FormControlRenderer<TFormValues, typeof fieldName>
                          fieldKey={key}
                          field={field}
                          formSchema={formSchema}
                          fieldConfigs={
                            mergedFieldConfigs as Record<string, FieldConfig>
                          } // Keep cast for now
                          control={control}
                          setValue={setValue}
                        />
                      </FormControl>
                      {/* 显示验证错误信息 */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            {/* 渲染底部内容 */}
            {footer ? ( // 如果提供了自定义 footer，则渲染它
              footer
            ) : (
              // 否则渲染默认的按钮组
              <DialogFooter className="flex gap-2 pt-4">
                {finalShowCancelButton && ( // 根据配置决定是否显示取消按钮
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    {finalCancelText}
                  </Button>
                )}
                <Button type="submit">{finalSubmitText}</Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
