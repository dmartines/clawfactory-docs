import { CodeBlock } from "@/components/code-block.js";
import InlineCode from "@/components/inline-code.js";
import GettingStartedToc from "@/components/getting-started-toc.js";
import Link from "next/link";

export const metadata = {
  title: "Getting Started — ClawFactory Docs",
  description:
    "Install ClawFactory, run the setup wizard, and ship your first spec-driven app in minutes. Step-by-step guide covering prerequisites, init, build, and deploy.",
};

/* ─────────────────────────────────────────────────────────────────────────
   Page-local presentational components
   ───────────────────────────────────────────────────────────────────────── */

/** Styled section anchor heading */
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

/** Step number bubble + title row */
function StepLabel({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-mono font-bold text-xs select-none">
        {number}
      </span>
      <span className="text-sm font-semibold text-indigo-400 font-mono tracking-tight">
        {title}
      </span>
    </div>
  );
}

/** Prose paragraph with standard spacing and color */
function P({ children }) {
  return (
    <p className="text-sm leading-relaxed text-slate-400 mb-3 last:mb-0">
      {children}
    </p>
  );
}

/** Informational callout box */
function Note({ children }) {
  return (
    <div className="flex gap-3 rounded-lg border border-indigo-500/25 bg-indigo-500/8 px-4 py-3.5 my-5">
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

/** Warning callout box */
function Warning({ children }) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-500/25 bg-amber-500/8 px-4 py-3.5 my-5">
      <span
        className="shrink-0 mt-0.5 text-amber-400 text-sm font-bold select-none"
        aria-hidden="true"
      >
        ⚠
      </span>
      <div className="text-sm leading-relaxed text-amber-200/80">{children}</div>
    </div>
  );
}

/** Terminal output display (not copyable — read-only output) */
function TerminalOutput({ children }) {
  return (
    <div className="my-4 rounded-xl border border-slate-700 bg-slate-950/80 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-700/60">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" aria-hidden="true" />
        <span className="ml-2 text-xs font-mono text-slate-500">terminal output</span>
      </div>
      <pre className="px-5 py-4 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}

/** A single prerequisite row */
function PrereqRow({ icon, name, detail, href }) {
  return (
    <li className="flex items-start gap-3 py-3 border-b border-slate-800 last:border-0">
      <span className="shrink-0 text-base mt-0.5" aria-hidden="true">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
            >
              {name}
            </a>
          ) : (
            <span className="text-sm font-semibold text-slate-200">{name}</span>
          )}
          <span className="text-xs text-slate-500">{detail}</span>
        </div>
      </div>
    </li>
  );
}

