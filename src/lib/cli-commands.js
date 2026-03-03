/**
 * src/lib/cli-commands.js
 *
 * Re-exports CLI command data from the authoritative data layer
 * (`lib/data/cli-commands.js`) enriched with page-layer fields required by
 * the CLI reference page (`/docs/cli`) and the CommandTable component.
 *
 * Every entry exposes:
 *
 *   command     {string}  – full command string as typed in a terminal
 *   cmd         {string}  – alias for `command` (used by CommandTable summary)
 *   anchor      {string}  – kebab-case HTML id for deep-linking
 *   name        {string}  – short display name
 *   description {string}  – one-sentence summary
 *   usage       {string}  – full usage signature (optional)
 *   options     {Array}   – array of { flag, description, default? } (optional)
 *   example     {string}  – plain-string example invocation (optional)
 *   exampleLang {string}  – language hint for CodeBlock (optional, default "bash")
 *   notes       {Array}   – bullet-point callouts (optional)
 *   badge       {Object}  – { label, color } decorative pill (optional)
 */

import { cliCommands } from "../../lib/data/cli-commands.js";

/**
 * CLI_COMMANDS — full enriched list consumed by both:
 *   - CommandTable (uses `command`/`cmd`, `description`, `anchor`)
 *   - CLI reference page sections (uses all fields)
 *
 * @type {Array<import("../../lib/contracts/cli-command.js").CliCommand & { cmd: string }>}
 */
export const CLI_COMMANDS = cliCommands.map((entry) => ({
  ...entry,
  // `cmd` is a backward-compatible alias for `command` consumed by the
  // summary table and any legacy code that references this field.
  cmd: entry.command,
}));

/**
 * Map badge color labels to Tailwind utility classes.
 * Used by the CLI reference page's per-command sections.
 *
 * @type {Record<string, string>}
 */
export const BADGE_COLORS = {
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  indigo:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  slate:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};
