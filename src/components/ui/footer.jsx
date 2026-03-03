/**
 * Footer component — Links + "Built with ClawFactory" badge.
 *
 * Layout (responsive):
 *   ┌────────────────────────────────────────────────────┐
 *   │  Brand / tagline  │  Documentation  │  Project     │
 *   ├────────────────────────────────────────────────────┤
 *   │  © year ClawFactory          [🦞 Built with CF]   │
 *   └────────────────────────────────────────────────────┘
 *
 * - 3-column grid on ≥ sm, stacked single column on mobile.
 * - Bottom bar is flex-row on ≥ sm, stacked on mobile.
 * - Dark-mode default; light-mode styles included.
 * - All external links open in a new tab with proper rel + aria-label.
 */

import React from "react";
import Link from "next/link";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const DOCS_LINKS = [
  { label: "Getting Started", href: "/docs/getting-started" },
  { label: "Core Concepts",   href: "/docs/concepts" },
  { label: "CLI Reference",   href: "/docs/cli" },
  { label: "Writing a Spec",  href: "/docs/writing-specs" },
  { label: "Templates",       href: "/docs/templates" },
];

const REPO_URL = "https://github.com/Moltology/factory";

/* ── Component ────────────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* ── Top grid — brand, docs links, project links ─────────────── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              aria-label="ClawFactory home"
              className="inline-flex items-center gap-2 font-mono text-lg font-semibold text-slate-900 transition-colors hover:text-indigo-500 dark:text-white dark:hover:text-indigo-400"
            >
              <LogoIcon />
              ClawFactory
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              A spec-driven software factory that builds full-stack apps from
              markdown specs using parallel AI agents.
            </p>
          </div>

          {/* Documentation links */}
          <nav aria-label="Documentation links">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Documentation
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {DOCS_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Project / external links */}
          <nav aria-label="Project links">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Project
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View ClawFactory on GitHub (opens in new tab)"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  <GitHubIcon />
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* ── Bottom bar — copyright + "Built with ClawFactory" ─────────── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-slate-800">

          <p className="text-xs text-slate-400 dark:text-slate-600">
            &copy; {new Date().getFullYear()} ClawFactory. All rights reserved.
          </p>

          {/* "Built with ClawFactory" badge */}
          <span
            data-testid="built-with-badge"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
          >
            <ClawIcon />
            Built with ClawFactory
          </span>
        </div>
      </div>
    </footer>
  );
}

/* Default export for convenience */
export default Footer;

/* ── Inline SVG icons ─────────────────────────────────────────────────────── */

function LogoIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Stylised claw / lightning-bolt glyph matching header */}
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function ClawIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
