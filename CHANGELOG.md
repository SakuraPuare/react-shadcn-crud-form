# 更新日志 (Changelog)

## [0.3.0] - 2024-01-XX

### 🚀 重大更新

#### 依赖管理重构
- **移除直接的 Radix UI 依赖**：不再在 `peerDependencies` 中直接依赖 `@radix-ui/*` 包
- **基于用户 shadcn/ui 组件**：现在完全依赖用户项目中已安装的 shadcn/ui 组件
- **避免依赖冲突**：消除了与用户现有 shadcn/ui 组件的版本冲突问题
- **减少包大小**：避免重复安装相同的依赖，优化最终打包大小

#### Context Provider 增强
- **全局配置管理**：通过 `FormProvider` 提供统一的全局配置
- **表单实例协调**：新增 `useFormInstance` Hook 用于多表单状态管理
- **主题配置支持**：支持全局主题和样式配置
- **字段配置继承**：全局字段配置与局部配置的智能合并

### ✨ 新功能

#### 新增 Hooks
- `useFormContext()` - 获取全局表单配置
- `useFieldConfig(fieldKey, localConfig)` - 获取合并后的字段配置
- `useFormInstance(formId)` - 管理表单实例状态

#### 配置选项
- `FormContextConfig` - 全局配置接口
- `validationMode` - 全局验证模式设置
- `globalFieldConfigs` - 全局字段配置
- `theme` - 主题和样式配置

### 📦 依赖更新

#### 新的 peerDependencies
```json
{
  "react": ">=17.0.0",
  "react-dom": ">=17.0.0", 
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "^0.400.0"
}
```

#### 移除的依赖
- `@radix-ui/react-checkbox`
- `@radix-ui/react-dialog`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-slot`

### 📚 文档更新

#### 新增文档
- `docs/SHADCN_DEPENDENCIES.md` - shadcn/ui 依赖管理详细说明
- `examples/context-provider-example.tsx` - Context Provider 使用示例
- `examples/demo-component.tsx` - 完整功能演示组件

#### 更新的文档
- `README.md` - 更新安装说明和使用示例
- 添加依赖管理说明
- 更新 Context Provider 使用指南

### 🛠️ 使用方式变更

#### 之前 (v0.2.x)
```bash
npm install react-shadcn-crud-form
# 自动安装所有 Radix UI 依赖
```

#### 现在 (v0.3.x)
```bash
# 1. 确保已设置 shadcn/ui
npx shadcn-ui@latest init

# 2. 安装必需的 shadcn/ui 组件
npx shadcn-ui@latest add button input dialog form select checkbox textarea badge

# 3. 安装我们的包
npm install react-shadcn-crud-form@0.3.0
```

### 💡 最佳实践

1. **使用 FormProvider**：在应用根部包装 FormProvider 来获得全局配置
2. **统一主题**：通过 FormProvider 的 theme 配置统一所有表单的样式
3. **全局字段配置**：使用 globalFieldConfigs 避免重复配置相同类型的字段
4. **表单实例管理**：使用 useFormInstance 在多个表单间进行状态协调

### 🔄 迁移指南

如果您正在从 v0.2.x 迁移：

1. **移除旧的 Radix UI 依赖**：
   ```bash
   npm uninstall @radix-ui/react-dialog @radix-ui/react-checkbox
   # ... 其他 Radix UI 包
   ```

2. **安装 shadcn/ui 组件**：
   ```bash
   npx shadcn-ui@latest add button input textarea select checkbox dialog form badge
   ```

3. **更新代码**（可选）：
   ```tsx
   // 添加 FormProvider（推荐）
   import { FormProvider } from 'react-shadcn-crud-form';
   
   function App() {
     return (
       <FormProvider config={{ ... }}>
         <YourComponents />
       </FormProvider>
     );
   }
   ```

### ⚠️ 破坏性变更

- **依赖要求**：现在需要用户手动安装 shadcn/ui 组件
- **项目结构要求**：需要标准的 shadcn/ui 项目结构

### 🐛 修复

- 修复了依赖版本冲突问题
- 提升了与不同 shadcn/ui 版本的兼容性
- 优化了 TypeScript 类型定义

### 🎯 下一步计划

- [ ] 添加更多内置字段类型
- [ ] 支持自定义验证器
- [ ] 添加动画和过渡效果
- [ ] 国际化支持
- [ ] 无障碍功能增强

---

## [0.2.0] - 之前版本

详见之前的更新记录...

---

## 技术支持

如果您在迁移过程中遇到问题，请：

1. 查看 `docs/SHADCN_DEPENDENCIES.md` 获取详细的依赖管理说明
2. 参考 `examples/` 目录中的示例代码
3. 提交 GitHub Issue 获取帮助

感谢您使用 react-shadcn-crud-form！🎉 