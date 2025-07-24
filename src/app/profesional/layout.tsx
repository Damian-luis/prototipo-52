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
  const sidebarWidth = isExpanded || isHovered || isMobileOpen ? "ml-[290px]" : "ml-[90px]";

  return (
    <AuthGuard requiredRole="profesional">
      <ProfesionalSidebar />
      <div className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ${sidebarWidth}`}>
        <AppHeader />
        <main className="grow [&>*:first-child]:scroll-mt-16">{children}</main>
      </div>
    </AuthGuard>
  );
} 