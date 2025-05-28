"use client";

import { FormProvider } from "react-shadcn-crud-form";

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider
      config={{
        defaultSubmitText: "提交",
        defaultCancelText: "取消",
        defaultShowCancelButton: true,
        validationMode: "onSubmit",
        theme: {
          dialogMaxWidth: "600px",
          dialogMaxHeight: "80vh",
          fieldSpacing: "space-y-6",
        },
        globalFieldConfigs: {
          email: { type: "input", placeholder: "请输入邮箱地址" },
          password: { type: "input", placeholder: "请输入密码" },
        },
      }}
    >
      {children}
    </FormProvider>
  );
} 