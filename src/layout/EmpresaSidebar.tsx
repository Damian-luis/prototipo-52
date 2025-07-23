"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  BoxIcon,
  Group,
  File,
  DollarLine,
  PieChart,
  BellIcon,
  PlugIn,
  Close,
  ChevronLeft,
  ChevronDown
} from "@/icons";

const EmpresaSidebar = () => {
  const pathname = usePathname();
  const { isExpanded, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: BoxIcon,
      href: "/empresa",
      badge: null
    },
    {
      title: "Proyectos",
      icon: File,
      href: "/empresa/proyectos",
      badge: null
    },
    {
      title: "Profesionales",
      icon: Group,
      href: "/empresa/profesionales",
      badge: null
    },
    {
      title: "Contratos",
      icon: File,
      href: "/empresa/contratos",
      badge: null
    },
    {
      title: "Pagos",
      icon: DollarLine,
      href: "/empresa/pagos",
      badge: null
    },
    {
      title: "Reportes",
      icon: PieChart,
      href: "/empresa/reportes",
      badge: null
    },
    {
      title: "Notificaciones",
      icon: BellIcon,
      href: "/empresa/notificaciones",
      badge: unreadCount > 0 ? unreadCount.toString() : null
    },
    {
      title: "Configuración",
      icon: PlugIn,
      href: "/empresa/configuracion",
      badge: null
    }
  ];

  const isActive = (href: string) => {
    if (href === "/empresa") {
      return pathname === "/empresa";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[290px] transform bg-white shadow-lg transition-all duration-300 dark:bg-gray-900 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              {isExpanded && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Empresa
                </span>
              )}
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Close className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* User info */}
          {isExpanded && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-semibold">
                    {user?.name?.charAt(0) || "E"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || "Empresa"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${
                        active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                      }`} />
                      {isExpanded && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-300">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Contraer</span>
                </>
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-md bg-white shadow-lg dark:bg-gray-900"
      >
        <BoxIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
    </>
  );
};

export default EmpresaSidebar; 