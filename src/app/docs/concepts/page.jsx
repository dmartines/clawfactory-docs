import ConceptCard from "@/components/concept-card.js";
import ConceptsToc from "@/components/concepts-toc.js";
import InlineCode from "@/components/inline-code.js";
import TierBadge from "@/components/tier-badge.js";

export const metadata = {
  title: "Core Concepts — ClawFactory Docs",
  description:
    "The seven ideas that power ClawFactory: spec-driven development, three-tier permissions, context optimizer, model router, spawn system, receipts, and GitHub Issues as tasks.",
};

export default function ConceptsPage() {
  return (
    <div className="flex gap-12 items-start">
      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-3">
            <span>docs</span>
            <span>/</span>
            <span className="text-indigo-400">concepts</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-3">
            Core Concepts
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
            ClawFactory is built on seven interlocking ideas. Understanding them
            gives you a mental model for why the factory behaves the way it
            does — and how to get the most out of it.
          </p>
        </div>

        {/* ── Concept cards ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* 1 ─ Spec-Driven Development */}
          <ConceptCard
            id="spec-driven"
            icon="📄"
            title="Spec-Driven Development"
            tagline="The spec is the single source of truth"
          >
            <p>
              Everything in ClawFactory flows from{" "}
              <InlineCode>SPEC.md</InlineCode>. The spec is not documentation
              written after the fact — it is the authoritative contract from
              which all other artifacts are derived. Data models, API routes,
              page behaviours, GitHub Issues, database migrations, and agent
              task plans are all extracted or generated directly from it.
            </p>
            <p>
              This inverts the traditional workflow. Instead of writing code
              first and documenting later, you write the spec first and let the
              factory produce everything else. Changing the spec changes the
              system — nothing drifts out of sync because there is only one
              place to edit.
            </p>
            <p>
              The spec compiler parses your markdown into structured contracts
              (Zod schemas), SQL migrations, and a task graph that maps onto
              GitHub Issues. If a section is ambiguous, the compiler flags it
              before any agent touches code.
            </p>
            <KeyPoints
              points={[
                "Write SPEC.md first. Everything else is generated.",
                "Editing the spec triggers recompilation of contracts and migrations.",
                "Ambiguous sections surface as compiler warnings, not runtime bugs.",
                "The spec is versioned in Git alongside the code it describes.",
              ]}
            />
          </ConceptCard>

          {/* 2 ─ Three-Tier Permissions */}
          <ConceptCard
            id="three-tier-permissions"
            icon="🔐"
            title="Three-Tier Permissions"
            tagline="Immutable, negotiable, and autonomous operations"
          >
            <p>
              Every action an agent can take is classified into one of three
              permission tiers. The tier determines whether the action requires
              human approval, can be surfaced for negotiation, or runs fully
              autonomously. This keeps humans in control of consequential
              decisions while letting the factory move fast on safe ones.
            </p>

            <div className="mt-4 space-y-3">
              <PermissionTier
                badge={<TierBadge label="IMMUTABLE" variant="red" />}
                description="Actions that are permanently locked. These operations are never performed by agents regardless of instructions — deleting production databases, exposing secret keys, disabling security controls. No prompt, no override, no exception."
              />
              <PermissionTier
                badge={<TierBadge label="NEGOTIABLE" variant="yellow" />}
                description={
                  <>
                    Actions that require explicit human approval before
                    execution. When an agent reaches a negotiable decision — a
                    schema change that breaks existing data, a third-party
                    service integration, a pricing decision — it pauses and
                    emits a structured proposal. You review it with{" "}
                    <InlineCode>clawfactory approve &lt;id&gt;</InlineCode> or
                    reject it with a reason. The agent incorporates your
                    decision and continues.
                  </>
                }
              />
              <PermissionTier
                badge={<TierBadge label="AUTONOMOUS" variant="green" />}
                description="Actions the agent performs freely within its scoped file access. Routine coding tasks — adding a component, writing a migration, implementing an API route — all happen autonomously. The boundary is defined by the spawn scope, not by asking permission at every step."
              />
            </div>
          </ConceptCard>

          {/* 3 ─ Context Optimizer */}
          <ConceptCard
            id="context-optimizer"
            icon="🎯"
            title="Context Optimizer"
            tagline="Every token sent to the LLM earns its place"
          >
            <p>
              LLMs have finite context windows. Naively dumping an entire
              codebase into the prompt wastes tokens, blurs focus, and inflates
              cost. The context optimizer is responsible for assembling the
              exact set of information each agent needs — no more, no less.
            </p>
            <p>
              Before spawning an agent, the optimizer runs a relevance pass over
              the current codebase and spec. It selects source files, schema
              fragments, prior receipts, and spec sections whose content is
              semantically related to the task at hand. Unrelated files are
              excluded entirely. Related files may be summarised rather than
              included verbatim if they are large.
            </p>
            <p>
              This has two effects: agents perform better because their context
              is tightly scoped to the problem, and API costs drop because the
              token budget is not diluted by noise. The optimizer is also
              tier-aware — heavy tasks get more context headroom than light
              ones.
            </p>
            <KeyPoints
              points={[
                "Context is assembled per-task, not per-project.",
                "Large files are summarised; only relevant sections are included verbatim.",
                "Prior receipts provide compressed history without replaying full output.",
                "Context budgets scale with model tier — light tasks get tight budgets.",
              ]}
            />
          </ConceptCard>

          {/* 4 ─ Model Router */}
          <ConceptCard
            id="model-router"
            icon="⚡"
            title="Model Router"
            tagline="Light, medium, and heavy routing based on task complexity"
          >
            <p>
              Not every task needs the most powerful model. Calling a frontier
              model to rename a variable or write a one-line utility function is
              wasteful. The model router classifies each task by complexity and
              routes it to the appropriate tier — trading cost and latency for
              quality where it matters, and conserving both where it does not.
            </p>

            <div className="mt-4 space-y-3">
              <ModelTier
                badge={<TierBadge label="LIGHT" variant="green" />}
                examples="Renaming, formatting, simple utilities, boilerplate"
                description="Fast, cheap models. Low latency, high throughput. Used for mechanical transformations where correctness is easy to verify."
              />
              <ModelTier
                badge={<TierBadge label="MEDIUM" variant="yellow" />}
                examples="Components, API routes, migration authoring"
                description="Balanced models. Good reasoning at moderate cost. The default tier for most agent tasks during a build loop."
              />
              <ModelTier
                badge={<TierBadge label="HEAVY" variant="red" />}
                examples="Spec compilation, architectural decisions, security audit"
                description="Frontier models with maximum context. Reserved for tasks where depth of reasoning directly determines correctness — used sparingly and intentionally."
              />
            </div>

            <p className="mt-3">
              The router's classification is based on a combination of task
              metadata from the GitHub Issue, token estimates, and historical
              receipt data. You can override the routing decision for any task
              via spec annotation or per-issue label.
            </p>
          </ConceptCard>

          {/* 5 ─ Spawn System */}
          <ConceptCard
            id="spawn-system"
            icon="🪄"
            title="Spawn System"
            tagline="Parallel agents with scoped file access"
          >
            <p>
              The spawn system is how ClawFactory runs multiple agents
              concurrently without them trampling each other's work. Each agent
              is spawned with an explicit file scope — a set of paths it is
              allowed to read and write. Attempts to access files outside the
              scope are rejected before they reach the filesystem.
            </p>
            <p>
              Scopes are derived from the task graph. If Issue #12 (implement
              the user profile API) and Issue #15 (build the avatar upload
              component) touch non-overlapping files, both run in parallel with
              zero coordination overhead. If two tasks share a file, they are
              serialised automatically by the dependency resolver.
            </p>
            <p>
              Each spawned agent gets its own sandboxed working directory. On
              completion, the spawn system merges the agent's output back into
              the main tree, runs conflict detection, and writes a receipt.
            </p>
            <KeyPoints
              points={[
                "Agents never share a mutable file scope — conflicts are impossible by construction.",
                "Parallelism is maximised by analysing the task dependency graph.",
                "File scope is enforced at the system level, not by agent instruction.",
                "Spawn results are merged and verified before integration.",
              ]}
            />
          </ConceptCard>

          {/* 6 ─ Receipts */}
          <ConceptCard
            id="receipts"
            icon="🧾"
            title="Receipts"
            tagline="Structured proof of work for every execution cycle"
          >
            <p>
              After every agent execution cycle, the factory writes a receipt.
              A receipt is a structured JSON record that captures what the agent
              was asked to do, what it actually did, which files changed, what
              tests ran, what passed or failed, and how many tokens were
              consumed.
            </p>
            <p>
              Receipts serve several purposes simultaneously. They are the
              compressed history that the context optimizer uses to brief future
              agents — instead of re-reading all changed files, an agent can
              read the receipt summary. They are the audit trail for human
              reviewers who want to understand what happened without reading
              every diff. And they are the input to the verification system that
              determines whether an iteration should be accepted or retried.
            </p>

            {/* Receipt example */}
            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/70 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-700">
                <span className="text-xs font-mono text-slate-500">
                  .factory/receipts/issue-42-cycle-3.json
                </span>
              </div>
              <pre className="px-4 py-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {`{
  "issue": 42,
  "cycle": 3,
  "task": "Implement POST /api/users endpoint",
  "model": "medium",
  "status": "passed",
  "filesChanged": [
    "src/app/api/users/route.js",
    "lib/contracts/user.js",
    "src/app/api/users/route.test.js"
  ],
  "testsRun": 8,
  "testsPassed": 8,
  "testsFailed": 0,
  "tokensUsed": 4821,
  "durationMs": 14200,
  "summary": "Added input validation via UserSchema, inserted row
