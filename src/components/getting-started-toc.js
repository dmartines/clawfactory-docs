"use client";

import { useEffect, useState } from "react";

const TOC_ITEMS = [
  { id: "prerequisites",    label: "Prerequisites" },
  { id: "install",          label: "Install" },
  { id: "setup",            label: "Setup" },
  { id: "create-project",   label: "Create Your First Project" },
  { id: "build",            label: "Build" },
  { id: "deploy",           label: "Deploy" },
  { id: "whats-next",       label: "What's Next" },
];

/**
 * GettingStartedToc — sticky right-hand on-page TOC for /docs/getting-started.
 * Highlights the section currently in view using IntersectionObserver.
 * Mirrors the pattern used by ConceptsToc on /docs/concepts.
 */
export default function GettingStartedToc() {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden xl:block w-52 shrink-0 sticky top-20 h-fit">
      <p className="mb-3 text-xs font-semibold tracking-widest uppercase text-slate-500">
        On this page
      </p>
      <nav aria-label="On this page">
        <ul className="space-y-1">
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={[
                  "block text-xs py-1 pl-3 border-l transition-colors",
                  activeId === item.id
                    ? "border-indigo-400 text-indigo-400 font-medium"
                    : "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500",
                ].join(" ")}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
