import React, { forwardRef, ReactNode } from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date" | "time" | "datetime-local";
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "error" | "success" | "warning";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  name,
  id,
  disabled = false,
  required = false,
  readOnly = false,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  size = "md",
  variant = "default",
  startIcon,
  endIcon,
  label,
  hint,
  error,
  className = "",
  fullWidth = false,
}, ref) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-4 py-4 text-base",
  };

  const variantClasses = {
    default: "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 dark:focus:border-primary-400 dark:focus:ring-primary-400/20",
    error: "border-error-300 dark:border-error-500 focus:border-error-500 focus:ring-error-500/20 dark:focus:border-error-400 dark:focus:ring-error-400/20",
    success: "border-success-300 dark:border-success-500 focus:border-success-500 focus:ring-success-500/20 dark:focus:border-success-400 dark:focus:ring-success-400/20",
    warning: "border-warning-300 dark:border-warning-500 focus:border-warning-500 focus:ring-warning-500/20 dark:focus:border-warning-400 dark:focus:ring-warning-400/20",
  };

  const baseClasses = `w-full rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${fullWidth ? "w-full" : ""}`;

  const inputClasses = `${baseClasses} ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700" : ""}`;

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={`${inputClasses} ${startIcon ? "pl-10" : ""} ${endIcon ? "pr-10" : ""}`}
        />
        
        {endIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {endIcon}
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input; 