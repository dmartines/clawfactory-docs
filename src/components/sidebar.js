"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "./icons.js";

const NAV_ITEMS = [
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/concepts", label: "Core Concepts" },
  { href: "/docs/cli", label: "CLI Reference" },
  { href: "/docs/writing-specs", label: "Writing a Spec" },
  { href: "/docs/templates", label: "Templates" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs navigation" className="w-full">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Documentation
      </p>
      <ul className="space-y-0.5">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={[
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {active && <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-indigo-500" />}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
