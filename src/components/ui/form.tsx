// Basic Form components for TypeScript compilation
// Users should replace this with their actual shadcn/ui Form components

import * as React from "react";

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ ...props }, ref) => {
  return <form ref={ref} {...props} />;
});
Form.displayName = "Form";

export interface FormFieldProps {
  control?: any;
  name?: string;
  render?: (props: { field: any }) => React.ReactNode;
  children?: React.ReactNode;
}

const FormField = ({ render, children }: FormFieldProps) => {
  const field = {}; // Mock field
  return render ? render({ field }) : children;
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div className={className} ref={ref} {...props} />;
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return <label className={className} ref={ref} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  return <div ref={ref} {...props} />;
});
FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <p className={className} ref={ref} {...props} />;
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}; 