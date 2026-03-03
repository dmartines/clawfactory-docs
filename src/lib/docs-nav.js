/**
 * docs-nav.js — single source of truth for docs sidebar navigation.
 *
 * Exports
 * ───────
 * DOC_NAV      — grouped structure (group + items[{label, href}]) used by
 *                ui/sidebar.jsx and other nav consumers.
 * DOCS_NAV     — alias of DOC_NAV (backward compatibility).
 * DOC_NAV_FLAT — flat list of all items {label, href}.
 * DOC_SECTIONS — flat list of all items as {title, href} for docs-sidebar.jsx.
 */

export const DOC_NAV = [
  {
    group: "Overview",
    section: "Overview",
    items: [
      { label: "Getting Started", title: "Getting Started", href: "/docs/getting-started" },
      { label: "Core Concepts",   title: "Core Concepts",   href: "/docs/concepts" },
    ],
  },
  {
    group: "Guides",
    section: "Guides",
    items: [
      { label: "Writing a Spec", title: "Writing a Spec", href: "/docs/writing-specs" },
      { label: "Templates",      title: "Templates",      href: "/docs/templates" },
    ],
  },
  {
    group: "Reference",
    section: "Reference",
    items: [
      { label: "CLI Reference", title: "CLI Reference", href: "/docs/cli" },
    ],
  },
];

/** Backward-compatible alias. */
export const DOCS_NAV = DOC_NAV;

/** Flat list with {label, href} — convenient for lookups. */
export const DOC_NAV_FLAT = DOC_NAV.flatMap((s) => s.items);

/**
 * Flat list with {title, href} shape — used by docs-sidebar.jsx.
 * title mirrors label for backward compatibility.
 */
export const DOC_SECTIONS = DOC_NAV.flatMap((s) =>
  s.items.map(({ title, href }) => ({ title, href }))
);
