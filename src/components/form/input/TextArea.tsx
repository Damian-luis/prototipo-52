import React from "react";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
}

const TextArea: React.FC<TextareaProps> = ({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  let textareaClasses = `w-full rounded-xl border px-4 py-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${className}`;

  if (disabled) {
    textareaClasses += ` bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600`;
  } else if (error) {
    textareaClasses += ` bg-white text-gray-900 border-error-300 focus:border-error-500 focus:ring-error-500/20 dark:bg-gray-800 dark:text-white dark:border-error-500 dark:focus:ring-error-500/20`;
  } else {
    textareaClasses += ` bg-white text-gray-900 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-primary-400 dark:focus:ring-primary-400/20`;
  }

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
      />
      {hint && (
        <p
          className={`mt-2 text-xs font-medium ${
            error ? "text-error-600 dark:text-error-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
