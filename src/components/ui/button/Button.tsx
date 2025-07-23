import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md" | "lg" | "xl"; // Button size
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
  fullWidth?: boolean; // Full width button
  loading?: boolean; // Loading state
  href?: string; // Link URL
  type?: "button" | "submit" | "reset"; // Button type
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  fullWidth = false,
  loading = false,
  href,
  type = "button",
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-6 py-3 text-sm font-semibold",
    lg: "px-8 py-4 text-base font-semibold",
    xl: "px-10 py-5 text-lg font-semibold",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:from-gray-300 disabled:to-gray-400 disabled:transform-none disabled:shadow-none",
    secondary:
      "bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:from-gray-300 disabled:to-gray-400 disabled:transform-none disabled:shadow-none",
    outline:
      "bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 border-2 border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:border-gray-200 disabled:text-gray-400 disabled:transform-none disabled:shadow-none",
    ghost:
      "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white disabled:text-gray-400 disabled:hover:bg-transparent",
    danger:
      "bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:from-gray-300 disabled:to-gray-400 disabled:transform-none disabled:shadow-none",
    success:
      "bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:from-gray-300 disabled:to-gray-400 disabled:transform-none disabled:shadow-none",
    warning:
      "bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:from-gray-300 disabled:to-gray-400 disabled:transform-none disabled:shadow-none",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const isDisabled = disabled || loading;

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 ${className} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${
    isDisabled ? "cursor-not-allowed opacity-50" : ""
  }`;

  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const content = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {!loading && endIcon && <span className="flex items-center">{endIcon}</span>}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        onClick={isDisabled ? undefined : onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={isDisabled}
    >
      {content}
    </button>
  );
};

export default Button;
