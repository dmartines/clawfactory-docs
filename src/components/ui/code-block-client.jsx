"use client";

/**
 * src/components/ui/code-block-client.jsx
 *
 * Client-side shell for CodeBlock.
 *
 * Responsibilities:
 *   - Renders the pre-highlighted HTML (produced server-side by Shiki).
 *   - Shows the language badge.
 *   - Provides an animated copy-to-clipboard button.
 *
 * Props:
 *   - html         {string}   Shiki-generated HTML (dangerouslySetInnerHTML).
 *   - code         {string}   Raw source string used by the copy action.
 *   - lang         {string}   Language label shown in the badge.
 *   - filename     {string?}  Optional filename shown in the header bar.
 *   - colorScheme  {"dark"|"light"}  Controls surface & icon colours.
 */

import { useState, useCallback } from "react";

/** Clipboard icon (SVG). */
function IconCopy({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/** Check-mark icon (SVG) — shown after a successful copy. */
function IconCheck({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Duration (ms) the "Copied!" state is shown before reverting. */
const COPY_FEEDBACK_DURATION = 2000;

export default function CodeBlockClient({
  html,
  code,
  lang,
  filename,
  colorScheme = "dark",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (copied) return; // debounce rapid clicks
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS context in dev).
      // Silently ignore — the button just won't give visual feedback.
    }
  }, [code, copied]);

  const isDark = colorScheme === "dark";

  return (
    <div
      className={[
        "group relative my-4 overflow-hidden rounded-xl border text-sm leading-relaxed",
        isDark
          ? "border-slate-700 bg-[#0d1117]"   // github-dark background
          : "border-slate-200 bg-[#f6f8fa]",  // github-light background
      ].join(" ")}
    >
      {/* ── Header bar ───────────────────────────────────────────── */}
      <div
        className={[
          "flex items-center justify-between px-4 py-2 border-b",
          isDark ? "border-slate-700" : "border-slate-200",
        ].join(" ")}
      >
        {/* Left side: filename or lang badge */}
        <span
          className={[
            "font-mono text-xs tracking-wide select-none",
            isDark ? "text-slate-400" : "text-slate-500",
          ].join(" ")}
        >
          {filename ?? lang}
        </span>

        {/* Right side: copy button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy code"}
          className={[
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
            "transition-all duration-150",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
            copied
              ? isDark
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-emerald-600 bg-emerald-600/10"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60",
          ].join(" ")}
        >
          {copied ? (
            <>
              <IconCheck className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <IconCopy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* ── Highlighted code ─────────────────────────────────────── */}
      {/*
        Shiki wraps the output in <pre><code>…</code></pre>.
        We override the <pre> styles so our container controls the
        scroll behaviour (horizontal scroll on small screens).
      */}
      <div
        className="overflow-x-auto p-4 [&_pre]:!m-0 [&_pre]:!p-0 [&_pre]:!bg-transparent [&_pre]:overflow-visible"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: content is server-rendered by Shiki, never user input
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
