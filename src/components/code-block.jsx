"use client";

import { useState } from "react";

/**
 * CodeBlock — monospaced code display with a one-click copy button.
 *
 * Props:
 *   children  {string}  — the raw code string
 *   language  {string}  — display label (e.g. "bash", "json") — optional
 */
export default function CodeBlock({ children, language }) {
  const [copied, setCopied] = useState(false);

  const code = typeof children === "string" ? children : String(children ?? "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. HTTP context) — silently ignore
    }
  };

  return (
    <div className="group relative my-6 rounded-lg border border-slate-700 bg-slate-900 text-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
        {language ? (
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
            {language}
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy code"}
          className="
            flex items-center gap-1.5
            rounded px-2 py-1
            text-xs font-medium
            text-slate-400 hover:text-white
            bg-transparent hover:bg-slate-700
            transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          "
        >
          {copied ? (
            <>
              {/* Checkmark icon */}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-green-400" aria-hidden="true">
                <path d="M2 8l4 4 8-8" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              {/* Clipboard icon */}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                <rect x="5" y="2" width="9" height="12" rx="1.5" />
                <path d="M5 4H3.5A1.5 1.5 0 002 5.5v9A1.5 1.5 0 003.5 16h7a1.5 1.5 0 001.5-1.5V14" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto px-4 py-4 leading-relaxed text-slate-200">
        <code className="font-mono">{code.trim()}</code>
      </pre>
    </div>
  );
}
