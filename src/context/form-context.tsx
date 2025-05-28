"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { z } from 'zod';
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
  /** 全局表单验证模式 */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
  /** 主题配置 */
  theme?: {
    /** 对话框最大宽度 */
    dialogMaxWidth?: string;
    /** 对话框最大高度 */
    dialogMaxHeight?: string;
    /** 表单字段间距 */
    fieldSpacing?: string;
  };
}

/**
 * 表单上下文的状态接口
 */
export interface FormContextState extends FormContextConfig {
  /** 当前活跃的表单 ID */
  activeFormId?: string;
  /** 设置活跃表单 ID */
  setActiveFormId?: (id: string | undefined) => void;
  /** 更新配置 */
  updateConfig?: (config: Partial<FormContextConfig>) => void;
}

/**
 * 表单上下文
 */
const FormContext = createContext<FormContextState | undefined>(undefined);

/**
 * 表单提供者的 Props
 */
export interface FormProviderProps {
  children: ReactNode;
  /** 初始配置 */
  config?: FormContextConfig;
}

/**
 * 表单上下文提供者组件
 * 提供全局的表单配置和状态管理
 */
export function FormProvider({ children, config = {} }: FormProviderProps) {
  const [activeFormId, setActiveFormId] = useState<string | undefined>();
  const [currentConfig, setCurrentConfig] = useState<FormContextConfig>(config);

  const updateConfig = (newConfig: Partial<FormContextConfig>) => {
    setCurrentConfig(prev => ({ ...prev, ...newConfig }));
  };

  const contextValue: FormContextState = {
    ...currentConfig,
    activeFormId,
    setActiveFormId,
    updateConfig,
  };

  return (
    <FormContext.Provider value={contextValue}>
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
      validationMode: 'onSubmit',
      theme: {
        dialogMaxWidth: '60%',
        dialogMaxHeight: '80vh',
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
 * 表单实例管理 Hook
 * 用于在多个表单之间进行协调
 */
export function useFormInstance(formId: string) {
  const { activeFormId, setActiveFormId } = useFormContext();
  
  const isActive = activeFormId === formId;
  
  const activate = () => setActiveFormId?.(formId);
  const deactivate = () => {
    if (activeFormId === formId) {
      setActiveFormId?.(undefined);
    }
  };
  
  return {
    isActive,
    activate,
    deactivate,
  };
} 