"use client";

import { useState } from "react";
import { DialogForm, FormProvider } from "react-shadcn-crud-form";
import { z } from "zod";

// 定义用户数据类型
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  role: string;
  bio?: string;
}

// 定义表单验证模式
const userSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  age: z.number().min(18, "年龄必须大于等于18").max(100, "年龄必须小于等于100"),
  isActive: z.boolean(),
  role: z.string().min(1, "请选择角色"),
  bio: z.string().optional(),
});

// 模拟数据
const mockUsers: User[] = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    age: 28,
    isActive: true,
    role: "admin",
    bio: "系统管理员，负责平台维护和用户管理。",
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    age: 25,
    isActive: false,
    role: "user",
    bio: "普通用户，主要使用平台的基础功能。",
  },
];

// 简单的Button组件
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm";
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1 text-sm",
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default function Home() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 创建用户
  const handleCreate = (data: any) => {
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...data,
    };
    setUsers([...users, newUser]);
    setIsCreateOpen(false);
  };

  // 编辑用户
  const handleEdit = (data: any) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...editingUser, ...data } : user
      ));
      setIsEditOpen(false);
      setEditingUser(null);
    }
  };

  // 删除用户
  const handleDelete = (userId: number) => {
    if (confirm("确定要删除这个用户吗？")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // 开始编辑
  const startEdit = (user: User) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  return (
    <FormProvider>
      <div className="container mx-auto p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          React Shadcn CRUD Form 组件测试
        </h1>
        
        {/* 创建用户按钮 */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">用户管理</h2>
          <Button onClick={() => setIsCreateOpen(true)}>
            添加用户
          </Button>
        </div>

        {/* 用户列表 */}
        <div className="grid gap-4 mb-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-medium">年龄:</span> {user.age}</p>
                    <p>
                      <span className="font-medium">状态:</span> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        user.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.isActive ? "活跃" : "不活跃"}
                      </span>
                    </p>
                    <p><span className="font-medium">角色:</span> {user.role}</p>
                    {user.bio && (
                      <p><span className="font-medium">简介:</span> {user.bio}</p>
                    )}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(user)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 创建用户对话框 */}
        <DialogForm
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          title="添加新用户"
          description="请填写用户信息"
          schema={userSchema}
          fields={[
            {
              key: "name",
              label: "姓名",
              type: "input",
              placeholder: "请输入姓名",
            },
            {
              key: "email",
              label: "邮箱",
              type: "input",
              placeholder: "请输入邮箱地址",
            },
            {
              key: "age",
              label: "年龄",
              type: "number",
              placeholder: "请输入年龄",
            },
            {
              key: "isActive",
              label: "是否活跃",
              type: "checkbox",
            },
            {
              key: "role",
              label: "角色",
              type: "select",
              options: [
                { label: "管理员", value: "admin" },
                { label: "普通用户", value: "user" },
                { label: "访客", value: "guest" },
              ],
            },
            {
              key: "bio",
              label: "个人简介",
              type: "textarea",
              placeholder: "请输入个人简介（可选）",
            },
          ]}
          defaultValues={{
            name: "",
            email: "",
            age: 18,
            isActive: true,
            role: "",
            bio: "",
          }}
          onSubmit={handleCreate}
          submitText="创建用户"
          cancelText="取消"
        />

        {/* 编辑用户对话框 */}
        <DialogForm
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          title="编辑用户"
          description="修改用户信息"
          schema={userSchema}
          fields={[
            {
              key: "name",
              label: "姓名",
              type: "input",
              placeholder: "请输入姓名",
            },
            {
              key: "email",
              label: "邮箱",
              type: "input",
              placeholder: "请输入邮箱地址",
            },
            {
              key: "age",
              label: "年龄",
              type: "number",
              placeholder: "请输入年龄",
            },
            {
              key: "isActive",
              label: "是否活跃",
              type: "checkbox",
            },
            {
              key: "role",
              label: "角色",
              type: "select",
              options: [
                { label: "管理员", value: "admin" },
                { label: "普通用户", value: "user" },
                { label: "访客", value: "guest" },
              ],
            },
            {
              key: "bio",
              label: "个人简介",
              type: "textarea",
              placeholder: "请输入个人简介（可选）",
            },
          ]}
          defaultValues={editingUser || {
            name: "",
            email: "",
            age: 18,
            isActive: true,
            role: "",
            bio: "",
          }}
          onSubmit={handleEdit}
          submitText="更新用户"
          cancelText="取消"
        />

        {/* 功能说明 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">测试功能说明：</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• 点击"添加用户"按钮可以创建新用户</li>
            <li>• 点击用户卡片右侧的"编辑"按钮可以修改用户信息</li>
            <li>• 点击"删除"按钮可以删除用户（会弹出确认对话框）</li>
            <li>• 表单包含各种字段类型：文本输入、数字输入、复选框、下拉选择、文本域</li>
            <li>• 支持数据验证：姓名长度、邮箱格式、年龄范围等</li>
            <li>• 使用了 Zod 进行类型安全的表单验证</li>
          </ul>
        </div>
      </div>
    </FormProvider>
  );
} 