"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDown,
  Grid,
  HorizontalDots,
  List,
  UserCircle,
  File,
  ShootingStar,
  PieChart,
  CalenderLine,
  Chat,
  Table,
  Time,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <Grid />,
    name: "Dashboard",
    path: "/especialista",
  },
  {
    icon: <Chat />,
    name: "Consultas",
    path: "/especialista/consultas",
  },
  {
    icon: <Table />,
    name: "Evaluaciones",
    path: "/especialista/evaluaciones",
  },
  {
    icon: <Time />,
    name: "Sesiones",
    path: "/especialista/sesiones",
  },
  {
    icon: <PieChart />,
    name: "Reportes",
    path: "/especialista/reportes",
  },
  {
    icon: <UserCircle />,
    name: "Mi Perfil",
    path: "/especialista/profile",
  },
];

const EspecialistaSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group  ${
                openSubmenu === index
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              } flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center">
                  {nav.icon}
                </span>
                {isExpanded && <span>{nav.name}</span>}
              </div>
              {isExpanded && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openSubmenu === index ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            <Link
              href={nav.path || "#"}
              className={`menu-item group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === nav.path
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                {nav.icon}
              </span>
              {isExpanded && <span>{nav.name}</span>}
            </Link>
          )}
          {nav.subItems && isExpanded && openSubmenu === index && (
            <ul className="mt-2 ml-8 space-y-1">
              {nav.subItems.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.path}
                    className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      pathname === subItem.path
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                    <span>{subItem.name}</span>
                    {subItem.pro && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        PRO
                      </span>
                    )}
                    {subItem.new && (
                      <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-900 dark:text-green-400">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false);
      }
    },
    [setIsHovered]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-0 z-50 h-full bg-white shadow-lg transition-all duration-300 dark:bg-gray-900 ${
        isExpanded || isHovered || isMobileOpen
          ? "w-[290px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : ""}`}
      onMouseEnter={() => !isMobileOpen && setIsHovered(true)}
      onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-white">E</span>
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Especialista
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Panel de Control
              </p>
            </div>
          )}
        </div>
        {(isExpanded || isHovered || isMobileOpen) && (
          <button
            onClick={() => setIsHovered(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <HorizontalDots className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 p-4">
        {renderMenuItems(navItems)}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        {(isExpanded || isHovered || isMobileOpen) && (
          <SidebarWidget />
        )}
      </div>
    </div>
  );
};

export default EspecialistaSidebar; 