/**
 * src/app/code-block-demo/page.js
 *
 * Visual demo / smoke-test for the CodeBlock component.
 * Visit http://localhost:3000/code-block-demo during development.
 */

import CodeBlock from "../../components/ui/code-block.jsx";

const BASH_SNIPPET = `# Install ClawFactory globally
npm install -g clawfactory

# Interactive setup wizard (API keys, GitHub token, Docker check)
clawfactory setup

# Scaffold a new project from a spec
clawfactory init my-app --spec ./spec.md --template nextjs-tailwind`;

const JS_SNIPPET = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;`;

const TS_SNIPPET = `import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
  themes: ["github-dark", "github-light"],
  langs: ["typescript", "bash", "json"],
});

const html = highlighter.codeToHtml(
  \`const greeting: string = "hello";\`,
  { lang: "typescript", theme: "github-dark" }
);`;

const JSON_SNIPPET = `{
  "name": "clawfactory-docs",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^15.1.0",
    "shiki": "^4.0.1"
  }
}`;

const INLINE_SNIPPET = `npm install -g clawfactory`;

export const metadata = {
  title: "CodeBlock Demo — ClawFactory Docs",
};

export default function CodeBlockDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-12">
        <header>
          <h1 className="font-mono text-3xl font-bold text-indigo-400">
            CodeBlock — Demo
          </h1>
          <p className="mt-2 text-slate-400">
            Syntax-highlighted code blocks with a copy-to-clipboard button,
            powered by Shiki (server-side).
          </p>
        </header>

        {/* ── Shell / Bash ─── */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">Bash — dark theme</h2>
          <CodeBlock lang="bash" code={BASH_SNIPPET} />
        </section>

        {/* ── JavaScript with filename ─── */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">
            JavaScript — with filename
          </h2>
          <CodeBlock lang="javascript" filename="next.config.js" code={JS_SNIPPET} />
        </section>

        {/* ── TypeScript ─── */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">TypeScript — dark theme</h2>
          <CodeBlock lang="typescript" code={TS_SNIPPET} />
        </section>

        {/* ── JSON ─── */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">JSON — dark theme</h2>
          <CodeBlock lang="json" filename="package.json" code={JSON_SNIPPET} />
        </section>

        {/* ── Light theme ─── */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">
            Bash — light theme
          </h2>
          <div className="rounded-xl bg-white p-4">
            <CodeBlock lang="bash" colorScheme="light" code={BASH_SNIPPET} />
          </div>
        </section>

        {/* ── Single-line (inline command) ─── */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">Single-line command</h2>
          <CodeBlock lang="bash" code={INLINE_SNIPPET} />
        </section>
      </div>
    </main>
  );
}
