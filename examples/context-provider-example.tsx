import React, { useState } from 'react';
import { FormProvider, DialogForm, useFormContext, useFormInstance } from 'react-shadcn-crud-form';
import { z } from 'zod';

// 定义用户数据模式
const userSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  age: z.number().min(18, "年龄必须大于18岁"),
  department: z.string().min(1, "部门不能为空"),
  isActive: z.boolean().default(true),
});

type User = z.infer<typeof userSchema>;

// 组件内部使用 Context 的示例
function FormStatusDisplay() {
  const { validationMode, theme, defaultSubmitText } = useFormContext();
  const userFormInstance = useFormInstance('user-form');
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg mb-4">
      <h3 className="font-medium text-gray-900 mb-2">当前表单配置</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>验证模式: {validationMode}</li>
        <li>默认提交按钮文本: {defaultSubmitText}</li>
        <li>对话框最大宽度: {theme?.dialogMaxWidth}</li>
        <li>用户表单状态: {userFormInstance.isActive ? '激活' : '未激活'}</li>
      </ul>
    </div>
  );
}

// 主要的用户管理组件
function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { name: '张三', email: 'zhangsan@example.com', age: 25, department: '技术部', isActive: true },
    { name: '李四', email: 'lisi@example.com', age: 30, department: '销售部', isActive: false },
  ]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { updateConfig } = useFormContext();

  const handleSubmit = (data: User) => {
    if (editingUser) {
      // 更新用户
      setUsers(users.map(user => 
        user.email === editingUser.email ? data : user
      ));
    } else {
      // 添加新用户
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

  const toggleValidationMode = () => {
    updateConfig?.({
      validationMode: Math.random() > 0.5 ? 'onSubmit' : 'onChange'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">用户管理系统</h1>
        <div className="space-x-2">
          <button 
            onClick={toggleValidationMode}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            切换验证模式
          </button>
          <button 
            onClick={openCreateDialog}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            添加用户
          </button>
        </div>
      </div>

      <FormStatusDisplay />

      <DialogForm
        formId="user-form"
        title={editingUser ? "编辑用户" : "添加用户"}
        description="请填写用户信息"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formSchema={userSchema}
        defaultValues={editingUser || {
          name: '',
          email: '',
          age: 18,
          department: '',
          isActive: true,
        }}
        fieldConfigs={{
          name: { 
            type: 'input', 
            label: '姓名',
            placeholder: '请输入姓名'
          },
          email: { 
            type: 'input', 
            label: '邮箱地址',
            placeholder: '请输入邮箱地址'
          },
          age: { 
            type: 'number', 
            label: '年龄',
            placeholder: '请输入年龄'
          },
          department: { 
            type: 'select', 
            label: '部门',
            options: [
              { value: '技术部', label: '技术部' },
              { value: '销售部', label: '销售部' },
              { value: '市场部', label: '市场部' },
              { value: '人事部', label: '人事部' },
            ]
          },
          isActive: { 
            type: 'checkbox', 
            label: '激活状态',
            description: '取消勾选以停用此用户'
          },
        }}
        onSubmit={handleSubmit}
        submitText={editingUser ? "更新用户" : "创建用户"}
        showCancelButton
      />

      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">用户列表</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? '激活' : '停用'}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <span>{user.email}</span>
                  <span className="mx-2">•</span>
                  <span>{user.department}</span>
                  <span className="mx-2">•</span>
                  <span>{user.age}岁</span>
                </div>
              </div>
              <button
                onClick={() => openEditDialog(user)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                编辑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 应用程序根组件，包含 FormProvider
export default function App() {
  return (
    <FormProvider 
      config={{
        // 全局配置
        defaultSubmitText: "确认",
        defaultCancelText: "取消",
        defaultShowCancelButton: true,
        validationMode: "onSubmit",
        
        // 主题配置
        theme: {
          dialogMaxWidth: "70%",
          dialogMaxHeight: "85vh",
          fieldSpacing: "space-y-6",
        },
        
        // 全局字段配置
        globalFieldConfigs: {
          email: {
            type: 'input',
            placeholder: '请输入邮箱地址',
          },
          password: {
            type: 'input',
            placeholder: '请输入密码',
          },
          name: {
            type: 'input',
            placeholder: '请输入姓名',
          }
        },
      }}
    >
      <UserManagement />
    </FormProvider>
  );
}

// 导出其他可能用到的组件和 hooks
export { FormProvider, useFormContext, useFormInstance } from 'react-shadcn-crud-form'; 