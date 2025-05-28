import React, { useState } from 'react';
import { DialogForm, FormProvider, useFormContext } from 'react-shadcn-crud-form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 复杂的产品表单 Schema
const productSchema = z.object({
  name: z.string().min(1, '产品名称不能为空'),
  description: z.string().min(10, '描述至少10个字符'),
  price: z.number().min(0.01, '价格必须大于0'),
  category: z.string().min(1, '请选择分类'),
  tags: z.array(z.string()).min(1, '至少选择一个标签'),
  isActive: z.boolean(),
  images: z.array(z.string()).optional(),
  metadata: z.object({
    weight: z.number().optional(),
    dimensions: z.string().optional(),
    color: z.string().optional(),
  }).optional(),
});

type Product = z.infer<typeof productSchema>;

// 主题切换组件
function ThemeToggle() {
  const { updateConfig, theme } = useFormContext();
  
  const toggleTheme = () => {
    updateConfig({
      theme: {
        dialogMaxWidth: theme?.dialogMaxWidth === '95%' ? '60%' : '95%',
        fieldSpacing: theme?.fieldSpacing === 'space-y-2' ? 'space-y-6' : 'space-y-2',
      },
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
    >
      切换主题: {theme?.dialogMaxWidth === '95%' ? '紧凑' : '宽松'}
    </button>
  );
}

// 自定义图片上传渲染器
const ImageUploadRenderer = ({ field, fieldConfig }) => {
  const [preview, setPreview] = useState<string[]>(field.value || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setPreview(imageUrls);
    field.onChange(imageUrls);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {preview.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`预览 ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  const newPreview = preview.filter((_, i) => i !== index);
                  setPreview(newPreview);
                  field.onChange(newPreview);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function AdvancedUsageExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 创建表单的react-hook-form实例
  const createForm = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      tags: [],
      isActive: true,
      images: [],
      metadata: {},
    },
  });

  // 编辑表单的react-hook-form实例
  const editForm = useForm<Product>({
    resolver: zodResolver(productSchema),
  });

  const handleCreate = (data: Product) => {
    setProducts(prev => [...prev, { ...data, id: Date.now() } as any]);
    setIsCreateOpen(false);
    createForm.reset();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    editForm.reset(product);
    setIsEditOpen(true);
  };

  const handleUpdate = (data: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === editingProduct?.id ? { ...data, id: editingProduct.id } : p)
    );
    setIsEditOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const categoryOptions = [
    { value: 'electronics', label: '电子产品' },
    { value: 'clothing', label: '服装配饰' },
    { value: 'books', label: '图书文具' },
    { value: 'home', label: '家居用品' },
    { value: 'sports', label: '运动户外' },
  ];

  const tagOptions = [
    { value: 'new', label: '新品' },
    { value: 'hot', label: '热销' },
    { value: 'sale', label: '特价' },
    { value: 'limited', label: '限量' },
    { value: 'bestseller', label: '畅销' },
  ];

  const fieldConfigs = {
    name: {
      type: 'input' as const,
      label: '产品名称',
      placeholder: '请输入产品名称',
    },
    description: {
      type: 'textarea' as const,
      label: '产品描述',
      placeholder: '详细描述产品特点和用途...',
    },
    price: {
      type: 'number' as const,
      label: '价格 (¥)',
      placeholder: '0.00',
    },
    category: {
      type: 'select' as const,
      label: '产品分类',
      options: categoryOptions,
    },
    tags: {
      type: 'multiselect' as const,
      label: '产品标签',
      options: tagOptions,
    },
    isActive: {
      type: 'checkbox' as const,
      label: '立即上架',
    },
    images: {
      type: 'custom' as const,
      label: '产品图片',
      render: ImageUploadRenderer,
    },
    'metadata.weight': {
      type: 'number' as const,
      label: '重量 (kg)',
      placeholder: '可选',
    },
    'metadata.dimensions': {
      type: 'input' as const,
      label: '尺寸',
      placeholder: '长x宽x高 (cm)',
    },
    'metadata.color': {
      type: 'input' as const,
      label: '颜色',
      placeholder: '主要颜色',
    },
  };

  return (
    <FormProvider
      config={{
        defaultSubmitText: '保存产品',
        defaultCancelText: '取消',
        defaultShowCancelButton: true,
        validationMode: 'onBlur',
        theme: {
          dialogMaxWidth: '60%',
          dialogMaxHeight: '90vh',
          fieldSpacing: 'space-y-6',
        },
        globalFieldConfigs: {
          name: { placeholder: '全局：请输入名称' },
          description: { placeholder: '全局：请输入描述' },
        },
      }}
    >
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">产品管理系统</h1>
          <div className="flex gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              添加产品
            </button>
          </div>
        </div>

        {/* 产品列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-6 bg-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-xl">{product.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isActive ? '上架' : '下架'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="mb-3">
                <span className="text-2xl font-bold text-green-600">¥{product.price}</span>
                <span className="ml-2 text-sm text-gray-500">{product.category}</span>
              </div>
              
              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  {product.tags.map(tag => (
                    <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                      {tagOptions.find(opt => opt.value === tag)?.label || tag}
                    </span>
                  ))}
                </div>
              )}
              
              {product.images && product.images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              暂无产品，点击"添加产品"开始创建
            </div>
          )}
        </div>

        {/* 创建产品对话框 */}
        <DialogForm
          title="创建新产品"
          description="填写产品的详细信息"
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          formSchema={productSchema}
          formMethods={createForm}
          fieldConfigs={fieldConfigs}
          onSubmit={handleCreate}
          fieldOrder={['name', 'description', 'price', 'category', 'tags', 'isActive', 'images', 'metadata.weight', 'metadata.dimensions', 'metadata.color']}
        />

        {/* 编辑产品对话框 */}
        <DialogForm
          title="编辑产品"
          description="修改产品信息"
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          formSchema={productSchema}
          formMethods={editForm}
          fieldConfigs={fieldConfigs}
          onSubmit={handleUpdate}
          submitButtonText="更新产品"
          fieldOrder={['name', 'description', 'price', 'category', 'tags', 'isActive', 'images', 'metadata.weight', 'metadata.dimensions', 'metadata.color']}
        />
      </div>
    </FormProvider>
  );
} 