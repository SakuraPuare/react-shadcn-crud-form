// Basic Select components for TypeScript compilation
// Users should replace this with their actual shadcn/ui Select components

import * as React from "react";

export interface SelectProps {
  onValueChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Select = ({ children }: SelectProps) => {
  return <div>{children}</div>;
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button className={className} ref={ref} {...props}>
      {children}
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  return <span className={className} ref={ref} {...props}>{placeholder}</span>;
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className={className} ref={ref} {...props}>
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <div className={className} ref={ref} data-value={value} {...props}>
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}; 