"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "./icons.js";

/**
 * A syntax-highlighted code block with a copy-to-clipboard button.
 *
 * Props:
 *   code     {string}  – source code to display
 *   language {string}  – used only for the label (e.g. "bash", "json")
 *   label    {string}  – optional override for the top-right badge
 */
export function CodeBlock({ code, language = "bash", label }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      /* clipboard unavailable */
    }
  }

  const badge = label ?? language;

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 dark:border-slate-700">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="font-mono text-xs text-slate-500">{badge}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto">
        <pre className="px-5 py-4 text-sm leading-relaxed text-slate-200">
          <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
