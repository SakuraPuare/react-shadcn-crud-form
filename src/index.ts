// 主要组件
export { DialogForm } from "./components/dialog-form";

// 渲染器
export { FormControlRenderer } from "./renderers/form-control-renderer";
export { CheckboxControlRenderer } from "./renderers/checkbox-control-renderer";
export { CustomControlRenderer } from "./renderers/custom-control-renderer";
export { ImageControlRenderer } from "./renderers/image-control-renderer";
export { InputControlRenderer } from "./renderers/input-control-renderer";
export { MultiSelectControlRenderer } from "./renderers/multiselect-control-renderer";
export { NumberControlRenderer } from "./renderers/number-control-renderer";
export { SelectControlRenderer } from "./renderers/select-control-renderer";
export { TextareaControlRenderer } from "./renderers/textarea-control-renderer";

// Context 和 Hooks
export {
  FormProvider,
  useFormContext,
  useFieldConfig,
  useFormInstance,
  type FormContextConfig,
  type FormContextState,
  type FormProviderProps,
} from "./context/form-context";

// 类型定义
export * from "./types";

// UI 组件 (可选导出，用户可能想要复用)
export { Button } from "./components/ui/button";
export { Input } from "./components/ui/input";
export { Textarea } from "./components/ui/textarea";
export { Checkbox } from "./components/ui/checkbox";
export { Badge } from "./components/ui/badge";
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
export {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"; 