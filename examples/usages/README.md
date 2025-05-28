# React Shadcn CRUD Form Demo

这是一个展示如何使用 `react-shadcn-crud-form` 库的演示项目。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看演示。

## 📦 使用 NPM 包

本演示项目展示了如何从 NPM 安装和使用 `react-shadcn-crud-form`：

```bash
npm install react-shadcn-crud-form
```

## 🎯 演示功能

### 1. 用户管理表单
- 文本输入 (姓名、邮箱)
- 数字输入 (年龄)
- 选择框 (性别)
- 文本域 (个人简介)
- 复选框 (订阅通知)

### 2. 产品管理表单
- 基础字段 (名称、价格)
- 分类选择
- 多选标签
- 可选描述
- 库存状态

### 3. 联系表单
- 主题输入
- 消息文本域
- 优先级选择
- 部门选择

## 🔧 技术栈

- **Next.js 15** - React 框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全
- **Tailwind CSS 4** - 样式框架
- **react-shadcn-crud-form** - 表单组件库
- **Zod** - Schema 验证
- **react-hook-form** - 表单状态管理

## 📖 核心用法示例

### 基础用法

```tsx
import { DialogForm } from "react-shadcn-crud-form";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
});

export function UserForm() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: z.infer<typeof userSchema>) => {
    console.log("提交的数据:", data);
    setOpen(false);
  };

  return (
    <DialogForm
      title="添加用户"
      description="请填写用户信息"
      open={open}
      onOpenChange={setOpen}
      formSchema={userSchema}
      onSubmit={handleSubmit}
      defaultValues={{ name: "", email: "" }}
      fieldConfigs={{
        name: {
          type: "input",
          label: "姓名",
          placeholder: "请输入姓名",
        },
        email: {
          type: "input", 
          label: "邮箱",
          placeholder: "请输入邮箱地址",
        },
      }}
    />
  );
}
```

### 使用 FormProvider

```tsx
import { FormProvider } from "react-shadcn-crud-form";

export default function App() {
  return (
    <FormProvider
      config={{
        defaultSubmitText: "提交",
        defaultCancelText: "取消",
        validationMode: "onSubmit",
        globalFieldConfigs: {
          email: { type: "input", placeholder: "请输入邮箱" },
        },
      }}
    >
      <YourApp />
    </FormProvider>
  );
}
```

## 🎨 主要特性

- ✅ **类型安全**: 基于 TypeScript 和 Zod
- ✅ **现代 UI**: 使用 shadcn/ui 组件
- ✅ **高性能**: react-hook-form 优化
- ✅ **易于使用**: 简单直观的 API
- ✅ **可定制**: 灵活的配置选项
- ✅ **全局状态**: FormProvider 统一管理

## 📚 更多资源

- [GitHub 仓库](https://github.com/SakuraPuare/react-shadcn-crud-form)
- [NPM 包](https://www.npmjs.com/package/react-shadcn-crud-form)
- [文档](https://github.com/SakuraPuare/react-shadcn-crud-form#readme)

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！
