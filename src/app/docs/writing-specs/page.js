import { CodeBlock } from "@/components/code-block.js";
import InlineCode from "@/components/inline-code.js";
import TierBadge from "@/components/tier-badge.js";
import SpecToc from "@/components/spec-toc.jsx";
import {
  SPEC_SECTIONS,
  SPEC_TIPS,
  COMPILER_ARTEFACTS,
} from "@/lib/spec-sections.js";

export const metadata = {
  title: "Writing a Spec — ClawFactory Docs",
  description:
    "How to write a SPEC.md that ClawFactory can parse into contracts, migrations, and GitHub Issues — with annotated examples for every required section.",
};

/* ─── Page-local sub-components ─────────────────────────────────────── */

/** Pill badge: Required / Optional */
function RequiredBadge({ required }) {
  return required ? (
    <TierBadge label="REQUIRED" variant="indigo" />
  ) : (
    <TierBadge label="OPTIONAL" variant="slate" />
  );
}

/** A single spec-section card with fields reference + example. */
function SpecSectionCard({ section }) {
  const { id, icon, label, required, tagline, description, fields, example } =
    section;

  return (
    <section
      id={id}
      className="mb-12 scroll-mt-24 rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 transition-colors hover:border-slate-700"
    >
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start gap-3">
        {/* Icon badge */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-lg">
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-mono text-lg font-semibold text-slate-100">
              {label}
            </h3>
            <RequiredBadge required={required} />
          </div>
          <p className="mt-0.5 font-mono text-sm text-indigo-400">
            — {tagline}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-slate-400">
        {description}
      </p>

      {/* Fields reference */}
      <div className="mb-5 overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/60">
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Field
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                What to include
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {fields.map((f) => (
              <tr key={f.name}>
                <td className="whitespace-nowrap px-4 py-2.5 align-top">
                  <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                    {f.name}
                  </code>
                </td>
                <td className="px-4 py-2.5 align-top text-xs text-slate-400">
                  {f.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Code example */}
      <CodeBlock code={example.code} language={example.language} label={example.label} />
    </section>
  );
}

/** A row in the compiler artefacts table. */
function ArtefactRow({ source, artefact, path, note }) {
  return (
    <tr className="border-b border-slate-800 last:border-0">
      <td className="px-4 py-3 align-top">
        <span className="text-xs font-mono text-slate-300">{source}</span>
      </td>
      <td className="px-4 py-3 align-top">
        <span className="text-xs font-semibold text-indigo-300">{artefact}</span>
      </td>
      <td className="px-4 py-3 align-top">
        <code className="whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-400">
          {path}
        </code>
      </td>
      <td className="px-4 py-3 align-top text-xs leading-relaxed text-slate-500">
        {note}
      </td>
    </tr>
  );
}

/** A single tip card. */
function TipCard({ tip }) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-700">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-base">
        {tip.icon}
      </div>
      <div>
        <p className="mb-1 text-sm font-semibold text-slate-200">
          {tip.headline}
        </p>
        <p className="text-sm leading-relaxed text-slate-400">{tip.body}</p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function WritingSpecsPage() {
  return (
    <div className="flex gap-12 items-start">
      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-3">
            <span>docs</span>
            <span>/</span>
            <span className="text-indigo-400">writing-specs</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-3">
            Writing a Spec
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
            The <InlineCode>SPEC.md</InlineCode> is the single source of truth
            for your project. This guide covers every section the compiler
            understands, shows annotated examples, and explains exactly what
            gets generated from each part of your spec.
          </p>
        </div>

        {/* ── Quick anatomy ────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Spec anatomy at a glance
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-xs text-slate-300">
              {[
                ["1. What This App Is", "REQUIRED"],
                ["2. Data Model",       "REQUIRED"],
                ["3. API Routes",       "REQUIRED"],
                ["4. Pages",            "REQUIRED"],
                ["5. Auth",             "optional"],
                ["6. Integrations",     "optional"],
                ["7. Non-Goals",        "optional (but strongly recommended)"],
              ].map(([section, status]) => (
                <div key={section} className="flex items-center gap-2">
                  <span className="text-indigo-500">›</span>
                  <span className="text-slate-200">{section}</span>
                  <span className="ml-auto text-slate-600 text-xs">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How the compiler works ───────────────────────────────────── */}
        <section id="how-it-works" className="mb-12 scroll-mt-24">
          <h2 className="mb-2 text-xl font-bold text-slate-100">
            How the spec compiler works
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-400">
            When you run <InlineCode>clawfactory init</InlineCode>, the compiler
            parses every section of your <InlineCode>SPEC.md</InlineCode> and
            generates the artefacts below. The process is fully deterministic —
            running it twice on the same spec produces the same output. Changing
            the spec and re-running will produce a{" "}
            <em className="text-slate-300">delta</em>: only the new or changed
            artefacts are regenerated.
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/70">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Spec section
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Artefact generated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Output path
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/40">
                {COMPILER_ARTEFACTS.map((row) => (
                  <ArtefactRow key={row.artefact + row.source} {...row} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Compiler pipeline diagram */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-500">
            {[
              "SPEC.md",
              "→",
              "Compiler",
              "→",
              "Zod contracts",
              "·",
              "SQL migrations",
              "·",
              "GitHub Issues",
            ].map((chunk, i) => (
              <span
                key={i}
                className={
                  chunk === "→" || chunk === "·"
                    ? "text-slate-700"
                    : chunk === "SPEC.md" || chunk === "Compiler"
                    ? "rounded bg-slate-800 px-2 py-0.5 text-indigo-300"
                    : "rounded bg-slate-800/50 px-2 py-0.5 text-slate-400"
                }
              >
                {chunk}
              </span>
            ))}
          </div>
        </section>

        {/* ── Section-by-section guide ─────────────────────────────────── */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-100">
            Section-by-section guide
          </h2>
          {SPEC_SECTIONS.map((section) => (
            <SpecSectionCard key={section.id} section={section} />
          ))}
        </div>

        {/* ── GitHub Issues deep-dive ──────────────────────────────────── */}
        <section id="github-issues" className="mb-12 scroll-mt-24">
          <h2 className="mb-2 text-xl font-bold text-slate-100">
            How GitHub Issues are auto-generated
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            During <InlineCode>clawfactory init</InlineCode>, the compiler walks
            every API route and page in your spec and opens one GitHub Issue per
            unit of work. Issues are the factory's native task system — agents
            pick them up, implement them, and close them. The title, body, and
            labels of each Issue are derived directly from the spec.
          </p>

          {/* Issue anatomy example */}
          <div className="overflow-hidden rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800/70 px-4 py-2.5">
              <span className="font-mono text-xs text-slate-400">
                github.com/your-org/my-app/issues/7
              </span>
              <span className="ml-auto rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400 border border-green-500/20">
                open
              </span>
            </div>
            <div className="p-5">
              <p className="mb-1 text-base font-semibold text-slate-100">
                feat: Implement PATCH /api/tasks/:id
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-300 border border-indigo-500/20">
                  api-route
                </span>
                <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs text-yellow-300 border border-yellow-500/20">
                  tier:medium
                </span>
                <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs text-slate-300 border border-slate-600">
                  scope:api
                </span>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-4 font-mono text-xs leading-relaxed text-slate-300">
                <p className="mb-2 font-semibold text-slate-200">
                  From SPEC.md § 3. API Routes
                </p>
                <p>Method: PATCH</p>
                <p>Path: /api/tasks/:id</p>
                <p>Auth: required (project member)</p>
                <p className="mt-2">Request:</p>
                <p className="pl-4 text-slate-400">
                  {`{ title?: string, status?: 'todo'|'in_progress'|'done', assignee_id?: string | null }`}
                </p>
                <p className="mt-2">Response:</p>
                <p className="pl-4 text-slate-400">{`{ task: Task }`}</p>
                <p className="mt-2">Errors:</p>
                <p className="pl-4 text-slate-400">
                  404 if task not found, 403 if not a project member
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Issue labels drive model-tier routing and spawn scoping
            automatically. An <InlineCode>api-route</InlineCode> issue tagged{" "}
            <InlineCode>tier:medium</InlineCode> will be handled by a
            medium-tier model. A page issue tagged{" "}
            <InlineCode>scope:ui</InlineCode> gets a file scope limited to{" "}
            <InlineCode>src/app/</InlineCode> and{" "}
            <InlineCode>src/components/</InlineCode>. You can override labels on
            any Issue by editing it in GitHub — the factory will pick up the
            change on the next build iteration.
          </p>
        </section>

        {/* ── Tips ─────────────────────────────────────────────────────── */}
        <section id="tips" className="mb-12 scroll-mt-24">
          <h2 className="mb-2 text-xl font-bold text-slate-100">
            Tips for a great spec
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-400">
            A well-written spec builds faster, with fewer negotiable decisions
            and fewer retries. These six patterns separate specs that build
            cleanly from ones that stall.
          </p>
          <div className="space-y-3">
            {SPEC_TIPS.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>

        {/* ── Page nav ─────────────────────────────────────────────────── */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex items-center justify-between text-sm">
          <a
            href="/docs/cli"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>CLI Reference</span>
          </a>
          <a
            href="/docs/templates"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span>Templates</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* ── On-page TOC (xl+ right column) ──────────────────────────── */}
      <SpecToc />
    </div>
  );
}