/** What-happens sub-item inside a step */
function WhatHappens({ steps }) {
  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 divide-y divide-slate-800 overflow-hidden">
      <div className="px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          What happens
        </span>
      </div>
      {steps.map(({ icon, label, description }, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3">
          <span className="shrink-0 text-base mt-0.5" aria-hidden="true">
            {icon}
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-0.5">{label}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────────────── */

export default function GettingStartedPage() {
  return (
    <div className="flex gap-12 items-start">
      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-3">
            <span>docs</span>
            <span>/</span>
            <span className="text-indigo-400">getting-started</span>
          </div>

          {/* Time-to-read badge */}
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-0.5 text-xs font-mono text-indigo-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
              ~10 min read
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-3">
            Getting Started
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
            This guide walks you through everything from installing ClawFactory
            to deploying your first spec-driven app. By the end you'll have a
            fully scaffolded project running a live build loop.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1 — Prerequisites
            ══════════════════════════════════════════════════════════════ */}
        <section id="prerequisites" className="scroll-mt-24 mb-12">
          <SectionHeading id="prerequisites">Prerequisites</SectionHeading>
          <P>
            Before installing ClawFactory, make sure the following tools and
            credentials are in place. The setup wizard will verify each one, but
            it's faster to gather them now.
          </P>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 overflow-hidden">
            <ul className="divide-y divide-slate-800">
              <PrereqRow
                icon="🟢"
                name="Node.js 22+"
                detail="The factory's CLI and build runner require Node 22 or later."
                href="https://nodejs.org"
              />
              <PrereqRow
                icon="🐳"
                name="Docker"
                detail="Used to sandbox agent execution. Must be running before clawfactory build."
                href="https://docs.docker.com/get-docker/"
              />
              <PrereqRow
                icon="🐙"
                name="Git"
                detail="Version-controlled projects only. The factory commits receipts, TASKS.md, and scaffolded files."
                href="https://git-scm.com"
              />
              <PrereqRow
                icon="🔑"
                name="GitHub Personal Access Token"
                detail="Needs repo scope. Used to create and manage GitHub Issues as tasks."
                href="https://github.com/settings/tokens/new?scopes=repo"
              />
              <PrereqRow
                icon="🤖"
                name="Anthropic API Key"
                detail="Powers all LLM calls (Claude). Get one from console.anthropic.com."
                href="https://console.anthropic.com"
              />
            </ul>
          </div>

          <Note>
            <strong className="text-indigo-300">Tip:</strong> Store your
            Anthropic and GitHub keys in a password manager or secrets vault
            before running setup — you'll only need to paste them once, and the
            wizard will store them in{" "}
            <InlineCode>~/.clawfactory/config.json</InlineCode>.
          </Note>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2 — Install
            ══════════════════════════════════════════════════════════════ */}
        <section id="install" className="scroll-mt-24 mb-12">
          <SectionHeading id="install">Install</SectionHeading>
          <P>
            Install the ClawFactory CLI globally via npm. This makes the{" "}
            <InlineCode>clawfactory</InlineCode> command available in your PATH.
          </P>

          <CodeBlock code="npm install -g clawfactory" language="bash" />

          <P>
            Verify the installation succeeded by checking the version:
          </P>

          <CodeBlock code="clawfactory --version" language="bash" />

          <TerminalOutput>
{`clawfactory/1.0.0 darwin-arm64 node-v22.11.0`}
          </TerminalOutput>

          <Note>
            <strong className="text-indigo-300">Using pnpm or yarn?</strong>{" "}
            You can install globally with{" "}
            <InlineCode>pnpm add -g clawfactory</InlineCode> or{" "}
            <InlineCode>yarn global add clawfactory</InlineCode> — both work
            identically.
          </Note>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 3 — Setup
            ══════════════════════════════════════════════════════════════ */}
        <section id="setup" className="scroll-mt-24 mb-12">
          <SectionHeading id="setup">Setup</SectionHeading>
          <P>
            Run the interactive setup wizard. This is a one-time step that
            configures your machine-wide ClawFactory credentials and verifies
            all dependencies.
          </P>

          <CodeBlock code="clawfactory setup" language="bash" />

          <TerminalOutput>
{`✦ ClawFactory Setup Wizard

? Enter your Anthropic API key: sk-ant-••••••••••••••••
? Enter your GitHub personal access token: ghp_••••••••••••••••
? GitHub username or org to own repositories: acme-corp
? Default model tier (light / medium / heavy): medium
? Verifying Docker daemon…  ✓ Docker 26.1.4 running
? Verifying GitHub token scope…  ✓ repo scope confirmed
? Verifying Anthropic API access…  ✓ claude-3-5-sonnet reachable

✓ Config written to ~/.clawfactory/config.json
✦ Setup complete. Run \`clawfactory init\` to create your first project.`}
          </TerminalOutput>

          <P>
            The wizard walks through four configuration steps:
          </P>

          <WhatHappens
            steps={[
              {
                icon: "🤖",
                label: "Anthropic API key",
                description:
                  "Stored securely in ~/.clawfactory/config.json and used for all LLM calls during the build loop. The wizard pings the API to confirm the key is valid.",
              },
              {
                icon: "🐙",
                label: "GitHub token",
                description:
                  "Used to create and manage GitHub Issues as tasks, post agent decision comments, and link pull requests to issues. Requires the repo scope.",
              },
              {
                icon: "🐳",
                label: "Docker verification",
                description:
                  "Checks that the Docker daemon is running and accessible. Each agent is spawned inside a Docker container for sandboxed file-system access — Docker must be up before clawfactory build runs.",
              },
              {
                icon: "⚡",
                label: "Default model tier",
                description:
                  "Sets the baseline model routing preference. medium is recommended for most projects. You can override per-task via spec annotations or GitHub Issue labels.",
              },
            ]}
          />

          <Warning>
            Your API keys are stored in plain text in{" "}
            <InlineCode>~/.clawfactory/config.json</InlineCode>. Make sure this
            file is not committed to version control. The file is automatically
            added to your global{" "}
            <InlineCode>~/.gitignore_global</InlineCode> by the setup wizard.
          </Warning>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 4 — Create your first project
            ══════════════════════════════════════════════════════════════ */}
        <section id="create-project" className="scroll-mt-24 mb-12">
          <SectionHeading id="create-project">
            Create Your First Project
          </SectionHeading>
          <P>
            Before running <InlineCode>init</InlineCode>, write a{" "}
            <InlineCode>spec.md</InlineCode> describing the app you want to
            build. The spec is your single source of truth — the richer it is,
            the better the factory performs. See{" "}
            <Link
              href="/docs/writing-specs"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Writing a Spec
            </Link>{" "}
            for guidance on structure and content.
          </P>

          <P>
            Once your spec is ready, initialise a new project:
          </P>

          <CodeBlock
            code="clawfactory init my-app --spec ./spec.md --template nextjs-tailwind"
            language="bash"
          />

          <TerminalOutput>
{`✦ ClawFactory Init — my-app

  Template     nextjs-tailwind
  Spec         ./spec.md
  Output dir   ./my-app

① Preflight checks
  ✓ Docker daemon running
  ✓ GitHub token valid (repo scope)
  ✓ Anthropic API reachable
  ✓ Output directory available

② Parsing spec
  ✓ Spec compiled — 12 data models, 9 API routes, 7 pages
  ✓ 3 database migrations generated → my-app/migrations/
  ✓ 6 Zod contracts generated      → my-app/lib/contracts/

③ Scaffolding project
  ✓ Template nextjs-tailwind applied
  ✓ 34 files written to ./my-app/

④ Generating GitHub Issues
  ✓ Repository created: acme-corp/my-app
  ✓ 23 GitHub Issues created
  ✓ TASKS.md written (read-only cache)

✦ Done! cd my-app && clawfactory build`}
          </TerminalOutput>

          <P>
            The <InlineCode>--template</InlineCode> flag sets the starting
            scaffold. Use <InlineCode>nextjs-tailwind</InlineCode> for a
            Next.js 15 + Tailwind CSS project, or{" "}
            <InlineCode>nextjs-supabase-stripe</InlineCode> to add Supabase
            and Stripe to the mix. See{" "}
            <Link
              href="/docs/templates"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Templates
            </Link>{" "}
            for the full list.
          </P>

          <WhatHappens
            steps={[
              {
                icon: "🔍",
                label: "Preflight checks",
                description:
                  "Verifies Docker is running, the GitHub token is valid, the Anthropic API is reachable, and the output directory doesn't already exist. Any failure stops the process before anything is written.",
              },
              {
                icon: "📄",
                label: "Spec parsing",
                description:
                  "The spec compiler reads your SPEC.md and extracts data models, API routes, page definitions, auth requirements, and integration points. It generates Zod contracts (lib/contracts/) and SQL migrations (migrations/) from the data model section.",
              },
              {
                icon: "🏗️",
                label: "Scaffolding",
                description:
                  "The chosen template is applied to the output directory. This creates the project structure, base configuration files, and any template-specific integrations. Template files are treated as a starting point — agents will fill in and modify them.",
              },
              {
                icon: "🐙",
                label: "GitHub Issue generation",
                description:
                  "A GitHub repository is created under your configured account, and one GitHub Issue is opened for every task derived from the spec: each API route, each page, each migration, each test suite. Issues are labelled with their model tier, permission tier, and spawn scope. TASKS.md is written as a local read-only cache.",
              },
            ]}
          />
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 5 — Build
            ══════════════════════════════════════════════════════════════ */}
        <section id="build" className="scroll-mt-24 mb-12">
          <SectionHeading id="build">Build</SectionHeading>
          <P>
            Navigate into the project directory and start the build loop.
            ClawFactory will work through all open GitHub Issues, spawning agents,
            running verification, and recording receipts until every task passes.
          </P>

          <CodeBlock
            code={`cd my-app
clawfactory build`}
            language="bash"
          />

          <TerminalOutput>
{`✦ ClawFactory Build — my-app

  Open issues     23
  Parallelism     4 agents max

── Iteration 1 ─────────────────────────────────────────
  Planning iteration…    8 tasks scheduled
  Spawning agents…

  [#1]  Set up project layout and config       ▶ running
  [#3]  Implement database schema migration    ▶ running
  [#5]  Generate Zod contracts from spec       ▶ running
  [#7]  Add auth middleware                    ▶ running

  [#1]  ✓ passed   (4 tests, 0 failed)  12.1s
  [#3]  ✓ passed   (2 tests, 0 failed)   8.4s
  [#5]  ✓ passed   (6 tests, 0 failed)  10.7s
  [#7]  ✓ passed   (3 tests, 0 failed)  14.2s

── Iteration 2 ─────────────────────────────────────────
  Planning iteration…    6 tasks scheduled
  Spawning agents…

  [#2]  Build user profile API route          ▶ running
  [#4]  Build dashboard page component        ▶ running
  …

  ⚠ Negotiable decision required — Issue #4
    Agent proposes: Use server-side rendering for dashboard
    (spec is ambiguous on SSR vs CSR for this page)
    Run \`clawfactory approve 4\` to accept or \`clawfactory approve 4 --reject\`

── Progress ─────────────────────────────────────────────
  Completed    14 / 23 tasks
  Passed       14    Failed  0    Pending  9`}
          </TerminalOutput>

          <P>
            The build loop runs iteratively until all issues are closed. Here's
            what happens inside each iteration:
          </P>

          <WhatHappens
            steps={[
              {
                icon: "🗺️",
                label: "Iteration planning",
                description:
                  "The planner analyses the dependency graph of open GitHub Issues and selects the next batch of tasks that can run concurrently — those whose dependencies are all already closed. The batch size is bounded by the configured parallelism limit.",
              },
              {
                icon: "🪄",
                label: "Agent spawning",
                description:
                  "Each task is handed off to a spawned agent running inside a Docker container. The agent receives: its GitHub Issue, the relevant spec sections, a file scope whitelist, and compressed receipt history. It cannot access files outside its scope.",
              },
              {
                icon: "✅",
                label: "Holdout verification",
                description:
                  "After the agent completes, a separate verification pass runs the holdout test suite — tests the agent never saw. A task only closes if all holdout tests pass. Failures trigger an automatic retry with the failure evidence added to context.",
              },
              {
                icon: "🧾",
                label: "Receipt recording",
                description:
                  "Win or lose, a receipt is written to .factory/receipts/ and committed to Git. Receipts capture what the agent did, which files changed, test results, and token cost. Future agents use receipts as compressed history.",
              },
              {
                icon: "🤝",
                label: "Negotiable decision handling",
                description:
                  "When an agent hits a decision that falls under the NEGOTIABLE tier — an ambiguous spec section, a schema change that could break data, a service integration — it pauses, posts a structured proposal to the GitHub Issue, and waits. Run clawfactory approve <id> to unblock it.",
              },
            ]}
          />

          <Note>
            You can pause and resume the build loop freely.{" "}
            <InlineCode>clawfactory build</InlineCode> is idempotent — already-
            closed issues are skipped automatically. Run{" "}
            <InlineCode>clawfactory status</InlineCode> at any time to see
            progress without restarting the loop.
          </Note>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 6 — Deploy
            ══════════════════════════════════════════════════════════════ */}
        <section id="deploy" className="scroll-mt-24 mb-12">
          <SectionHeading id="deploy">Deploy</SectionHeading>
          <P>
            Once all tasks pass, ship your app in two stages: preview first,
            then production.
          </P>

          <StepLabel number="1" title="Deploy to preview" />
          <CodeBlock code="clawfactory deploy" language="bash" />

          <TerminalOutput>
{`✦ Deploying to preview…

  Building Next.js app…     ✓
  Running build checks…     ✓ (0 errors, 2 warnings)
  Pushing to Vercel…        ✓

  Preview URL: https://my-app-git-main-acme-corp.vercel.app
  ✦ Preview deployment live.`}
          </TerminalOutput>

          <P>
            <InlineCode>clawfactory deploy</InlineCode> builds the app,
            runs a final check, and pushes to a Vercel preview URL. Use
            the preview to do a final review of the app before promoting
            to production.
          </P>

          <StepLabel number="2" title="Ship to production" />
          <CodeBlock code="clawfactory ship" language="bash" />

          <TerminalOutput>
{`✦ Shipping to production…

  Promoting preview → production…  ✓
  Running smoke tests…              ✓ (8 / 8 passed)
  Updating GitHub release…          ✓ v0.1.0 tagged

  Production URL: https://my-app.vercel.app
  ✦ Shipped. 🎉`}
          </TerminalOutput>

          <P>
            <InlineCode>clawfactory ship</InlineCode> promotes the preview
            deployment to production, runs a smoke test suite against the live
            URL, and tags a release in GitHub. The difference between the two
            commands is intentional:{" "}
            <InlineCode>deploy</InlineCode> is fast and reversible;{" "}
            <InlineCode>ship</InlineCode> is the deliberate, final act.
          </P>

          <Warning>
            <strong className="text-amber-300">Before shipping:</strong> check
            any open{" "}
            <InlineCode>NEGOTIABLE</InlineCode> decisions with{" "}
            <InlineCode>clawfactory status</InlineCode> and make sure all
            holdout tests pass with{" "}
            <InlineCode>clawfactory verify</InlineCode>. Shipping with
            unapproved negotiable items is blocked by default.
          </Warning>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 7 — What's next
            ══════════════════════════════════════════════════════════════ */}
        <section id="whats-next" className="scroll-mt-24 mb-10">
          <SectionHeading id="whats-next">What's Next</SectionHeading>
          <P>
            You've installed ClawFactory, scaffolded a project, run the build
            loop, and shipped to production. Here's where to go from here:
          </P>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <NextStepCard
              href="/docs/concepts"
              icon="🧠"
              title="Core Concepts"
              description="Understand the seven ideas that power ClawFactory: spec-driven development, spawn system, receipts, and more."
            />
            <NextStepCard
              href="/docs/writing-specs"
              icon="✍️"
              title="Writing a Spec"
              description="Learn how to write a SPEC.md that the factory can parse precisely — including data models, routes, and page behaviours."
            />
            <NextStepCard
              href="/docs/cli"
              icon="⌨️"
              title="CLI Reference"
              description="Full reference for every clawfactory command: options, flags, and examples for approve, verify, status, health, and more."
            />
            <NextStepCard
              href="/docs/templates"
              icon="🏗️"
              title="Templates"
              description="Explore the available project templates and learn how to choose the right scaffold for your app."
            />
          </div>
        </section>

        {/* ── Page navigation ─────────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-end text-sm">
          <Link
            href="/docs/concepts"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span>Core Concepts</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* ── On-page TOC (xl+ right column) ──────────────────────────── */}
      <GettingStartedToc />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   What's Next card
   ───────────────────────────────────────────────────────────────────────── */
function NextStepCard({ href, icon, title, description }) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 hover:bg-slate-900/80 transition-all"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl" aria-hidden="true">{icon}</span>
        <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
          {title}
        </span>
        <span
          className="ml-auto text-slate-600 group-hover:text-indigo-400 transition-colors text-xs"
          aria-hidden="true"
        >
          →
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </Link>
  );
}
