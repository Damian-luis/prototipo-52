import React, { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string; // Optional hint text
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
}) => {
  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-12 w-full rounded-xl border appearance-none px-4 py-3 text-sm font-medium shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 ${className}`;

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-200 cursor-not-allowed bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-300 focus:ring-error-500 focus:border-error-500 dark:text-error-300 dark:border-error-500 dark:focus:ring-error-500/20`;
  } else if (success) {
    inputClasses += ` text-success-800 border-success-300 focus:ring-success-500 focus:border-success-500 dark:text-success-300 dark:border-success-500 dark:focus:ring-success-500/20`;
  } else {
    inputClasses += ` bg-white text-gray-900 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400/20`;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />

      {/* Optional Hint Text */}
      {hint && (
        <p
          className={`mt-2 text-xs font-medium ${
            error
              ? "text-error-600 dark:text-error-400"
              : success
              ? "text-success-600 dark:text-success-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
