import React, { useState } from 'react';
import { DialogForm, FormProvider } from 'react-shadcn-crud-form';
import { z } from 'zod';

// 定义用户表单 Schema
const userSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  age: z.number().min(18, '年龄必须大于18岁').max(100, '年龄不能超过100岁'),
  bio: z.string().optional(),
  isActive: z.boolean().default(true),
  role: z.enum(['admin', 'user', 'moderator']),
});

type User = z.infer<typeof userSchema>;

export function BasicUsageExample() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const handleSubmit = (data: User) => {
    console.log('提交的数据:', data);
    setUsers(prev => [...prev, data]);
    setOpen(false);
  };

  return (
    <FormProvider
      config={{
        defaultSubmitText: '创建用户',
        defaultCancelText: '取消',
        defaultShowCancelButton: true,
        theme: {
          dialogMaxWidth: '500px',
          dialogMaxHeight: '80vh',
          fieldSpacing: 'space-y-4',
        },
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">用户管理</h1>
          <button 
            onClick={() => setOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            添加用户
          </button>
        </div>

        {/* 用户列表 */}
        <div className="grid gap-4">
          {users.map((user, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    年龄: {user.age} | 角色: {user.role} | 
                    状态: {user.isActive ? '激活' : '未激活'}
                  </p>
                  {user.bio && (
                    <p className="mt-2 text-gray-700">{user.bio}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              暂无用户，点击上方按钮添加用户
            </div>
          )}
        </div>

        {/* 表单对话框 */}
        <DialogForm
          title="创建新用户"
          description="请填写用户的基本信息"
          open={open}
          onOpenChange={setOpen}
          formSchema={userSchema}
          defaultValues={{
            name: '',
            email: '',
            age: 18,
            bio: '',
            isActive: true,
            role: 'user' as const,
          }}
          fieldConfigs={{
            name: {
              type: 'input',
              label: '姓名',
              placeholder: '请输入姓名',
            },
            email: {
              type: 'input',
              label: '邮箱地址',
              placeholder: 'user@example.com',
            },
            age: {
              type: 'number',
              label: '年龄',
              placeholder: '18',
            },
            bio: {
              type: 'textarea',
              label: '个人简介',
              placeholder: '简单介绍一下自己...',
            },
            isActive: {
              type: 'checkbox',
              label: '激活用户',
            },
            role: {
              type: 'select',
              label: '用户角色',
              options: [
                { value: 'user', label: '普通用户' },
                { value: 'moderator', label: '管理员' },
                { value: 'admin', label: '超级管理员' },
              ],
            },
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </FormProvider>
  );
} 