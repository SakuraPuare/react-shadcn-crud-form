# shadcn/ui 依赖管理说明

## 为什么移除直接的 Radix UI 依赖？

在之前的版本中，我们直接将 Radix UI 组件作为 `peerDependencies`，但这种做法存在以下问题：

### 问题分析

1. **依赖冲突**：用户的项目可能已经通过 shadcn/ui 安装了特定版本的 Radix UI 组件
2. **重复依赖**：会导致相同的组件被安装多次，增加包大小
3. **版本不一致**：可能导致样式和行为不一致的问题
4. **维护困难**：用户需要同时管理我们包的依赖和自己项目的依赖

### 解决方案

现在我们采用 **依赖用户 shadcn/ui 组件** 的策略：

```json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.400.0"
  }
}
```

## 用户需要做什么？

### 1. 确保已安装 shadcn/ui

```bash
npx shadcn-ui@latest init
```

### 2. 安装必需的 shadcn/ui 组件

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add badge
```

### 3. 确保项目结构正确

```
your-project/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui 组件目录
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── select.tsx
│   │       ├── checkbox.tsx
│   │       ├── textarea.tsx
│   │       └── badge.tsx
│   └── lib/
│       └── utils.ts      # shadcn/ui 工具函数
```

## 优势

### 1. 完全兼容
- 使用您项目中已有的 shadcn/ui 组件
- 保持样式和主题的一致性
- 支持您的自定义主题配置

### 2. 灵活性
- 您可以独立更新 shadcn/ui 组件
- 可以自定义任何 shadcn/ui 组件的样式
- 完全控制组件的版本和配置

### 3. 性能优化
- 不会重复安装相同的依赖
- 减少最终打包文件的大小
- 利用浏览器缓存

## 我们的组件如何工作？

我们的组件通过相对路径导入您的 shadcn/ui 组件：

```tsx
// src/components/ui/button.tsx (您的项目)
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Form, FormControl, FormField } from "@/components/ui/form"

// 我们的组件会使用这些已存在的组件
export function CrudFormDialog({ ... }) {
  return (
    <Dialog>
      <DialogContent>
        <Form>
          {/* 表单内容 */}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

## 故障排除

### 1. 组件未找到错误

如果您看到类似 "Cannot resolve '@/components/ui/button'" 的错误：

1. 确保已安装对应的 shadcn/ui 组件
2. 检查 `tsconfig.json` 中的路径配置
3. 确保 `@/components/ui/*` 路径指向正确的目录

### 2. 样式不一致

如果组件样式看起来不对：

1. 确保已正确配置 Tailwind CSS
2. 检查 `globals.css` 中的 shadcn/ui CSS 变量
3. 确认 `tailwind.config.js` 配置正确

### 3. TypeScript 错误

如果遇到类型错误：

1. 确保安装了 `@types/react` 和 `@types/react-dom`
2. 检查 TypeScript 版本兼容性
3. 运行 `npm run type-check` 进行类型检查

## 迁移指南

如果您正在从旧版本迁移：

1. **移除直接的 Radix UI 依赖**：
   ```bash
   npm uninstall @radix-ui/react-dialog @radix-ui/react-checkbox
   # ... 其他 Radix UI 包
   ```

2. **安装 shadcn/ui 组件**：
   ```bash
   npx shadcn-ui@latest add button input textarea select checkbox dialog form badge
   ```

3. **更新导入路径**（如果有自定义组件）：
   ```tsx
   // 之前
   import { Button } from "@radix-ui/react-button"
   
   // 现在
   import { Button } from "@/components/ui/button"
   ```

## 最佳实践

1. **保持 shadcn/ui 版本更新**：定期更新您的 shadcn/ui 组件
2. **统一主题配置**：在项目根部配置主题，所有组件都会继承
3. **使用 Context Provider**：利用我们提供的全局配置来统一表单行为
4. **自定义样式**：直接修改 shadcn/ui 组件来满足您的设计需求

这种依赖管理策略确保了我们的包能够无缝集成到您的项目中，同时保持最大的灵活性和性能。 