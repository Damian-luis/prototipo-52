import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-25 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeProvider>
        <div className="relative flex items-center justify-center min-h-screen p-6">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 dark:bg-accent-900/20 rounded-full blur-3xl opacity-30"></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10 w-full max-w-lg">
            {children}
          </div>
          
          {/* Theme toggler */}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
} 