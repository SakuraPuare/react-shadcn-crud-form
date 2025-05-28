# 项目结构说明

## 目录组织

```
react-shadcn-crud-form/
├── src/                     # 源代码目录
│   ├── components/          # React 组件
│   │   ├── ui/             # shadcn/ui 组件
│   │   └── dialog-form.tsx # 主要的表单对话框组件
│   ├── context/            # React Context 和状态管理
│   │   └── form-context.tsx
│   ├── hooks/              # 自定义 React Hooks
│   │   └── index.ts
│   ├── renderers/          # 字段渲染器
│   │   ├── form-control-renderer.tsx
│   │   ├── input-control-renderer.tsx
│   │   ├── select-control-renderer.tsx
│   │   ├── textarea-control-renderer.tsx
│   │   ├── checkbox-control-renderer.tsx
│   │   ├── number-control-renderer.tsx
│   │   ├── multiselect-control-renderer.tsx
│   │   ├── image-control-renderer.tsx
│   │   └── custom-control-renderer.tsx
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   └── index.ts            # 主入口文件
├── examples/               # 使用示例
│   └── basic-usage.tsx
├── docs/                   # 文档
│   └── project-structure.md
├── dist/                   # 编译输出 (npm publish 时包含)
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── .eslintrc.js           # ESLint 配置
├── .npmignore             # npm 发布忽略文件
├── README.md              # 项目说明
└── LICENSE                # MIT 许可证
```

## 核心组件说明

### DialogForm
主要的表单对话框组件，支持：
- 基于 Zod Schema 的动态表单生成
- 类型安全的表单验证
- 自定义字段渲染
- 响应式设计

### FormProvider
全局状态管理器，提供：
- 全局表单配置
- 主题自定义
- 字段配置复用
- 表单实例管理

### 字段渲染器
支持多种字段类型：
- `input` - 文本输入框
- `textarea` - 多行文本域
- `select` - 下拉选择框
- `multiselect` - 多选选择器
- `checkbox` - 复选框
- `number` - 数字输入框
- `image` - 图片显示
- `custom` - 自定义渲染器

### Hooks
提供便捷的状态管理钩子：
- `useFormContext` - 访问全局表单配置
- `useFieldConfig` - 获取字段配置
- `useFormInstance` - 管理表单实例

## 开发工作流

### 本地开发
```bash
npm install
npm run dev  # 监听模式编译
```

### 构建
```bash
npm run build  # 编译 TypeScript
```

### 代码检查
```bash
npm run lint      # 检查代码规范
npm run lint:fix  # 自动修复
```

### 发布
```bash
npm run prepublishOnly  # 自动构建
npm publish             # 发布到 npm
```

## 设计原则

1. **类型安全**: 全面的 TypeScript 支持
2. **可组合性**: 模块化设计，易于扩展
3. **零配置**: 开箱即用，默认配置合理
4. **可定制性**: 支持深度自定义
5. **性能优先**: 最小化依赖，优化渲染 