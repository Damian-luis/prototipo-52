"use client";
import React from "react";
import AppHeader from "@/layout/AppHeader";
import ProfesionalSidebar from "@/layout/ProfesionalSidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useSidebar } from "@/context/SidebarContext";

export default function ProfesionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <AuthGuard requiredRole="PROFESIONAL">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <ProfesionalSidebar />

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