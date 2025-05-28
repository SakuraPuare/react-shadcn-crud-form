# Rollup 打包配置指南

## 概述

本项目使用 Rollup 作为库的打包工具，相比于 Webpack，Rollup 在构建库时有以下优势：

- **Tree Shaking**: 更好的死代码消除
- **较小的打包体积**: 专为库优化
- **ES Module 友好**: 原生支持 ES 模块
- **配置简单**: 相对简洁的配置文件

## 当前配置

### 构建产物

我们的 Rollup 配置生成以下文件：

```
dist/
├── index.js          # CommonJS 格式，供 Node.js 使用
├── index.js.map      # CommonJS 源码映射
├── index.esm.js      # ES Module 格式，供现代打包工具使用
├── index.esm.js.map  # ES Module 源码映射
├── index.d.ts        # TypeScript 类型声明文件
└── index.d.ts.map    # 类型声明源码映射
```

### 配置特性

1. **多格式输出**
   - CommonJS (`dist/index.js`)
   - ES Module (`dist/index.esm.js`)

2. **TypeScript 支持**
   - 使用专门的 `tsconfig.lib.json` 配置
   - 自动生成类型声明文件

3. **React 优化**
   - 自动添加 `"use client"` 指令
   - 外部化 React 相关依赖
   - 保留 JSX 运行时

4. **代码优化**
   - 生产环境自动压缩
   - Tree Shaking
   - Source Map 生成

## 可用的脚本命令

### 开发构建
```bash
# 一次性构建
npm run build:lib

# 监听模式构建（开发时使用）
npm run dev:lib
# 或
npm run build:lib:watch
```

### 生产构建
```bash
# 完整的生产构建流程（清理 + 类型检查 + 构建）
npm run build:production

# 构建并创建本地包预览
npm run preview:lib
```

### 测试和验证
```bash
# 运行类型检查和 lint
npm run test:lib

# 只运行类型检查
npm run type-check:lib

# 清理构建产物
npm run clean
```

## 配置详解

### 核心插件

1. **@rollup/plugin-typescript**
   - 编译 TypeScript 代码
   - 生成类型声明文件

2. **@rollup/plugin-node-resolve**
   - 解析 node_modules 中的模块
   - 配置浏览器兼容性

3. **@rollup/plugin-commonjs**
   - 转换 CommonJS 模块为 ES Module

4. **rollup-plugin-peer-deps-external**
   - 自动外部化 peer dependencies

5. **@rollup/plugin-terser**
   - 生产环境代码压缩

6. **rollup-plugin-dts**
   - 生成类型声明文件

### 自定义插件

我们实现了一个自定义插件来处理 React "use client" 指令：

```javascript
const preserveUseClient = () => ({
  name: 'preserve-use-client',
  generateBundle(options, bundle) {
    for (const fileName in bundle) {
      const chunk = bundle[fileName];
      if (chunk.type === 'chunk') {
        chunk.code = `"use client";\n${chunk.code}`;
      }
    }
  }
});
```

### 外部依赖处理

以下依赖会被外部化（不打包到最终产物中）：

- 所有 `peerDependencies`
- React 相关模块 (`react/jsx-runtime`, `react/jsx-dev-runtime`)
- Node.js 内置模块

## 优化建议

### 1. 分析包大小

```bash
# 安装分析工具
npm install --save-dev rollup-plugin-visualizer

# 在 rollup.config.js 中添加
import { visualizer } from 'rollup-plugin-visualizer';

// 在 plugins 数组中添加
visualizer({
  filename: 'dist/stats.html',
  open: true,
  gzipSize: true,
})
```

### 2. 添加外部依赖检查

```bash
# 检查不应该被打包的依赖
npm install --save-dev rollup-plugin-node-externals

# 替代手动配置外部依赖
import externals from 'rollup-plugin-node-externals';

// 在 plugins 中使用
externals()
```

### 3. 优化 Tree Shaking

确保你的代码使用 ES Module 语法：

```javascript
// ✅ 好的做法
export { Component } from './component';

// ❌ 避免这样做
export * from './component';
```

## 故障排除

### 常见问题

1. **"use client" 警告**
   - 已通过自定义插件和 `onwarn` 配置解决

2. **类型声明文件缺失**
   - 确保 `tsconfig.lib.json` 配置正确
   - 检查 `include` 和 `exclude` 路径

3. **依赖被错误打包**
   - 检查 `external` 配置
   - 确认 `peerDependencies` 设置正确

4. **构建缓存问题**
   - 运行 `npm run clean` 清理缓存
   - 删除 `node_modules/.cache`

### 调试模式

```bash
# 启用详细日志
ROLLUP_WATCH=true npm run build:lib

# 检查构建产物
ls -la dist/
```

## 与其他打包工具对比

| 特性 | Rollup | Webpack | Vite |
|------|--------|---------|------|
| 库打包 | ✅ 优秀 | ⚠️ 配置复杂 | ⚠️ 主要面向应用 |
| Tree Shaking | ✅ 原生支持 | ✅ 支持 | ✅ 支持 |
| ES Module | ✅ 原生 | ⚠️ 需配置 | ✅ 原生 |
| 包大小 | ✅ 最小 | ❌ 较大 | ⚠️ 中等 |
| 配置复杂度 | ✅ 简单 | ❌ 复杂 | ✅ 简单 |

## 最佳实践

1. **保持配置简洁**: 只添加必要的插件
2. **正确设置外部依赖**: 避免打包不必要的代码
3. **使用类型检查**: 构建前运行 TypeScript 检查
4. **定期更新依赖**: 保持插件版本最新
5. **测试多环境**: 确保 CommonJS 和 ES Module 都能正常工作

## 参考资源

- [Rollup 官方文档](https://rollupjs.org/)
- [TypeScript 插件配置](https://github.com/rollup/plugins/tree/master/packages/typescript)
- [React 库打包最佳实践](https://blog.logrocket.com/building-component-library-react-typescript/) 