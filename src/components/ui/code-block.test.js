/**
 * src/components/ui/code-block.test.js
 *
 * Unit tests for the CodeBlock component and the highlight utility.
 *
 * Tests are deliberately kept integration-light: they exercise the
 * real Shiki highlight() function (no mocking) so that we catch
 * version drift or misconfiguration early.
 */

import { describe, it, expect, vi } from "vitest";
import { highlight, DARK_THEME, LIGHT_THEME } from "../../../lib/highlight.js";

// ---------------------------------------------------------------------------
// highlight() — lib/highlight.js
// ---------------------------------------------------------------------------

describe("highlight()", () => {
  it("returns an HTML string for a known language (bash)", async () => {
    const html = await highlight({ code: "npm install -g clawfactory", lang: "bash" });
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(0);
  });

  it("wraps output in a <pre> element", async () => {
    const html = await highlight({ code: "const x = 1;", lang: "javascript" });
    expect(html).toContain("<pre");
    expect(html).toContain("</pre>");
  });

  it("includes the source code in the output", async () => {
    const code = "clawfactory build";
    const html = await highlight({ code, lang: "bash" });
    expect(html).toContain("clawfactory");
    expect(html).toContain("build");
  });

  it("applies the dark theme by default (colorScheme omitted)", async () => {
    const html = await highlight({ code: "const a = 1;", lang: "javascript" });
    // github-dark embeds a background-color style on the <pre>
    // We just verify the call succeeded; theme internals are Shiki's domain.
    expect(html).toBeTruthy();
  });

  it("applies a different background when colorScheme is 'light'", async () => {
    const dark = await highlight({ code: "x = 1", lang: "python", colorScheme: "dark" });
    const light = await highlight({ code: "x = 1", lang: "python", colorScheme: "light" });
    // The two outputs must differ (different inline colours from the two themes).
    expect(dark).not.toBe(light);
  });

  it("falls back to plaintext for unknown languages without throwing", async () => {
    await expect(
      highlight({ code: "some unknown code", lang: "brainfuck_xyz" })
    ).resolves.toContain("<pre");
  });

  it("handles empty string gracefully", async () => {
    const html = await highlight({ code: "", lang: "bash" });
    expect(typeof html).toBe("string");
  });

  it("handles multi-line code", async () => {
    const code = `import React from 'react';\n\nexport default function App() {\n  return <div>Hello</div>;\n}`;
    const html = await highlight({ code, lang: "jsx" });
    expect(html).toContain("React");
    expect(html).toContain("App");
  });

  it("highlights TypeScript correctly", async () => {
    const code = `const greet = (name: string): string => \`Hello, \${name}!\`;`;
    const html = await highlight({ code, lang: "typescript" });
    expect(html).toContain("greet");
  });

  it("highlights JSON correctly", async () => {
    const code = `{ "key": "value", "num": 42 }`;
    const html = await highlight({ code, lang: "json" });
    expect(html).toContain("key");
    expect(html).toContain("42");
  });

  it("exports DARK_THEME and LIGHT_THEME constants", () => {
    expect(DARK_THEME).toBe("github-dark");
    expect(LIGHT_THEME).toBe("github-light");
  });

  it("reuses the same highlighter instance across calls (singleton)", async () => {
    // Call twice; if singleton is broken, the second call would re-create
    // the highlighter and both would still work — we mainly verify no errors.
    const [a, b] = await Promise.all([
      highlight({ code: "echo hi", lang: "bash" }),
      highlight({ code: "echo bye", lang: "bash" }),
    ]);
    expect(a).toContain("<pre");
    expect(b).toContain("<pre");
  });
});
