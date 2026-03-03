"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "../lib/docs-nav.js";

export default function DocsSidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-60 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-slate-800 py-8 pr-6">
      <SidebarContent pathname={pathname} onNavigate={onNavigate} />
    </aside>
  );
}

export function SidebarContent({ pathname, onNavigate }) {
  return (
    <nav aria-label="Docs navigation">
      {DOCS_NAV.map((group) => (
        <div key={group.section} className="mb-6">
          <p className="mb-2 px-3 text-xs font-semibold tracking-widest uppercase text-slate-500">
            {group.section}
          </p>
          <ul className="space-y-0.5">
            {group.pages.map((page) => {
              const isActive = pathname === page.href;
              return (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    onClick={onNavigate}
                    className={[
                      "flex items-center px-3 py-1.5 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400 font-medium"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    {isActive && (
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                    )}
                    {page.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
