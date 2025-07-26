"use client";

import React from "react";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useSidebar } from "@/context/SidebarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AppHeader />

          {/* Main content */}
          <main className="grow [&>*:first-child]:scroll-mt-16 p-3 sm:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
