"use client";

import { useEffect, useState } from "react";

const TOC_ITEMS = [
  { id: "spec-driven", label: "Spec-Driven Development" },
  { id: "three-tier-permissions", label: "Three-Tier Permissions" },
  { id: "context-optimizer", label: "Context Optimizer" },
  { id: "model-router", label: "Model Router" },
  { id: "spawn-system", label: "Spawn System" },
  { id: "receipts", label: "Receipts" },
  { id: "github-issues", label: "GitHub Issues as Tasks" },
];

export default function ConceptsToc() {
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
