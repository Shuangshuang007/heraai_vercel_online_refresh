'use client';

import { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onCheckedChange, className = '', labelClassName = '', ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className={`h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 ${className}`}
          {...props}
        />
        {label && <span className={`${labelClassName}`}>{label}</span>}
      </label>
    );
  }
); 