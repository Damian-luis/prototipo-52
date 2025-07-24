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
  // Determina el ancho del sidebar
  const sidebarWidth = isExpanded || isHovered || isMobileOpen ? "ml-[290px]" : "ml-[90px]";

  return (
    <AuthGuard requiredRole="ADMIN">
      {/* Sidebar fijo, el contenido debe tener margin-left */}
      <AppSidebar />

      {/* Content area */}
      <div className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ${sidebarWidth}`}>
        {/* Header */}
        <AppHeader />

        {/* Main content */}
        <main className="grow [&>*:first-child]:scroll-mt-16 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
