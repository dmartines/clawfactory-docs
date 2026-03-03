"use client";

/**
 * Header — sticky site header containing:
 *  • Skip-to-content link (screen-reader / keyboard shortcut)
 *  • Logo (🦞 ClawFactory) linking to "/"
 *  • Docs nav link → /docs/getting-started
 *  • GitHub nav link → https://github.com/Moltology/factory (new tab)
 *  • Dark-mode toggle button (sun ↔ moon)
 *
 * Exported as both a named export (`Header`) and a default export so it can
 * be consumed by Next.js layouts and test files alike.
 *
 *   import Header from "@/components/header.jsx";          // Next.js layout
 *   import { Header } from "@/components/header.js";       // tests via shim
 */

import React from "react";
import Link from "next/link";
import { useThemeContext } from "./theme-provider.js";

/* ── Icon sub-components ─────────────────────────────────────────────────── */

/**
 * GitHub mark (filled path). Rendered at 16 × 16 px inside the nav link.
 */
function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/**
 * Sun icon — shown when the active theme is dark (clicking switches → light).
 */
function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/**
 * Moon icon — shown when the active theme is light (clicking switches → dark).
 */
function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ── Shared class helpers ─────────────────────────────────────────────────── */

/**
 * Tailwind classes shared by both nav links (Docs + GitHub).
 * Keeps hover / focus / transition styles DRY.
 */
const navLinkClasses = [
  // Layout
  "hidden sm:inline-flex items-center gap-1.5",
  // Spacing
  "px-3 py-1.5 rounded-md",
  // Typography
  "text-sm font-medium",
  // Colour — resting state
  "text-slate-600 dark:text-slate-400",
  // Colour — hover state
  "hover:text-slate-900 dark:hover:text-white",
  "hover:bg-slate-100 dark:hover:bg-slate-800",
  // Focus ring (keyboard navigation)
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
  // Transition
  "transition-colors",
].join(" ");

/* ── Header component ────────────────────────────────────────────────────── */

/**
 * `Header` — sticky site-wide header.
 *
 * Consumes `useThemeContext()` from ThemeProvider (must be an ancestor).
 * Tested via `header.test.jsx` through the `header.js` re-export shim.
 */
export function Header() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <>
      {/* ── Skip navigation — keyboard / screen-reader shortcut ────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* ── Main header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="ClawFactory home"
          >
            {/* Lobster emoji as logo glyph */}
            <span
              className="text-2xl select-none leading-none"
              role="img"
              aria-hidden="true"
            >
              🦞
            </span>

            {/* Wordmark */}
            <span className="font-mono font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              ClawFactory
            </span>
          </Link>

          {/* ── Nav ───────────────────────────────────────────────────── */}
          <nav
            aria-label="Site navigation"
            className="flex items-center gap-1 sm:gap-2"
          >
            {/* ── Docs link ─────────────────────────────────────────── */}
            <Link
              href="/docs/getting-started"
              className={navLinkClasses}
            >
              Docs
            </Link>

            {/* ── GitHub link ───────────────────────────────────────── */}
            <a
              href="https://github.com/Moltology/factory"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View ClawFactory on GitHub"
              className={navLinkClasses}
            >
              <GitHubIcon />
              GitHub
            </a>

            {/* ── Dark-mode toggle ──────────────────────────────────── */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={[
                // Size & shape
                "w-8 h-8 rounded-md",
                // Layout
                "flex items-center justify-center",
                // Colour — resting
                "text-slate-400",
                // Colour — hover
                "hover:text-slate-600 dark:hover:text-slate-300",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                // Focus ring
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                // Transition
                "transition-colors",
              ].join(" ")}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}

/* ── Default export (consumed by Next.js layouts) ────────────────────────── */
export default Header;
