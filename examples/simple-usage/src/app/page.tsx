"use client";

import { useState } from "react";
import { z } from "zod";
import { DialogForm } from "react-shadcn-crud-form";

// 用户表单 Schema
const userSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  age: z.number().min(1, "年龄必须大于0").max(120, "年龄不能超过120"),
  gender: z.enum(["male", "female", "other"]),
  bio: z.string().optional(),
  newsletter: z.boolean().default(false),
});

// 产品表单 Schema
const productSchema = z.object({
  name: z.string().min(1, "产品名称不能为空"),
  price: z.number().min(0, "价格不能为负数"),
  category: z.string().min(1, "请选择分类"),
  tags: z.array(z.string()),
  description: z.string().optional(),
  inStock: z.boolean().default(true),
});

// 联系表单 Schema
const contactSchema = z.object({
  subject: z.string().min(1, "主题不能为空"),
  message: z.string().min(10, "消息至少需要10个字符"),
  priority: z.enum(["low", "medium", "high"]),
  department: z.string(),
});

type User = z.infer<typeof userSchema>;
type Product = z.infer<typeof productSchema>;
type Contact = z.infer<typeof contactSchema>;

export default function Home() {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleUserSubmit = (data: User) => {
    setUsers([...users, data]);
    setUserDialogOpen(false);
    console.log("新用户:", data);
  };

  const handleProductSubmit = (data: Product) => {
    setProducts([...products, data]);
    setProductDialogOpen(false);
    console.log("新产品:", data);
  };

  const handleContactSubmit = (data: Contact) => {
    setContacts([...contacts, data]);
    setContactDialogOpen(false);
    console.log("新联系:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React Shadcn CRUD Form Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于 shadcn/ui 和 react-hook-form 的现代化 React CRUD 表单组件库演示
          </p>
          <div className="mt-6 space-x-4">
            <a
              href="https://github.com/SakuraPuare/react-shadcn-crud-form"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              📖 查看文档
            </a>
            <a
              href="https://www.npmjs.com/package/react-shadcn-crud-form"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              📦 NPM 包
            </a>
          </div>
        </div>

        {/* 功能演示区域 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* 用户管理演示 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              用户管理
            </h2>
            <p className="text-gray-600 mb-6">
              演示基础表单字段：文本输入、数字输入、选择框、复选框
            </p>
            <button
              onClick={() => setUserDialogOpen(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ 添加用户
            </button>

            {users.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">已添加用户：</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {users.map((user, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      {user.name} ({user.email})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 产品管理演示 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              产品管理
            </h2>
            <p className="text-gray-600 mb-6">
              演示高级功能：多选标签、动态字段配置、复杂验证
            </p>
            <button
              onClick={() => setProductDialogOpen(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ 添加产品
            </button>

            {products.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">已添加产品：</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {products.map((product, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      {product.name} (¥{product.price})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 联系表单演示 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              联系表单
            </h2>
            <p className="text-gray-600 mb-6">
              演示文本域、优先级选择、部门选择等常用表单元素
            </p>
            <button
              onClick={() => setContactDialogOpen(true)}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ➕ 提交联系
            </button>

            {contacts.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">已提交联系：</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {contacts.map((contact, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      {contact.subject} ({contact.priority})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 特性说明 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            主要特性
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">类型安全</h3>
              <p className="text-gray-600 text-sm">
                基于 Zod 和 TypeScript，提供完整的类型推导和验证
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold text-gray-800 mb-2">现代 UI</h3>
              <p className="text-gray-600 text-sm">
                基于 shadcn/ui，提供美观且可定制的界面组件
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">高性能</h3>
              <p className="text-gray-600 text-sm">
                使用 react-hook-form，最小化重渲染，性能卓越
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold text-gray-800 mb-2">易于使用</h3>
              <p className="text-gray-600 text-sm">
                简单的 API 设计，快速构建复杂的 CRUD 表单
              </p>
            </div>
          </div>
        </div>

        <DialogForm
          title="添加新产品"
          description="请填写产品的详细信息"
          open={productDialogOpen}
          onOpenChange={setProductDialogOpen}
          formSchema={productSchema}
          onSubmit={handleProductSubmit}
          defaultValues={{
            name: "",
            price: 0,
            category: "",
            tags: [],
            description: "",
            inStock: true,
          }}
          fieldConfigs={{
            name: {
              type: "input",
              label: "产品名称",
              placeholder: "请输入产品名称",
            },
            price: {
              type: "number",
              label: "价格 (¥)",
              placeholder: "请输入产品价格",
            },
            category: {
              type: "select",
              label: "产品分类",
              options: [
                { value: "electronics", label: "电子产品" },
                { value: "clothing", label: "服装" },
                { value: "books", label: "图书" },
                { value: "home", label: "家居用品" },
                { value: "sports", label: "运动用品" },
              ],
            },
            tags: {
              type: "multiselect",
              label: "产品标签",
              options: [
                { value: "new", label: "新品" },
                { value: "hot", label: "热销" },
                { value: "sale", label: "促销" },
                { value: "limited", label: "限量" },
                { value: "eco", label: "环保" },
              ],
            },
            description: {
              type: "textarea",
              label: "产品描述",
              placeholder: "请输入产品描述（可选）",
            },
            inStock: {
              type: "checkbox",
              label: "有库存",
            },
          }}
        />

        <DialogForm
          title="提交联系信息"
          description="我们会尽快回复您的消息"
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          formSchema={contactSchema}
          onSubmit={handleContactSubmit}
          defaultValues={{
            subject: "",
            message: "",
            priority: "medium",
            department: "",
          }}
          fieldConfigs={{
            subject: {
              type: "input",
              label: "主题",
              placeholder: "请输入联系主题",
            },
            message: {
              type: "textarea",
              label: "消息内容",
              placeholder: "请详细描述您的问题或建议...",
            },
            priority: {
              type: "select",
              label: "优先级",
              options: [
                { value: "low", label: "低" },
                { value: "medium", label: "中" },
                { value: "high", label: "高" },
              ],
            },
            department: {
              type: "select",
              label: "联系部门",
              options: [
                { value: "sales", label: "销售部" },
                { value: "support", label: "技术支持" },
                { value: "billing", label: "财务部" },
                { value: "general", label: "综合事务" },
              ],
            },
          }}
        />

        {/* 表单对话框 */}
        <DialogForm
          title="添加新用户"
          description="请填写用户的基本信息"
          open={userDialogOpen}
          onOpenChange={setUserDialogOpen}
          formSchema={userSchema}
          onSubmit={handleUserSubmit}
          defaultValues={{
            name: "",
            email: "",
            age: 25,
            gender: "male",
            bio: "",
            newsletter: false,
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
            gender: {
              type: "select",
              label: "性别",
              options: [
                { value: "male", label: "男" },
                { value: "female", label: "女" },
                { value: "other", label: "其他" },
              ],
            },
            bio: {
              type: "textarea",
              label: "个人简介",
              placeholder: "请输入个人简介（可选）",
            },
            newsletter: {
              type: "checkbox",
              label: "订阅邮件通知",
            },
          }}
        />
      </div>
    </div>
  );
}
