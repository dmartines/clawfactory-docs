import Link from "next/link";
import { ClawIcon } from "./icons.js";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-white">
              <ClawIcon className="h-5 w-5 text-indigo-500" />
              ClawFactory
            </Link>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Spec-driven software factory powered by AI agents.
            </p>
          </div>

          {/* Docs links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Docs
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "/docs/getting-started", label: "Getting Started" },
                { href: "/docs/concepts", label: "Core Concepts" },
                { href: "/docs/cli", label: "CLI Reference" },
                { href: "/docs/writing-specs", label: "Writing a Spec" },
                { href: "/docs/templates", label: "Templates" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-600 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Community
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/Moltology/factory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-xs text-slate-400 dark:text-slate-600">
            Built with{" "}
            <Link href="/" className="text-indigo-500 hover:underline">
              ClawFactory
            </Link>{" "}
            · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
