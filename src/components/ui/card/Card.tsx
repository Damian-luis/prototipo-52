import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  border?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  shadow = "sm",
  border = true,
  hover = false,
  gradient = false,
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const baseClasses = "rounded-2xl bg-white dark:bg-gray-800 transition-all duration-200";
  const borderClasses = border ? "border border-gray-100 dark:border-gray-700" : "";
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900" : "";

  return (
    <div
      className={`
        ${baseClasses}
        ${borderClasses}
        ${shadowClasses[shadow]}
        ${hoverClasses}
        ${gradientClasses}
        ${paddingClasses[padding]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};

export default Card; 