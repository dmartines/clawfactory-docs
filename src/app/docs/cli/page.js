import { CLI_COMMANDS, BADGE_COLORS } from "../../../lib/cli-commands.js";
import CommandTable from "../../../components/ui/command-table.js";
import CodeBlock from "../../../components/ui/code-block.jsx";
import { TerminalIcon } from "../../../components/icons.js";

export const metadata = {
  title: "CLI Reference",
  description:
    "Complete reference for every ClawFactory CLI command — usage, options, and examples.",
};

/** Render a single option row in the options table. */
function OptionRow({ flag, description, defaultValue }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 dark:border-slate-800">
      <td className="w-56 py-3 pr-4 align-top">
        <code className="whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {flag}
        </code>
      </td>
      <td className="py-3 pr-4 align-top text-sm text-slate-600 dark:text-slate-400">
        {description}
      </td>
      <td className="py-3 align-top text-sm">
        {defaultValue != null ? (
          <code className="whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-500">
            {defaultValue}
          </code>
        ) : (
          <span className="text-slate-300 dark:text-slate-700">—</span>
        )}
      </td>
    </tr>
  );
}

/** Full detailed card for one command. */
function CommandSection({ command }) {
  const {
    anchor,
    name,
    description,
    usage,
    options,
    example,
    exampleLang,
    notes,
    badge,
  } = command;

  const badgeClass = badge ? BADGE_COLORS[badge.color] : null;

  return (
    <section
      id={anchor}
      className="mb-16 scroll-mt-24 border-b border-slate-100 pb-16 last:border-0 dark:border-slate-800"
    >
      {/* Command heading */}
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <h2 className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
          clawfactory{" "}
          <span className="text-indigo-500">{name}</span>
          {name === "init" && (
            <span className="text-slate-400"> &lt;name&gt;</span>
          )}
          {name === "approve" && (
            <span className="text-slate-400"> &lt;id&gt;</span>
          )}
        </h2>
        {badge && (
          <span
            className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>

      {/* Usage */}
      {usage && (
        <>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Usage
          </h3>
          <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <code className="font-mono text-sm text-slate-700 dark:text-slate-300">
              {usage}
            </code>
          </div>
        </>
      )}

      {/* Options table */}
      {options && options.length > 0 && (
        <>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Options
          </h3>
          <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200">
                    Flag / Argument
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {options.map((opt) => (
                  <OptionRow
                    key={opt.flag}
                    flag={opt.flag}
                    description={opt.description}
                    defaultValue={opt.default}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Example */}
      {example && (
        <>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Example
          </h3>
          <CodeBlock code={example} lang={exampleLang ?? "bash"} />
        </>
      )}

      {/* Notes */}
      {notes && notes.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              {note}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Summary table data — derived from CLI_COMMANDS. */
const SUMMARY_ROWS = CLI_COMMANDS.map(({ command, description, anchor }) => ({
  command,
  description,
  anchor,
}));

export default function CLIReferencePage() {
  return (
    <article className="min-w-0">
      {/* Page header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
            <TerminalIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </span>
          <span className="font-mono text-sm font-medium text-indigo-500">Reference</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          CLI Reference
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          Complete reference for every{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-base dark:bg-slate-800">
            clawfactory
          </code>{" "}
          command — usage flags, defaults, and copy-pasteable examples.
        </p>
      </div>

      {/* Quick-reference summary table */}
      <section className="mb-14">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          All Commands
        </h2>
        <CommandTable commands={SUMMARY_ROWS} />
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-600">
          Click any command to jump to its full reference section below.
        </p>
      </section>

      {/* Divider */}
      <hr className="mb-14 border-slate-200 dark:border-slate-800" />

      {/* Per-command sections */}
      {CLI_COMMANDS.map((command) => (
        <CommandSection key={command.anchor} command={command} />
      ))}
    </article>
  );
}
