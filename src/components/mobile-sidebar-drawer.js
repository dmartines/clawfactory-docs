"use client";

import { useEffect } from "react";
import { SidebarContent } from "./docs-sidebar.js";
import { usePathname } from "next/navigation";

export default function MobileSidebarDrawer({ open, onClose }) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-800">
          <span className="text-indigo-400 font-mono font-bold">
            ⚙ ClawFactory
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Nav content */}
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarContent pathname={pathname} onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
