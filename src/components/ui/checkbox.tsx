// Basic Checkbox component for TypeScript compilation
// Users should replace this with their actual shadcn/ui Checkbox component

import * as React from "react";

export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, disabled, className, id, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        checked={checked === "indeterminate" ? false : checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className={className}
        id={id}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox }; 