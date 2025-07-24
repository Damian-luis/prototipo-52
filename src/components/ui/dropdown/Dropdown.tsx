"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  triggerRef
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.dropdown-toggle')
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let left = rect.left + window.scrollX;
      const top = rect.bottom + window.scrollY;
      const width = rect.width;
      const menuWidth = 280;
      const viewportWidth = window.innerWidth;
      if (left + menuWidth > viewportWidth - 8) {
        left = viewportWidth - menuWidth - 8;
      }
      setPosition({ top, left, width });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  const dropdownContent = (
    <div
      ref={dropdownRef}
      style={position ? {
        position: 'absolute',
        top: position.top,
        left: position.left,
        minWidth: position.width,
        zIndex: 9999
      } : {
        position: 'absolute',
        right: 0,
        top: '100%',
        zIndex: 9999
      }}
      className={`rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(dropdownContent, document.body);
};