via Supabase client, returns 201 with created user. All edge
cases covered."
}`}
              </pre>
            </div>

            <KeyPoints
              points={[
                "One receipt per agent cycle — immutable once written.",
                "Receipts are used as compressed context for subsequent agents.",
                "Failed receipts trigger automated retry with adjusted context.",
                "Receipts live in .factory/receipts/ and are committed to Git.",
              ]}
            />
          </ConceptCard>

          {/* 7 ─ GitHub Issues as Tasks */}
          <ConceptCard
            id="github-issues"
            icon="🐙"
            title="GitHub Issues as Tasks"
            tagline="Issues are the task system. TASKS.md is a read-only cache."
          >
            <p>
              ClawFactory uses GitHub Issues as its native task management
              system. Every unit of work — every component, route, migration,
              test suite — corresponds to a GitHub Issue. The factory creates
              these Issues automatically during{" "}
              <InlineCode>clawfactory init</InlineCode> by parsing the spec, and
              manages their lifecycle (open → in-progress → closed) as agents
              complete work.
            </p>
            <p>
              This is a deliberate architectural choice, not a convenience
              feature. GitHub Issues are persistent, versioned, linkable,
              commentable, and visible to your whole team without any additional
              tooling. When an agent makes a negotiable decision, it comments on
              the Issue. When verification fails, it comments with the failure
              reason. The Issue becomes the durable record of everything that
              happened around that unit of work.
            </p>
            <p>
              <InlineCode>TASKS.md</InlineCode> exists as a local read-only
              cache of the current issue state. It is regenerated from GitHub on
              every <InlineCode>clawfactory build</InlineCode> run and on{" "}
              <InlineCode>clawfactory status</InlineCode>. You should never edit
              it manually — your edits will be overwritten. If you want to
              change task priority or scope, edit the GitHub Issue directly.
            </p>
            <KeyPoints
              points={[
                "Issues are created from the spec during init — one Issue per task.",
                "Issue labels drive model routing, permission tier, and spawn scope.",
                "TASKS.md is a cache — always derived from GitHub, never the source.",
                "Agent decisions, failures, and approvals are recorded as Issue comments.",
              ]}
            />
          </ConceptCard>
        </div>

        {/* ── Page navigation ──────────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between text-sm">
          <a
            href="/docs/getting-started"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Getting Started</span>
          </a>
          <a
            href="/docs/cli"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <span>CLI Reference</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* ── On-page TOC (xl+ right column) ──────────────────────────── */}
      <ConceptsToc />
    </div>
  );
}

/* ─── Page-local sub-components ─────────────────────────────────────── */

function KeyPoints({ points }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {points.map((point, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-0.5 text-indigo-500 shrink-0" aria-hidden="true">
            ›
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function PermissionTier({ badge, description }) {
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-4">
      <div className="mb-2">{badge}</div>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ModelTier({ badge, examples, description }) {
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-4">
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        {badge}
        <span className="text-xs text-slate-500 font-mono">{examples}</span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
