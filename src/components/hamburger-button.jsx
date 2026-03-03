"use client";

/**
 * HamburgerButton — toggles the mobile sidebar overlay.
 *
 * Props:
 *   open     {boolean}          — current sidebar open state
 *   onToggle {() => void}       — called when the button is clicked
 */
export default function HamburgerButton({ open, onToggle }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      aria-controls="docs-sidebar"
      onClick={onToggle}
      className="
        inline-flex items-center justify-center
        rounded-md p-2
        text-slate-400 hover:text-white
        hover:bg-slate-800
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        transition-colors
        md:hidden
      "
    >
      {/* Three-bar icon morphs to X when open */}
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        {open ? (
          /* X */
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          /* Hamburger */
          <>
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </button>
  );
}
