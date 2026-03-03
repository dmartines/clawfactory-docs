/**
 * lib/highlight.js
 *
 * Shiki highlighter singleton for server-side syntax highlighting.
 * Returns HTML strings safe to dangerouslySetInnerHTML on the server.
 *
 * Uses a module-level cache so the highlighter is created once per
 * Node.js process (critical for Next.js — avoids loading WASM on
 * every request).
 */

import { createHighlighter } from "shiki";

/** @type {Promise<import('shiki').Highlighter> | null} */
let highlighterPromise = null;

/**
 * Supported languages.  Adding entries here also makes them available
 * to `codeToHtml` without extra config.
 */
const SUPPORTED_LANGS = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "json",
  "bash",
  "shell",
  "css",
  "html",
  "markdown",
  "mdx",
  "sql",
  "plaintext",
];

/** Built-in themes — dark + light pair used by the component. */
export const DARK_THEME = "github-dark";
export const LIGHT_THEME = "github-light";

/**
 * Returns the shared Shiki highlighter, creating it on the first call.
 *
 * @returns {Promise<import('shiki').Highlighter>}
 */
export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [DARK_THEME, LIGHT_THEME],
      langs: SUPPORTED_LANGS,
    });
  }
  return highlighterPromise;
}

/**
 * Converts a code string into an HTML string with syntax highlighting.
 *
 * @param {object} opts
 * @param {string} opts.code   - Raw source code to highlight.
 * @param {string} opts.lang   - Language identifier (e.g. "bash", "js").
 * @param {"dark"|"light"} [opts.colorScheme="dark"] - Which theme to use.
 * @returns {Promise<string>}  HTML string (contains a full <pre> element).
 */
export async function highlight({ code, lang, colorScheme = "dark" }) {
  const highlighter = await getHighlighter();

  // Gracefully fall back to plaintext for unknown languages.
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : "plaintext";
  const theme = colorScheme === "light" ? LIGHT_THEME : DARK_THEME;

  return highlighter.codeToHtml(code, { lang: resolvedLang, theme });
}
