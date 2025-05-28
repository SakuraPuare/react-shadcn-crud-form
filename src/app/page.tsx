"use client";

import React, { useState, useCallback } from "react";
import { DialogForm, FormProvider } from "@/index";
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
    avatar?: string;
    skills?: string[];
    joinDate?: string;
}

// 定义表单验证模式
const userSchema = z.object({
    name: z.string().min(2, "姓名至少需要2个字符"),
    email: z.string().email("请输入有效的邮箱地址"),
    age: z
        .number()
        .min(18, "年龄必须大于等于18")
        .max(100, "年龄必须小于等于100"),
    isActive: z.boolean(),
    role: z.string().min(1, "请选择角色"),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    skills: z.array(z.string()).optional(),
    joinDate: z.string().optional(),
});

// 模拟数据
const initialUsers: User[] = [
    {
        id: 1,
        name: "张三",
        email: "zhangsan@example.com",
        age: 28,
        isActive: true,
        role: "admin",
        bio: "系统管理员，负责平台维护和用户管理。",
        skills: ["React", "TypeScript", "Node.js"],
        joinDate: "2023-01-15",
    },
    {
        id: 2,
        name: "李四",
        email: "lisi@example.com",
        age: 25,
        isActive: false,
        role: "user",
        bio: "普通用户，主要使用平台的基础功能。",
        skills: ["JavaScript", "Vue.js"],
        joinDate: "2023-03-22",
    },
    {
        id: 3,
        name: "王五",
        email: "wangwu@example.com",
        age: 32,
        isActive: true,
        role: "moderator",
        bio: "内容审核员，负责平台内容的审核和管理。",
        skills: ["Python", "Django", "PostgreSQL"],
        joinDate: "2022-11-08",
    },
];

// 角色选项
const roleOptions = [
    { value: "admin", label: "管理员" },
    { value: "moderator", label: "审核员" },
    { value: "user", label: "普通用户" },
    { value: "guest", label: "访客" },
];

