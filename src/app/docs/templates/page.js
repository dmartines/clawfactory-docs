import Link from "next/link";
import TemplatesToc from "@/components/templates-toc.jsx";
import {
  TEMPLATES,
  TEMPLATE_ANATOMY,
  TEMPLATE_ENV_VARS,
  DECISION_MATRIX,
} from "@/lib/templates.js";

export const metadata = {
  title: "Templates — ClawFactory Docs",
  description:
    "Scaffold templates for ClawFactory projects — what they are, which to choose, and how to extend them.",
};

/* ─────────────────────────────────────────────────────────────────────────
   Page-local sub-components
   ───────────────────────────────────────────────────────────────────────── */

function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      className="group flex items-center gap-2 text-xl font-semibold text-slate-100 mb-4 scroll-mt-24"
    >
      <a
        href={`#${id}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-indigo-400"
        aria-label={`Link to ${children}`}
      >
        #
      </a>
      {children}
    </h2>
  );
}

function P({ children }) {
  return (
    <p className="text-sm leading-relaxed text-slate-400 mb-3 last:mb-0">
      {children}
    </p>
  );
}

function StackPill({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-xs font-mono text-slate-300">
      {label}
    </span>
  );
}

function Note({ children }) {
  return (
    <div className="flex gap-3 rounded-lg border border-indigo-500/25 bg-indigo-500/8 px-4 py-3.5 my-4">
      <span
        className="shrink-0 mt-0.5 text-indigo-400 text-sm font-bold select-none"
        aria-hidden="true"
      >
        ℹ
      </span>
      <div className="text-sm leading-relaxed text-indigo-200/80">{children}</div>
    </div>
  );
}

/** A single template card. */
function TemplateCard({ template }) {
  const { id, name, icon, stack, description, when, note } = template;
  return (
    <section
      id={id}
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 transition-colors hover:border-slate-700 scroll-mt-24 mb-6"
    >
      {/* Header row */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-xl">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-lg font-semibold text-slate-100 mb-2">
            <code className="text-indigo-300">{name}</code>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((s) => (
              <StackPill key={s} label={s} />
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-slate-400 mb-4">{description}</p>

      {/* Use when */}
      <div className="rounded-lg border border-slate-700/60 bg-slate-800/30 px-4 py-3 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Use when
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">{when}</p>
      </div>

      {/* Optional note */}
      {note && <Note>{note}</Note>}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────────────── */

export default function TemplatesPage() {
  return (
    <div className="flex gap-12 items-start">
      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-3">
            <span>docs</span>
            <span>/</span>
            <span className="text-indigo-400">templates</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-3">
            Templates
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
            Templates are scaffold starting points. They define the initial file
            structure, dependencies, and integration wiring that ClawFactory
            builds on top of. Pick one during{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-300">
              clawfactory init
            </code>
            .
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1 — Available templates
            ══════════════════════════════════════════════════════════════ */}
        <section id="available-templates" className="scroll-mt-24 mb-12">
          <SectionHeading id="available-templates">
            Available Templates
          </SectionHeading>
          <P>
            ClawFactory ships with two first-party templates. More are on the
            roadmap — community templates can be referenced by a Git URL.
          </P>

          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2 — Choosing a template
            ══════════════════════════════════════════════════════════════ */}
        <section id="choosing-a-template" className="scroll-mt-24 mb-12">
          <SectionHeading id="choosing-a-template">
            Choosing a Template
          </SectionHeading>
          <P>
            If you're not sure which template to use, start with{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-300">
              nextjs-tailwind
            </code>
            . It has the fewest moving parts and is the easiest to extend. The
            factory handles everything else — you can always add Supabase or
            Stripe integrations later via spec annotations.
          </P>
          <P>
            Reach for{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-300">
              nextjs-supabase-stripe
            </code>{" "}
            only when your spec explicitly calls for user auth or subscription
            billing. The additional wiring (RLS policies, webhook handlers,
            Stripe products) adds complexity that is unnecessary if you don't
            need it.
          </P>

          {/* Decision matrix */}
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/70">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    I need…
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Template
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {DECISION_MATRIX.map(({ need, template }) => (
                  <tr key={need}>
                    <td className="px-4 py-3 text-slate-400 text-xs leading-relaxed">
                      {need}
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                        {template}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 3 — Template anatomy
            ══════════════════════════════════════════════════════════════ */}
        <section id="template-anatomy" className="scroll-mt-24 mb-12">
          <SectionHeading id="template-anatomy">Template Anatomy</SectionHeading>
          <P>
            Every template is a directory with a predictable structure. You can
            inspect or fork any built-in template from the ClawFactory monorepo
            under{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-300">
              packages/templates/
            </code>
            .
          </P>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 divide-y divide-slate-800">
            {TEMPLATE_ANATOMY.map(({ path, desc }) => (
              <div key={path} className="flex flex-col sm:flex-row gap-2 p-4 bg-slate-900/40">
                <div className="shrink-0 sm:w-48">
                  <code className="font-mono text-xs text-indigo-300">{path}</code>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Directory tree example */}
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-700 bg-slate-950/80">
            <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" aria-hidden="true" />
              <span className="ml-2 text-xs font-mono text-slate-500">
                packages/templates/nextjs-tailwind/
              </span>
            </div>
            <pre className="px-5 py-4 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`nextjs-tailwind/
├── template.json         ← metadata & required env vars
├── files/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   └── globals.css
│   │   └── components/
│   │       └── .gitkeep
│   └── .env.example
└── hooks/
    └── post-init.js      ← runs \`npm install\` after scaffold`}
            </pre>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 4 — Environment variables
            ══════════════════════════════════════════════════════════════ */}
        <section id="env-vars" className="scroll-mt-24 mb-12">
          <SectionHeading id="env-vars">Environment Variables</SectionHeading>
          <P>
            Each template declares its required environment variables in{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-300">
              template.json
            </code>
            . The setup wizard reads this list and prompts for any that are not
            already set in your machine-wide config.
          </P>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/70">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Variable
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Template
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Required for
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {TEMPLATE_ENV_VARS.map(({ varName, template, purpose }) => (
                  <tr key={varName}>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-indigo-300">{varName}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-400">{template}</code>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 leading-relaxed">
                      {purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Page navigation ─────────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between text-sm">
          <Link
            href="/docs/writing-specs"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Writing a Spec</span>
          </Link>
          <Link
            href="/docs/getting-started"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span>Getting Started</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* ── On-page TOC (xl+ right column) ──────────────────────────── */}
      <TemplatesToc />
    </div>
  );
}
