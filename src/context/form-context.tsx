"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { FieldConfig } from '../types';

/**
 * 表单上下文的配置接口
 */
export interface FormContextConfig {
  /** 全局字段配置 */
  globalFieldConfigs?: Record<string, Partial<FieldConfig>>;
  /** 全局提交按钮文本 */
  defaultSubmitText?: string;
  /** 全局取消按钮文本 */
  defaultCancelText?: string;
  /** 全局是否显示取消按钮 */
  defaultShowCancelButton?: boolean;
  /** 主题配置 */
  theme?: {
    /** 表单字段间距 */
    fieldSpacing?: string;
  };
}

/**
 * 表单上下文的状态接口
 */
export interface FormContextState extends FormContextConfig {}

/**
 * 表单上下文
 */
const FormContext = createContext<FormContextState | undefined>(undefined);

/**
 * 表单提供者的 Props
 */
export interface FormProviderProps {
  children: ReactNode;
  /** 配置 */
  config?: FormContextConfig;
}

/**
 * 表单上下文提供者组件
 * 提供全局的表单配置
 */
export function FormProvider({ children, config = {} }: FormProviderProps) {
  return (
    <FormContext.Provider value={config}>
      {children}
    </FormContext.Provider>
  );
}

/**
 * 使用表单上下文的 Hook
 * @returns 表单上下文状态
 */
export function useFormContext(): FormContextState {
  const context = useContext(FormContext);
  
  if (context === undefined) {
    // 如果没有提供 FormProvider，返回默认配置
    return {
      defaultSubmitText: '提交',
      defaultCancelText: '取消',
      defaultShowCancelButton: false,
      theme: {
        fieldSpacing: 'space-y-4',
      },
    };
  }
  
  return context;
}

/**
 * 获取字段配置的 Hook
 * 合并全局配置和局部配置
 */
export function useFieldConfig(
  fieldKey: string, 
  localConfig?: FieldConfig
): FieldConfig {
  const { globalFieldConfigs } = useFormContext();
  
  const globalConfig = globalFieldConfigs?.[fieldKey] || {};
  
  return {
    type: 'input',
    ...globalConfig,
    ...localConfig,
  } as FieldConfig;
}

/**
 * 表单实例管理 Hook（简化版）
 * 用于基本的表单状态管理
 */
export function useFormInstance(formId: string) {
  // 简化实现，主要用于未来扩展
  return {
    formId,
    isActive: true, // 简化为总是激活状态
  };
} 