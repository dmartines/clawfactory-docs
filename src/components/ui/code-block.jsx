/**
 * src/components/ui/code-block.jsx
 *
 * Server Component — syntax-highlighted code block with copy button.
 *
 * Runs Shiki on the server to produce static HTML; hands that HTML
 * off to the thin Client Component that handles the copy interaction.
 *
 * Usage:
 * ```jsx
 * import CodeBlock from "@/components/ui/code-block.jsx";
 *
 * <CodeBlock lang="bash" code={`npm install -g clawfactory`} />
 *
 * <CodeBlock
 *   lang="javascript"
 *   filename="next.config.js"
 *   colorScheme="light"
 *   code={`module.exports = { output: "export" };`}
 * />
 * ```
 *
 * Props:
 *   - code         {string}           Required. Raw source code to display.
 *   - lang         {string}           Language for syntax highlighting.
 *                                     Defaults to "plaintext".
 *   - filename     {string?}          Optional filename shown in the header.
 *   - colorScheme  {"dark"|"light"}   Defaults to "dark".
 */

import { highlight } from "../../../lib/highlight.js";
import CodeBlockClient from "./code-block-client.jsx";

export default async function CodeBlock({
  code,
  lang = "plaintext",
  filename,
  colorScheme = "dark",
}) {
  if (!code || typeof code !== "string") {
    return null;
  }

  const html = await highlight({ code: code.trim(), lang, colorScheme });

  return (
    <CodeBlockClient
      html={html}
      code={code.trim()}
      lang={lang}
      filename={filename}
      colorScheme={colorScheme}
    />
  );
}
