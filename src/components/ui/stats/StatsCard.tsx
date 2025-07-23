import React, { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  className = "",
  color = "primary",
}) => {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400",
    secondary: "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/15 dark:text-secondary-400",
    success: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
    warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
    error: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  };

  const trendColors = {
    up: "text-success-600 dark:text-success-400",
    down: "text-error-600 dark:text-error-400",
    neutral: "text-gray-600 dark:text-gray-400",
  };

  const getChangeColor = (type: "increase" | "decrease") => {
    return type === "increase" ? trendColors.up : trendColors.down;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <span className={`text-sm font-medium ${getChangeColor(change.type)}`}>
                {change.type === "increase" ? "+" : "-"}{change.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
            {trend === "up" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            )}
            {trend === "down" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {trend === "neutral" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
            <span className="font-medium">
              {trend === "up" && "Creciendo"}
              {trend === "down" && "Decreciendo"}
              {trend === "neutral" && "Estable"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard; 