// 技能选项
const skillOptions = [
    { value: "React", label: "React" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Vue.js", label: "Vue.js" },
    { value: "Python", label: "Python" },
    { value: "Django", label: "Django" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Docker", label: "Docker" },
];

// 简单的UI组件
const Button = ({
    children,
    onClick,
    variant = "default",
    size = "default",
    className = "",
    disabled = false,
    ...props
}: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "default" | "outline" | "destructive";
    size?: "default" | "sm";
    className?: string;
    disabled?: boolean;
    [key: string]: any;
}) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline:
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
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
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

const Badge = ({
    children,
    variant = "default",
}: {
    children: React.ReactNode;
    variant?: "default" | "secondary" | "destructive";
}) => {
    const baseClasses =
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    const variantClasses = {
        default: "bg-blue-100 text-blue-800",
        secondary: "bg-gray-100 text-gray-800",
        destructive: "bg-red-100 text-red-800",
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]}`}>
            {children}
        </span>
    );
};

export default function HomePage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // 处理创建用户
    const handleCreateUser = useCallback(
        (data: any) => {
            const newUser: User = {
                id: Math.max(...users.map((u) => u.id)) + 1,
                ...data,
            };
            setUsers((prev) => [...prev, newUser]);
            setIsCreateDialogOpen(false);
        },
        [users],
    );

    // 处理编辑用户
    const handleEditUser = useCallback(
        (data: any) => {
            if (!editingUser) return;

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === editingUser.id ? { ...user, ...data } : user,
                ),
            );
            setIsEditDialogOpen(false);
            setEditingUser(null);
        },
        [editingUser],
    );

    // 处理删除用户
    const handleDeleteUser = useCallback((userId: number) => {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
    }, []);

    // 打开编辑对话框
    const openEditDialog = useCallback((user: User) => {
        setEditingUser(user);
        setIsEditDialogOpen(true);
    }, []);

    return (
        <FormProvider>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* 页面标题 */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            React ShadCN CRUD Form
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">
                            基于 shadcn/ui 和 react-hook-form 的现代化 React
                            CRUD 表单组件库
                        </p>
                        <div className="flex justify-center space-x-2">
                            <Badge>TypeScript</Badge>
                            <Badge>React Hook Form</Badge>
                            <Badge>Zod Validation</Badge>
                            <Badge>Tailwind CSS</Badge>
                        </div>
                    </div>

                    {/* 功能演示区域 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                用户管理演示
                            </h2>
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                + 添加用户
                            </Button>
                        </div>

                        {/* 用户列表 */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            用户信息
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            角色
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            状态
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            技能
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        年龄: {user.age}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    variant={
                                                        user.role === "admin"
                                                            ? "default"
                                                            : user.role ===
                                                              "moderator"
                                                            ? "secondary"
                                                            : "secondary"
                                                    }
                                                >
                                                    {roleOptions.find(
                                                        (r) =>
                                                            r.value ===
                                                            user.role,
                                                    )?.label || user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    variant={
                                                        user.isActive
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {user.isActive
                                                        ? "激活"
                                                        : "未激活"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.skills
                                                        ?.slice(0, 2)
                                                        .map((skill) => (
                                                            <Badge
                                                                key={skill}
                                                                variant="secondary"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    {user.skills &&
                                                        user.skills.length >
                                                            2 && (
                                                            <Badge variant="secondary">
                                                                +
                                                                {user.skills
                                                                    .length - 2}
                                                            </Badge>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEditDialog(user)
                                                        }
                                                    >
                                                        编辑
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.id,
                                                            )
                                                        }
                                                    >
                                                        删除
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 组件特性说明 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                🎨 现代化UI
                            </h3>
                            <p className="text-gray-600">
                                基于 shadcn/ui
                                构建，提供一致的设计系统和优美的用户界面
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                🔍 类型安全
                            </h3>
                            <p className="text-gray-600">
                                完整的 TypeScript 支持，配合 Zod
                                进行表单验证，确保类型安全
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                ⚡ 高性能
                            </h3>
                            <p className="text-gray-600">
                                基于 react-hook-form
                                构建，提供优秀的性能和用户体验
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                🔧 灵活配置
                            </h3>
                            <p className="text-gray-600">
                                支持多种表单控件类型，可根据需求灵活配置表单结构
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                📱 响应式设计
                            </h3>
                            <p className="text-gray-600">
                                完全响应式设计，适配各种屏幕尺寸和设备类型
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                🚀 易于使用
                            </h3>
                            <p className="text-gray-600">
                                简洁的API设计，开箱即用，快速集成到现有项目中
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* 创建用户对话框 */}
                    <DialogForm
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                        title="添加新用户"
                        description="请填写用户信息来创建新用户"
                        formSchema={userSchema}
                        size="lg"
                        defaultValues={{
                            name: "",
                            email: "",
                            age: 18,
                            isActive: true,
                            role: "user",
                            bio: "",
                            avatar: "",
                            skills: [],
                            joinDate: "",
                        }}
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
                            age: {
                                type: "number",
                                label: "年龄",
                                placeholder: "请输入年龄",
                            },
                            role: {
                                type: "select",
                                label: "角色",
                                placeholder: "请选择角色",
                                options: roleOptions,
                            },
                            skills: {
                                type: "multiselect",
                                label: "技能",
                                placeholder: "请选择技能",
                                options: skillOptions,
                            },
                            isActive: {
                                type: "checkbox",
                                label: "激活状态",
                            },
                            joinDate: {
                                type: "input",
                                label: "加入日期",
                                placeholder: "选择日期",
                            },
                            bio: {
                                type: "textarea",
                                label: "个人简介",
                                placeholder: "请输入个人简介（可选）",
                            },
                        }}
                        onSubmit={handleCreateUser}
                        submitButtonText="创建用户"
                    />

                    {/* 编辑用户对话框 */}
                    <DialogForm
                        open={isEditDialogOpen}
                        onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) {
                                setEditingUser(null);
                            }
                        }}
                        title="编辑用户"
                        description="修改用户信息"
                        formSchema={userSchema}
                        size="lg"
                        defaultValues={
                            editingUser
                                ? {
                                      name: editingUser.name,
                                      email: editingUser.email,
                                      age: editingUser.age,
                                      isActive: editingUser.isActive,
                                      role: editingUser.role,
                                      bio: editingUser.bio || "",
                                      avatar: editingUser.avatar || "",
                                      skills: editingUser.skills || [],
                                      joinDate: editingUser.joinDate || "",
                                  }
                                : {
                                      name: "",
                                      email: "",
                                      age: 18,
                                      isActive: true,
                                      role: "user",
                                      bio: "",
                                      avatar: "",
                                      skills: [],
                                      joinDate: "",
                                  }
                        }
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
                            age: {
                                type: "number",
                                label: "年龄",
                                placeholder: "请输入年龄",
                            },
                            role: {
                                type: "select",
                                label: "角色",
                                placeholder: "请选择角色",
                                options: roleOptions,
                            },
                            skills: {
                                type: "multiselect",
                                label: "技能",
                                placeholder: "请选择技能",
                                options: skillOptions,
                            },
                            isActive: {
                                type: "checkbox",
                                label: "激活状态",
                            },
                            joinDate: {
                                type: "input",
                                label: "加入日期",
                                placeholder: "选择日期",
                            },
                            bio: {
                                type: "textarea",
                                label: "个人简介",
                                placeholder: "请输入个人简介（可选）",
                            },
                        }}
                        onSubmit={handleEditUser}
                        submitButtonText="保存更改"
                    />
                </div>
            </div>
        </FormProvider>
    );
}
