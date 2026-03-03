"use client";

import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./ui/sidebar.jsx";
import HamburgerButton from "./hamburger-button.jsx";

/**
 * DocsLayoutShell — client wrapper that owns mobile sidebar open/close state.
 *
 * Rendered inside the server `src/app/docs/layout.js`.
 *
 * Layout structure
 * ────────────────
 * Desktop (md+):
 *   ┌──────────────┬─────────────────────────────────────────────┐
 *   │   Sidebar    │    Docs content (max-w-5xl, centred)        │
 *   │   (w-64)     │                                             │
 *   └──────────────┴─────────────────────────────────────────────┘
 *
 * Mobile (<md):
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  [☰] ClawFactory Docs          (mobile top-bar)           │
 *   ├────────────────────────────────────────────────────────────┤
 *   │             Docs content                                   │
 *   └────────────────────────────────────────────────────────────┘
 *   Sidebar slides in as an overlay when the hamburger is tapped.
 *
 * Props
 * ─────
 * children — docs page content, passed through unchanged.
 */
export default function DocsLayoutShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar whenever the route changes (user clicked a nav link)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close on Escape key (accessibility: keyboard users can dismiss the overlay)
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [sidebarOpen]);

  // Prevent body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/*
        Sidebar
        ───────
        • Desktop (md+): always-visible left column, static, w-64.
        • Mobile (<md):  fixed overlay drawer, controlled by isOpen.
        Both modes are handled inside <Sidebar> via the isOpen prop.
      */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right-hand content column */}
      <div className="flex flex-1 flex-col min-w-0">

        {/*
          Mobile-only top bar
          ───────────────────
          Sticky so it stays in view while scrolling.
          Hidden on md+ — the desktop sidebar is always visible there.
        */}
        <header
          data-testid="docs-mobile-topbar"
          className={[
            "sticky top-0 z-20",
            "flex items-center gap-3",
            "border-b border-slate-800",
            "bg-slate-950/90 backdrop-blur-sm",
            "px-4 py-3",
            "md:hidden",
          ].join(" ")}
        >
          <HamburgerButton
            open={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
          />
          <span className="text-sm font-medium text-slate-400">
            ClawFactory Docs
          </span>
        </header>

        {/* Main prose area */}
        <main
          id="main-content"
          className={[
            "flex-1",
            "w-full max-w-5xl",
            "mx-auto",
            "px-6 py-10",
            "md:px-12 md:py-16",
          ].join(" ")}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
