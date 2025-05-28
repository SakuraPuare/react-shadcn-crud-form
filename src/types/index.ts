import { ReactNode } from "react";
import type {
  Control,
  DefaultValues,
  UseFormReturn,
  UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";

/**
 * 推断 Zod 类型的输出类型
 * @template T - Zod 类型
 */
export type InferredOutput<T extends z.ZodTypeAny> = z.infer<T>;

// 定义字段配置类型
export type FieldConfig = {
  /** 字段的类型 */
  type:
    | "input"
    | "select"
    | "textarea"
    | "checkbox"
    | "custom"
    | "multiselect"
    | "number"
    | "image";
  /** 字段的标签 */
  label?: string;
  /** 字段的占位符 */
  placeholder?: string;
  /** Select 类型的选项 */
  options?: { value: string; label: string }[];
  /** 值改变时的回调函数 */
  onChange?: (value: any) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否隐藏标签 */
  hideLabel?: boolean;
  /** 自定义渲染函数 */
  render?: (props: {
    /** react-hook-form 的 field 对象 */
    field: any;
    /** 当前字段的配置 */
    fieldConfig: FieldConfig;
    /** react-hook-form 的 control 对象 */
    control: Control<any>;
  }) => ReactNode;
  /** 在控件旁边渲染附加元素 */
  renderAccessory?: (methods: { setValue: UseFormSetValue<any> }) => ReactNode;
  /** 图片 Alt 文本 (用于 'image' 类型) */
  alt?: string;
  /** 图片宽度 (用于 'image' 类型) */
  width?: number;
  /** 图片高度 (用于 'image' 类型) */
  height?: number;
};

/**
 * DialogForm 组件的 Props
 * @template Schema - Zod 对象类型，用于表单验证
 */
export interface DialogFormProps<Schema extends z.ZodObject<z.ZodRawShape>> {
  /** 对话框标题 */
  title: string;
  /** 对话框描述 */
  description: string;
  /** 对话框是否打开 */
  open: boolean;
  /** 对话框打开状态改变时的回调函数 */
  onOpenChange: (open: boolean) => void;
  /** 表单提交时的回调函数 */
  onSubmit: (data: InferredOutput<Schema>) => void;
  /** Zod Schema，用于定义表单结构和验证规则 */
  formSchema: Schema;
  /** 表单的默认值 */
  defaultValues: DefaultValues<InferredOutput<Schema>>;
  /**
   * 字段的详细配置
   * - key: 对应 form schema 中的字段名
   * - value: FieldConfig 对象，用于定义字段的类型、标签、占位符等
   */
  fieldConfigs?: Record<string, FieldConfig>;
  /**
   * 外部传入的 react-hook-form 方法
   * 如果提供，则组件将使用外部的 form state；否则，组件内部会创建一个新的 form state。
   */
  formMethods?: UseFormReturn<InferredOutput<Schema>>;
  /** 提交按钮的文本，默认为 "提交" */
  submitButtonText?: string;
  /** 取消按钮的文本，默认为 "取消" */
  cancelButtonText?: string;
  /** 是否显示取消按钮，默认为 false */
  showCancelButton?: boolean;
  /** 点击取消按钮时的回调函数，如果未提供，默认行为是关闭对话框 */
  onCancel?: () => void;
  /** 自定义对话框底部内容，如果提供，将替换默认的按钮组 */
  footer?: ReactNode;
  /** 需要隐藏的字段列表 */
  hideFields?: string[];
  /** 指定字段的显示顺序，如果未提供，则按 Zod Schema 中的顺序显示 */
  fieldOrder?: string[];
}
