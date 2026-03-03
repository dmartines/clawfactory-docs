"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_SECTIONS } from "../lib/docs-nav.js";

/**
 * DocsSidebar — left-hand navigation for all /docs/* pages.
 *
 * On desktop (md+) it is always visible as a fixed column.
 * On mobile it slides in as an overlay when `open` is true;
 * clicking a link or the backdrop closes it via `onClose`.
 *
 * Props:
 *   open    {boolean}     — mobile open state
 *   onClose {() => void}  — called when the sidebar should be dismissed
 */
export default function DocsSidebar({ open, onClose }) {
  const pathname = usePathname();

  const navLinks = (
    <nav aria-label="Docs navigation">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Documentation
      </p>
      <ul className="space-y-0.5">
        {DOC_SECTIONS.map(({ title, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-2 rounded-md px-3 py-2
                  text-sm font-medium
                  transition-colors duration-100
                  ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator dot */}
                <span
                  className={`
                    h-1.5 w-1.5 flex-shrink-0 rounded-full
                    transition-colors duration-100
                    ${isActive ? "bg-indigo-400" : "bg-transparent"}
                  `}
                  aria-hidden="true"
                />
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible, md+) ─────────────────────── */}
      <aside
        id="docs-sidebar"
        className="
          hidden md:flex
          flex-col
          w-64 flex-shrink-0
          border-r border-slate-800
          bg-slate-950
          min-h-screen
          sticky top-0
          py-10 px-4
        "
      >
        {navLinks}
      </aside>

      {/* ── Mobile sidebar (overlay, < md) ────────────────────────────── */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-30
          bg-slate-950/80 backdrop-blur-sm
          md:hidden
          transition-opacity duration-200
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}
      <aside
        id="docs-sidebar"
        aria-label="Docs navigation"
        className={`
          fixed inset-y-0 left-0 z-40
          w-72
          bg-slate-950 border-r border-slate-800
          flex flex-col
          py-10 px-4
          md:hidden
          transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {navLinks}
      </aside>
    </>
  );
}
