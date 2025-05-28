# 🚀 React Shadcn CRUD Form

<div align="center">

![Version](https://img.shields.io/npm/v/react-shadcn-crud-form?style=flat-square&color=blue)
![License](https://img.shields.io/npm/l/react-shadcn-crud-form?style=flat-square&color=green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)

**一个基于 shadcn/ui 和 react-hook-form 的现代化 React CRUD 表单组件库**

*支持动态表单生成、类型安全和全局状态管理*

[文档](#-快速开始) · [示例](#-使用示例) · [API](#-api-参考) · [贡献](#-贡献)

</div>

---

## ✨ 特性

- 🎯 **类型安全**: 完全基于 TypeScript，提供完整的类型推导
- 🎨 **现代化 UI**: 基于 shadcn/ui，提供美观的用户界面
- 🔧 **动态表单**: 根据 Zod Schema 自动生成表单字段
- 📱 **响应式设计**: 适配移动端和桌面端
- 🎭 **自定义渲染**: 支持完全自定义的字段渲染器
- 🌍 **全局状态**: 提供 Context API 进行全局配置管理
- 🚀 **零配置**: 开箱即用，同时支持深度自定义
- 📦 **轻量级**: 最小化依赖，性能优先

## 📦 安装

```bash
# npm
npm install react-shadcn-crud-form

# yarn
yarn add react-shadcn-crud-form

# pnpm
pnpm add react-shadcn-crud-form
```

## 🛠 前置要求

确保你的项目已经安装了以下依赖：

```bash
npm install react react-dom react-hook-form zod @hookform/resolvers
```

以及 shadcn/ui 相关组件：

```bash
npx shadcn-ui@latest add button dialog form input textarea select checkbox
```

## 🚀 快速开始

### 基础用法

```tsx
import React, { useState } from 'react';
import { DialogForm, FormProvider } from 'react-shadcn-crud-form';
import { z } from 'zod';

// 定义表单 Schema
const userSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  age: z.number().min(18, '年龄必须大于18岁'),
  bio: z.string().optional(),
});

function App() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: z.infer<typeof userSchema>) => {
    console.log('提交的数据:', data);
    setOpen(false);
  };

  return (
    <FormProvider>
      <button onClick={() => setOpen(true)}>
        创建用户
      </button>
      
      <DialogForm
        title="创建新用户"
        description="请填写用户信息"
        open={open}
        onOpenChange={setOpen}
        formSchema={userSchema}
        defaultValues={{
          name: '',
          email: '',
          age: 18,
          bio: '',
        }}
        fieldConfigs={{
          name: { type: 'input', label: '姓名' },
          email: { type: 'input', label: '邮箱地址' },
          age: { type: 'number', label: '年龄' },
          bio: { type: 'textarea', label: '个人简介' },
        }}
        onSubmit={handleSubmit}
        showCancelButton
      />
    </FormProvider>
  );
}
```

### 全局配置

```tsx
import { FormProvider } from 'react-shadcn-crud-form';

function App() {
  return (
    <FormProvider
      config={{
        defaultSubmitText: '保存',
        defaultCancelText: '取消',
        defaultShowCancelButton: true,
        theme: {
          dialogMaxWidth: '80%',
          dialogMaxHeight: '90vh',
          fieldSpacing: 'space-y-6',
        },
        globalFieldConfigs: {
          email: { type: 'input', placeholder: '请输入邮箱地址' },
          password: { type: 'input', placeholder: '请输入密码' },
        },
      }}
    >
      {/* 你的应用内容 */}
    </FormProvider>
  );
}
```

## 💡 使用示例

### 1. 选择框和多选

```tsx
const productSchema = z.object({
  category: z.string(),
  tags: z.array(z.string()),
  status: z.enum(['active', 'inactive']),
});

<DialogForm
  formSchema={productSchema}
  fieldConfigs={{
    category: {
      type: 'select',
      label: '产品分类',
      options: [
        { value: 'electronics', label: '电子产品' },
        { value: 'clothing', label: '服装' },
        { value: 'books', label: '图书' },
      ],
    },
    tags: {
      type: 'multiselect',
      label: '标签',
      options: [
        { value: 'new', label: '新品' },
        { value: 'hot', label: '热销' },
        { value: 'sale', label: '促销' },
      ],
    },
    status: {
      type: 'select',
      label: '状态',
      options: [
        { value: 'active', label: '激活' },
        { value: 'inactive', label: '未激活' },
      ],
    },
  }}
  // ... 其他属性
/>
```

### 2. 自定义字段渲染器

```tsx
const customSchema = z.object({
  avatar: z.string().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }),
});

<DialogForm
  formSchema={customSchema}
  fieldConfigs={{
    avatar: {
      type: 'custom',
      label: '头像',
      render: ({ field, fieldConfig }) => (
        <div className="flex items-center space-x-4">
          <img
            src={field.value || '/default-avatar.png'}
            alt="Avatar"
            className="w-16 h-16 rounded-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              // 处理文件上传逻辑
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                field.onChange(url);
              }
            }}
          />
        </div>
      ),
    },
    'preferences.theme': {
      type: 'select',
      label: '主题',
      options: [
        { value: 'light', label: '浅色' },
        { value: 'dark', label: '深色' },
      ],
    },
    'preferences.notifications': {
      type: 'checkbox',
      label: '接收通知',
    },
  }}
  // ... 其他属性
/>
```

## 🎯 API 参考

### DialogForm Props

| 属性 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `title` | `string` | ✅ | 对话框标题 |
| `description` | `string` | ✅ | 对话框描述 |
| `open` | `boolean` | ✅ | 对话框是否打开 |
| `onOpenChange` | `(open: boolean) => void` | ✅ | 对话框状态改变回调 |
| `formSchema` | `ZodObject` | ✅ | Zod Schema 定义 |
| `onSubmit` | `(data: T) => void` | ✅ | 表单提交回调 |
| `defaultValues` | `DefaultValues<T>` | ✅ | 表单默认值 |
| `fieldConfigs` | `Record<string, FieldConfig>` | ❌ | 字段配置 |
| `formMethods` | `UseFormReturn<T>` | ❌ | 外部表单方法 |
| `submitButtonText` | `string` | ❌ | 提交按钮文本 |
| `cancelButtonText` | `string` | ❌ | 取消按钮文本 |
| `showCancelButton` | `boolean` | ❌ | 是否显示取消按钮 |
| `onCancel` | `() => void` | ❌ | 取消按钮回调 |
| `footer` | `ReactNode` | ❌ | 自定义底部内容 |
| `hideFields` | `string[]` | ❌ | 需要隐藏的字段 |
| `fieldOrder` | `string[]` | ❌ | 字段显示顺序 |

### FieldConfig

```typescript
interface FieldConfig {
  type: 'input' | 'select' | 'textarea' | 'checkbox' | 'custom' | 'multiselect' | 'number' | 'image';
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  onChange?: (value: any) => void;
  disabled?: boolean;
  hideLabel?: boolean;
  render?: (props: {
    field: any;
    fieldConfig: FieldConfig;
    control: Control<any>;
  }) => ReactNode;
  renderAccessory?: (methods: { setValue: UseFormSetValue<any> }) => ReactNode;
  // 图片类型特有属性
  alt?: string;
  width?: number;
  height?: number;
}
```

### FormProvider Props

```typescript
interface FormProviderProps {
  children: ReactNode;
  config?: {
    globalFieldConfigs?: Record<string, Partial<FieldConfig>>;
    defaultSubmitText?: string;
    defaultCancelText?: string;
    defaultShowCancelButton?: boolean;
    validationMode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
    theme?: {
      dialogMaxWidth?: string;
      dialogMaxHeight?: string;
      fieldSpacing?: string;
    };
  };
}
```

### Hooks

#### useFormContext

```typescript
const {
  defaultSubmitText,
  defaultCancelText,
  defaultShowCancelButton,
  theme,
  globalFieldConfigs,
  activeFormId,
  setActiveFormId,
  updateConfig,
} = useFormContext();
```

#### useFieldConfig

```typescript
const fieldConfig = useFieldConfig('fieldName', localConfig);
```

#### useFormInstance

```typescript
const { isActive, activate, deactivate } = useFormInstance('formId');
```

## 🎨 自定义主题

通过 FormProvider 配置全局主题：

```tsx
<FormProvider
  config={{
    theme: {
      dialogMaxWidth: '90%',
      dialogMaxHeight: '85vh',
      fieldSpacing: 'space-y-8',
    },
  }}
>
  {/* 应用内容 */}
</FormProvider>
```

## 🔧 高级用法

### 字段间依赖

```tsx
const schemaWithDependency = z.object({
  hasAddress: z.boolean(),
  address: z.string().optional(),
});

<DialogForm
  formSchema={schemaWithDependency}
  fieldConfigs={{
    hasAddress: {
      type: 'checkbox',
      label: '有地址信息',
    },
    address: {
      type: 'textarea',
      label: '详细地址',
      // 可以通过 watch 监听其他字段变化
    },
  }}
  hideFields={!form.watch('hasAddress') ? ['address'] : []}
/>
```

### 动态字段配置

```tsx
const { updateConfig } = useFormContext();

// 动态更新全局配置
const handleThemeChange = (theme: string) => {
  updateConfig({
    theme: {
      dialogMaxWidth: theme === 'mobile' ? '95%' : '60%',
      fieldSpacing: theme === 'compact' ? 'space-y-2' : 'space-y-4',
    },
  });
};
```

## 📝 类型安全

本库完全支持 TypeScript，提供完整的类型推导：

```tsx
// 从 Schema 自动推导类型
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof userSchema>; // { name: string; age: number }

// 表单提交时自动获得正确类型
const handleSubmit = (data: User) => {
  // data.name 是 string 类型
  // data.age 是 number 类型
};
```

## 🤝 贡献

我们欢迎所有形式的贡献！

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com/) - 提供了优秀的 UI 组件
- [react-hook-form](https://react-hook-form.com/) - 强大的表单状态管理
- [Zod](https://zod.dev/) - TypeScript 优先的模式验证

**[⬆ 回到顶部](#-react-shadcn-crud-form)**

Made with ❤️ by the SakuraPuare

</div>
