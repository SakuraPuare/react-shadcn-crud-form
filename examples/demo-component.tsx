/**
 * 演示组件：展示 react-shadcn-crud-form 的 Context Provider 和依赖管理
 * 
 * 使用说明：
 * 1. 确保您的项目已安装 shadcn/ui 相关组件
 * 2. 安装 react-shadcn-crud-form@0.3.0
 * 3. 复制此组件到您的项目中使用
 */

import React, { useState } from 'react';
import { z } from 'zod';

// 这些导入会从您项目的 shadcn/ui 组件中获取
// import { FormProvider, DialogForm, useFormContext } from 'react-shadcn-crud-form';

// 用户数据模式
const userSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  age: z.number().min(18, "年龄必须大于18岁").max(100, "年龄不能超过100岁"),
  department: z.string().min(1, "部门不能为空"),
  role: z.enum(['admin', 'user', 'viewer']),
  isActive: z.boolean().default(true),
  bio: z.string().optional(),
});

type User = z.infer<typeof userSchema>;

// 模拟数据
const mockUsers: User[] = [
  {
    name: '张三',
    email: 'zhangsan@example.com',
    age: 28,
    department: '技术部',
    role: 'admin',
    isActive: true,
    bio: '高级前端开发工程师，专注于 React 生态系统'
  },
  {
    name: '李四',
    email: 'lisi@example.com',
    age: 25,
    department: '产品部',
    role: 'user',
    isActive: true,
    bio: '产品经理，关注用户体验和产品设计'
  },
  {
    name: '王五',
    email: 'wangwu@example.com',
    age: 30,
    department: '市场部',
    role: 'viewer',
    isActive: false,
    bio: '市场分析师，专业数据分析'
  }
];

// Context 状态显示组件
export function FormContextDemo() {
  // const { validationMode, theme, defaultSubmitText, globalFieldConfigs } = useFormContext();
  
  // 模拟 Context 数据用于演示
  const mockContext = {
    validationMode: 'onSubmit',
    theme: {
      dialogMaxWidth: '70%',
      dialogMaxHeight: '85vh',
      fieldSpacing: 'space-y-6',
    },
    defaultSubmitText: '确认',
    globalFieldConfigs: {
      email: { placeholder: '请输入邮箱地址' },
      name: { placeholder: '请输入姓名' }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Context Provider 配置状态</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md border">
          <h4 className="font-medium text-gray-900 mb-2">验证配置</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>验证模式: <span className="font-mono bg-gray-100 px-1 rounded">{mockContext.validationMode}</span></li>
            <li>提交按钮文本: <span className="font-mono bg-gray-100 px-1 rounded">{mockContext.defaultSubmitText}</span></li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-md border">
          <h4 className="font-medium text-gray-900 mb-2">主题配置</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>对话框宽度: <span className="font-mono bg-gray-100 px-1 rounded">{mockContext.theme.dialogMaxWidth}</span></li>
            <li>对话框高度: <span className="font-mono bg-gray-100 px-1 rounded">{mockContext.theme.dialogMaxHeight}</span></li>
            <li>字段间距: <span className="font-mono bg-gray-100 px-1 rounded">{mockContext.theme.fieldSpacing}</span></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 bg-white p-4 rounded-md border">
        <h4 className="font-medium text-gray-900 mb-2">全局字段配置</h4>
        <div className="text-sm text-gray-600">
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
{JSON.stringify(mockContext.globalFieldConfigs, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 用户管理演示组件
export function UserManagementDemo() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: User) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.email === editingUser.email ? data : user
      ));
    } else {
      setUsers([...users, data]);
    }
    
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 React ShadCN CRUD Form 演示</h1>
        <p className="text-gray-600">版本 0.3.0 - 基于用户 shadcn/ui 依赖的全新架构</p>
      </div>

      <FormContextDemo />

      <div className="mt-8 bg-white rounded-lg shadow-lg border">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">用户管理系统</h2>
            <p className="text-sm text-gray-500 mt-1">使用新的依赖管理策略，完全兼容您的 shadcn/ui 组件</p>
          </div>
          <button 
            onClick={openCreateDialog}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ➕ 添加用户
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '✅ 激活' : '❌ 停用'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'user' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? '👑 管理员' : 
                       user.role === 'user' ? '👤 用户' : '👁️ 观察者'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📧 {user.email} • 🏢 {user.department} • 🎂 {user.age}岁</div>
                    {user.bio && <div className="text-gray-500">💬 {user.bio}</div>}
                  </div>
                </div>
                
                <button
                  onClick={() => openEditDialog(user)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ✏️ 编辑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 表单对话框演示区域 */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? '编辑用户' : '添加用户'}
            </h3>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="font-medium mb-1">🎉 新功能展示：</p>
                <ul className="space-y-1 text-xs">
                  <li>✅ 不再直接依赖 Radix UI 组件</li>
                  <li>✅ 使用您项目中的 shadcn/ui 组件</li>
                  <li>✅ Context Provider 全局状态管理</li>
                  <li>✅ 完全的样式一致性</li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>在实际项目中，这里会显示完整的表单字段：</p>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• 姓名输入框</li>
                  <li>• 邮箱输入框</li>
                  <li>• 年龄数字输入</li>
                  <li>• 部门选择器</li>
                  <li>• 角色选择器</li>
                  <li>• 状态复选框</li>
                  <li>• 个人简介文本区域</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  // 模拟提交
                  setIsDialogOpen(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingUser ? '更新用户' : '创建用户'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 依赖管理说明组件
export function DependencyExplanation() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 新版本亮点 (v0.3.0)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border">
          <h3 className="text-lg font-semibold text-green-700 mb-3">✅ 优化后的依赖管理</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 移除直接的 Radix UI 依赖</li>
            <li>• 依赖用户现有的 shadcn/ui 组件</li>
            <li>• 避免版本冲突和重复安装</li>
            <li>• 保持完全的样式一致性</li>
          </ul>
        </div>
        
        <div className="bg-white p-5 rounded-lg border">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">🎯 Context Provider 增强</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 全局表单配置管理</li>
            <li>• 统一的验证模式设置</li>
            <li>• 主题和样式全局控制</li>
            <li>• 表单实例状态协调</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-5 rounded-lg border">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">📦 安装和使用</h3>
        <div className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto">
          <div className="mb-2 text-gray-700"># 安装包</div>
          <div className="mb-3">npm install react-shadcn-crud-form@0.3.0</div>
          
          <div className="mb-2 text-gray-700"># 确保已安装必需的 shadcn/ui 组件</div>
          <div>npx shadcn-ui@latest add button input dialog form select ...</div>
        </div>
      </div>
    </div>
  );
}

// 完整演示应用
export default function CompleteDemo() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <DependencyExplanation />
      <div className="mt-8">
        <UserManagementDemo />
      </div>
    </div>
  );
} 