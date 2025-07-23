import React, { ReactNode } from "react";

interface BadgeProps {
  variant?: "light" | "solid" | "outline";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
  className = "",
  onClick,
  removable = false,
  onRemove,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 rounded-full font-medium transition-all duration-200";

  // Define size styles
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-300 border border-primary-200 dark:border-primary-500/30",
      secondary:
        "bg-secondary-100 text-secondary-800 dark:bg-secondary-500/20 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-500/30",
      success:
        "bg-success-100 text-success-800 dark:bg-success-500/20 dark:text-success-300 border border-success-200 dark:border-success-500/30",
      error:
        "bg-error-100 text-error-800 dark:bg-error-500/20 dark:text-error-300 border border-error-200 dark:border-error-500/30",
      warning:
        "bg-warning-100 text-warning-800 dark:bg-warning-500/20 dark:text-warning-300 border border-warning-200 dark:border-warning-500/30",
      info: 
        "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30",
      light: 
        "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80 border border-gray-200 dark:border-white/20",
      dark: 
        "bg-gray-800 text-white dark:bg-gray-700 dark:text-white border border-gray-700 dark:border-gray-600",
    },
    solid: {
      primary: 
        "bg-primary-600 text-white dark:bg-primary-500 dark:text-white border border-primary-600 dark:border-primary-500",
      secondary: 
        "bg-secondary-600 text-white dark:bg-secondary-500 dark:text-white border border-secondary-600 dark:border-secondary-500",
      success: 
        "bg-success-600 text-white dark:bg-success-500 dark:text-white border border-success-600 dark:border-success-500",
      error: 
        "bg-error-600 text-white dark:bg-error-500 dark:text-white border border-error-600 dark:border-error-500",
      warning: 
        "bg-warning-600 text-white dark:bg-warning-500 dark:text-white border border-warning-600 dark:border-warning-500",
      info: 
        "bg-blue-600 text-white dark:bg-blue-500 dark:text-white border border-blue-600 dark:border-blue-500",
      light: 
        "bg-gray-400 dark:bg-white/20 text-white dark:text-white/90 border border-gray-400 dark:border-white/30",
      dark: 
        "bg-gray-800 text-white dark:bg-gray-700 dark:text-white border border-gray-800 dark:border-gray-700",
    },
    outline: {
      primary: 
        "bg-transparent text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-500",
      secondary: 
        "bg-transparent text-secondary-600 dark:text-secondary-400 border border-secondary-300 dark:border-secondary-500",
      success: 
        "bg-transparent text-success-600 dark:text-success-400 border border-success-300 dark:border-success-500",
      error: 
        "bg-transparent text-error-600 dark:text-error-400 border border-error-300 dark:border-error-500",
      warning: 
        "bg-transparent text-warning-600 dark:text-warning-400 border border-warning-300 dark:border-warning-500",
      info: 
        "bg-transparent text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500",
      light: 
        "bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-500",
      dark: 
        "bg-transparent text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-600",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const RemoveIcon = () => (
    <button
      onClick={handleRemove}
      className="ml-1 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-current hover:bg-current hover:bg-opacity-20 transition-colors duration-200"
    >
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );

  const baseClasses = `${baseStyles} ${sizeClass} ${colorStyles} ${className} ${
    onClick ? "cursor-pointer hover:shadow-sm" : ""
  }`;

  return (
    <span className={baseClasses} onClick={onClick}>
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
      {removable && <RemoveIcon />}
    </span>
  );
};

export default Badge;
