import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const production = !process.env.ROLLUP_WATCH;

// 库的外部依赖配置
const external = [
  // 对等依赖
  ...Object.keys(packageJson.peerDependencies || {}),
  // React 相关
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  // 避免打包一些常见的 Node.js 模块
  'fs', 'path', 'url', 'util'
];

// 自定义插件：保留 "use client" 指令
const preserveUseClient = () => ({
  name: 'preserve-use-client',
  generateBundle(options, bundle) {
    for (const fileName in bundle) {
      const chunk = bundle[fileName];
      if (chunk.type === 'chunk') {
        // 在每个chunk开头添加 "use client" 指令
        chunk.code = `"use client";\n${chunk.code}`;
      }
    }
  }
});

// 通用插件配置
const getPlugins = (generateDeclarations = false) => [
  // 外部化对等依赖
  peerDepsExternal(),
  
  // 解析 node_modules 中的模块
  resolve({
    browser: true,
    preferBuiltins: false,
    exportConditions: ['node', 'default', 'module', 'import'],
  }),
  
  // 转换 CommonJS 模块
  commonjs({
    include: /node_modules/,
  }),
  
  // TypeScript 编译
  typescript({
    tsconfig: './tsconfig.lib.json',
    declaration: generateDeclarations,
    declarationMap: generateDeclarations,
    exclude: [
      '**/*.test.*',
      '**/*.spec.*',
      '**/examples/**/*',
      '**/src/app/**/*'
    ],
    // 输出到文件系统，避免警告
    outputToFilesystem: true,
  }),
  
  // 保留 "use client" 指令
  preserveUseClient(),
  
  // 生产环境压缩
  production && terser({
    compress: {
      drop_console: false, // 保留 console，让用户决定
      drop_debugger: true,
    },
    mangle: {
      reserved: ['React', 'ReactDOM'], // 保留这些全局变量名
    },
    format: {
      comments: /use client|use server/, // 保留 "use client" 和 "use server" 注释
    },
  }),
].filter(Boolean);

export default [
  // 主要的库打包配置
  {
    input: 'index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        interop: 'compat',
        banner: '"use client";', // 在文件顶部添加 "use client"
      },
      {
        file: packageJson.module || 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named',
        banner: '"use client";', // 在文件顶部添加 "use client"
      },
    ],
    plugins: getPlugins(),
    external,
    // 监听模式下的配置
    watch: {
      include: ['src/**', 'index.ts'],
      exclude: ['node_modules/**'],
    },
    // 关闭警告
    onwarn(warning, warn) {
      // 忽略 "use client" 相关的警告
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
  },
  
  // 类型声明文件打包配置
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.lib.json',
        compilerOptions: {
          removeComments: false, // 保留注释，提供更好的开发体验
        },
      }),
    ],
    external,
  },
];