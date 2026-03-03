"use client";

/**
 * Sidebar — Docs navigation with active page highlight.
 *
 * Renders the full docs nav tree defined in `src/lib/docs-nav.js`,
 * grouped by section (Overview, Guides, Reference).
 *
 * Active route detection
 * ──────────────────────
 * The currently-active route is read from `usePathname()`. A link is marked
 * active when `pathname === item.href` (exact match — no prefix matching, so
 * child pages do not accidentally highlight a parent section link).
 * The active item receives:
 *   • an indigo background pill
 *   • a left-side accent bar
 *   • `aria-current="page"` for screen-reader announcement
 *
 * Mobile behaviour
 * ────────────────
 * • On screens < md the sidebar is off-screen by default.
 * • When `isOpen` is true a full-screen semi-transparent backdrop appears
 *   and the sidebar panel slides in from the left.
 * • Clicking the backdrop or the "×" close button calls `onClose`.
 * • Clicking any nav link also calls `onClose` so the drawer auto-dismisses.
 * • The panel uses CSS transforms + transition so the animation is GPU-
 *   accelerated and never causes layout reflow.
 *
 * Desktop behaviour (md+)
 * ────────────────────────
 * • The sidebar is always visible as a fixed-width column.
 * • It is sticky so it stays in view while the main content scrolls.
 * • `isOpen` / `onClose` are irrelevant at this breakpoint.
 *
 * Props
 * ─────
 * isOpen   {boolean}  — controls mobile open/close state (default false)
 * onClose  {function} — called when the user dismisses the mobile sidebar
 */

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DOC_NAV } from "../../lib/docs-nav.js";

// ─── Icons ────────────────────────────────────────────────────────────────────

/** × close icon for the mobile header. */
function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** GitHub mark icon. */
function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 flex-shrink-0"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

/**
 * A single navigation link.
 *
 * @param {{ label: string, href: string, isActive: boolean, onClick: function }} props
 */
function NavItem({ label, href, isActive, onClick }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        aria-label={label}
        className={[
          // Base — flex row, consistent padding, rounded, smooth colour transitions
          "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
          "transition-colors duration-150",
          isActive
            ? // Active state: indigo tinted background + bright text
              "bg-indigo-500/15 text-indigo-400 dark:text-indigo-300"
            : // Inactive state: muted text, subtle hover
              "text-slate-500 hover:bg-slate-800/60 hover:text-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        ].join(" ")}
      >
        {/*
         * Left accent bar — visible only on the active item.
         * 2px wide × 1rem tall, rounded pill, indigo coloured.
         * Provides an at-a-glance positional cue independent of colour.
         */}
        <span
          aria-hidden="true"
          className={[
            "h-4 w-0.5 flex-shrink-0 rounded-full transition-colors duration-150",
            isActive ? "bg-indigo-500" : "bg-transparent",
          ].join(" ")}
        />

        {/* Label — accessible name comes from the aria-label on the <a>, this
            span is for visual display only. */}
        <span>{label}</span>
      </Link>
    </li>
  );
}

// ─── NavGroup ─────────────────────────────────────────────────────────────────

/**
 * A labelled group of nav items (e.g. "Overview", "Guides", "Reference").
 *
 * @param {{ group: string, items: Array, pathname: string, onItemClick: function }} props
 */
function NavGroup({ group, items, pathname, onItemClick }) {
  return (
    <li>
      {/* Section heading — visually prominent, not interactive */}
      <p
        id={`nav-group-${group.toLowerCase()}`}
        className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500"
      >
        {group}
      </p>

      {/* Items list */}
      <ul
        role="list"
        aria-labelledby={`nav-group-${group.toLowerCase()}`}
        className="space-y-0.5"
      >
        {items.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </li>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();

  /** Dismiss mobile drawer when a nav link is activated. */
  function handleItemClick() {
    if (typeof onClose === "function") onClose();
  }

  // ── Shared nav content ────────────────────────────────────────────────────
  // Rendered identically inside both the mobile drawer and the desktop column.
  const navContent = (
    <nav aria-label="Docs navigation">
      <ul role="list" className="space-y-6">
        {DOC_NAV.map((section) => (
          <NavGroup
            key={section.group}
            group={section.group}
            items={section.items}
            pathname={pathname}
            onItemClick={handleItemClick}
          />
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* ── Mobile backdrop ──────────────────────────────────────────────── */}
      {/*
       * Rendered only when the drawer is open.
       * Semi-transparent + blur overlay that dismisses the drawer on click.
       * Hidden on md+ via `md:hidden`.
       */}
      {isOpen && (
        <div
          aria-hidden="true"
          data-testid="sidebar-backdrop"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar panel ────────────────────────────────────────────────── */}
      {/*
       * Mobile:  fixed, off-screen left, slides in with translate-x when
       *          isOpen=true. z-40 so it sits above the backdrop (z-30).
       * Desktop: static, z-auto, always translated to translate-x-0 via md:
       *          override. Part of the parent flex layout, not fixed.
       *
       * The `md:transition-none` class disables the sliding animation on
       * desktop so the sidebar appears immediately on page load without a
       * flash of being off-screen.
       */}
      <aside
        data-testid="sidebar"
        aria-label="Sidebar"
        className={[
          // Shared structural styles
          "flex flex-col",
          "bg-slate-950 border-r border-slate-800",
          // Dark-mode text baseline
          "text-slate-300",

          // ── Mobile: fixed panel, full viewport height, slides in from left
          "fixed inset-y-0 left-0 z-40",
          "w-72",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",

          // ── Desktop (md+): static, always visible, no transition
          "md:static md:inset-y-auto md:left-auto md:z-auto",
          "md:w-64 md:min-h-full",
          "md:translate-x-0",
          "md:transition-none",

          // Sticky desktop so nav stays in view while content scrolls
          "md:sticky md:top-0 md:h-screen",
        ].join(" ")}
      >
        {/* ── Mobile header (close button) ─────────────────────────────── */}
        {/*
         * Visible only on mobile (md:hidden). Shows the section title and a
         * dismiss button.  The button is focusable and announced as
         * "Close navigation" by screen readers.
         */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:hidden">
          <span className="text-sm font-semibold text-slate-100">
            Documentation
          </span>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className={[
              "rounded-md p-1.5",
              "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            ].join(" ")}
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Desktop top padding ───────────────────────────────────────── */}
        <div className="hidden md:block h-8 flex-shrink-0" aria-hidden="true" />

        {/* ── Nav links ─────────────────────────────────────────────────── */}
        {/*
         * `overflow-y-auto` enables scrolling when the nav is taller than the
         * viewport.  Custom scrollbar styles are applied via globals.css using
         * the `.sidebar-scroll` utility class.
         */}
        <div className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
          {navContent}
        </div>

        {/* ── Footer — GitHub link ─────────────────────────────────────── */}
        {/*
         * A subtle branding anchor at the bottom of the sidebar panel.
         * Opens in a new tab; announces itself fully to screen readers.
         */}
        <div className="flex-shrink-0 border-t border-slate-800 px-4 py-4">
          <a
            href="https://github.com/Moltology/factory"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className={[
              "flex items-center gap-2",
              "rounded-md px-2 py-1.5",
              "text-xs text-slate-500",
              "transition-colors duration-150 hover:text-slate-300",
            ].join(" ")}
          >
            <GitHubIcon />
            View on GitHub
          </a>
        </div>
      </aside>
    </>
  );
}
