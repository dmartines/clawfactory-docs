/**
 * CommandTable — Styled table for CLI reference.
 *
 * Renders a full-width, striped, hover-highlighted table of CLI commands.
 * Each row contains:
 *   - A monospaced `command` cell (linked to its anchor if provided)
 *   - A prose `description` cell
 *   - An optional inline detail panel with `usage`, `options`, and `example`
 *
 * Props
 * ─────
 * commands  {CommandEntry[]}  Array of command objects (required).
 * caption   {string?}         Optional <caption> text shown above the table.
 *
 * CommandEntry shape
 * ──────────────────
 * {
 *   command:     string    – full command string, e.g. "clawfactory init <name>"
 *   description: string    – short human-readable description
 *   anchor?:     string    – kebab-case id used for a within-page deep-link
 *   usage?:      string    – full usage signature shown as a code snippet
 *   options?:    Array<{ flag: string; description: string }>
 *   example?:    string    – a short example invocation
 * }
 */

/**
 * @typedef {{ flag: string; description: string; default?: string }} CommandOption
 *
 * @typedef {{
 *   command:     string;
 *   description: string;
 *   anchor?:     string;
 *   usage?:      string;
 *   options?:    CommandOption[];
 *   example?:    string;
 * }} CommandEntry
 */

// ─── Internal sub-components ──────────────────────────────────────────────────

/**
 * Renders a single option flag row inside an expandable detail panel.
 *
 * @param {{ flag: string; description: string }} props
 */
function OptionRow({ flag, description }) {
  return (
    <li className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
      <code className="shrink-0 rounded bg-slate-700 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
        {flag}
      </code>
      <span className="text-slate-400">{description}</span>
    </li>
  );
}

/**
 * Optional inline detail panel rendered below a row's description when
 * `usage`, `options`, or `example` data are present.
 *
 * Returns null (renders nothing) when no content is available so the row
 * stays compact by default.
 *
 * @param {{ usage?: string; options?: CommandOption[]; example?: string }} props
 */
function CommandDetail({ usage, options, example }) {
  const hasContent = usage || (options && options.length > 0) || example;
  if (!hasContent) return null;

  return (
    <div className="mt-2 space-y-2 rounded-md border border-slate-700 bg-slate-900 p-3">
      {/* Usage signature */}
      {usage && (
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Usage
          </span>
          <code className="block font-mono text-sm text-slate-200">{usage}</code>
        </div>
      )}

      {/* Options list */}
      {options && options.length > 0 && (
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Options
          </span>
          <ul className="space-y-1">
            {options.map((opt) => (
              <OptionRow
                key={opt.flag}
                flag={opt.flag}
                description={opt.description}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Example invocation */}
      {example && (
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Example
          </span>
          <code className="block font-mono text-sm text-indigo-300">
            {example}
          </code>
        </div>
      )}
    </div>
  );
}

// ─── Primary export ────────────────────────────────────────────────────────────

/**
 * CommandTable — primary export.
 *
 * Renders a styled, accessible table of CLI commands.  When `commands` is
 * empty or falsy, a graceful "no commands" message is shown instead.
 *
 * Accessibility
 * ─────────────
 * - Uses `<table>`, `<thead>`, `<tbody>` landmarks with `scope` attributes.
 * - Optional `<caption>` provides an accessible table label.
 * - Row hover states and zebra-striping use Tailwind utilities that respect
 *   both light and dark mode via `dark:` variants.
 *
 * @param {{ commands: CommandEntry[]; caption?: string }} props
 */
export default function CommandTable({ commands, caption }) {
  // Graceful empty-state guard
  if (!commands || commands.length === 0) {
    return (
      <p className="text-sm italic text-slate-500">No commands to display.</p>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 shadow-lg">
      <table className="w-full border-collapse text-left text-sm">
        {/* Optional accessible caption */}
        {caption && (
          <caption className="border-b border-slate-700 bg-slate-900 px-4 py-3 text-left text-base font-semibold text-slate-100">
            {caption}
          </caption>
        )}

        {/* ── Header ── */}
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900">
            <th
              scope="col"
              className="w-[38%] px-5 py-3 font-semibold tracking-wide text-slate-300"
            >
              Command
            </th>
            <th
              scope="col"
              className="px-5 py-3 font-semibold tracking-wide text-slate-300"
            >
              Description
            </th>
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {commands.map((entry, index) => {
            // Zebra-stripe: even rows are darker, odd rows slightly lighter
            const rowBg =
              index % 2 === 0 ? "bg-slate-950" : "bg-slate-900/60";

            return (
              <tr
                key={entry.command}
                className={`${rowBg} border-b border-slate-800 transition-colors duration-100 last:border-0 hover:bg-indigo-950/40`}
              >
                {/* ── Command cell ── */}
                <td className="px-5 py-4 align-top">
                  {entry.anchor ? (
                    <a
                      href={`#${entry.anchor}`}
                      className="inline-block rounded bg-slate-800 px-2 py-1 font-mono text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20 transition-colors hover:text-indigo-200 hover:ring-indigo-400/40"
                    >
                      {entry.command}
                    </a>
                  ) : (
                    <code className="inline-block whitespace-nowrap rounded bg-slate-800 px-2 py-1 font-mono text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                      {entry.command}
                    </code>
                  )}
                </td>

                {/* ── Description + optional detail ── */}
                <td className="px-5 py-4 align-top leading-relaxed text-slate-300">
                  <p>{entry.description}</p>
                  <CommandDetail
                    usage={entry.usage}
                    options={entry.options}
                    example={entry.example}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
