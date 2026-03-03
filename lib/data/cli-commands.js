import { CliCommandListSchema } from "../contracts/cli-command.js";

/**
 * Raw CLI command data sourced from SPEC.md § 2.5.
 *
 * Each entry follows CliCommandSchema exactly:
 *   - command     full string as typed in a terminal
 *   - anchor      kebab-case id for deep-linking
 *   - name        short display name
 *   - description one-sentence summary
 *   - usage       full usage signature
 *   - options     array of { flag, description, default? }
 *   - example     plain-string copy-pasteable example
 *   - exampleLang language hint for the syntax highlighter (default "bash")
 *   - notes       bullet-point callouts
 *   - badge       { label, color }
 */
const rawCliCommands = [
  // ── setup ──────────────────────────────────────────────────────────────────
  {
    command: "clawfactory setup",
    anchor: "setup",
    name: "setup",
    description:
      "First-time interactive wizard that configures API keys, GitHub token, and verifies Docker.",
    usage: "clawfactory setup [--non-interactive] [--reset]",
    options: [
      {
        flag: "--non-interactive",
        description:
          "Read all values from environment variables instead of prompting. Useful for CI.",
        default: "false",
      },
      {
        flag: "--reset",
        description:
          "Overwrite an existing configuration file and re-run the full wizard.",
        default: "false",
      },
    ],
    example: `# First-time setup — follow the interactive prompts
clawfactory setup

# CI / scripted setup — all values sourced from env vars
ANTHROPIC_API_KEY=sk-... GITHUB_TOKEN=ghp_... \\
  clawfactory setup --non-interactive`,
    exampleLang: "bash",
    notes: [
      "Creates ~/.clawfactory/config.json on success.",
      "Checks that Docker is running and pulls the agent image if missing.",
      "Validates the GitHub token scope (needs repo + write:packages).",
    ],
    badge: { label: "one-time", color: "emerald" },
  },

  // ── init ───────────────────────────────────────────────────────────────────
  {
    command: "clawfactory init <name>",
    anchor: "init",
    name: "init",
    description:
      "Initialise a new project from a SPEC.md file: runs preflight checks, scaffolds the repository, and opens GitHub Issues for every task.",
    usage:
      "clawfactory init <name> [--spec <path>] [--template <id>] [--dir <path>] [--dry-run]",
    options: [
      {
        flag: "<name>",
        description:
          "Project name. Used as the GitHub repo name and the root directory.",
      },
      {
        flag: "--spec <path>",
        description: "Path to the SPEC.md to use.",
        default: "./SPEC.md",
      },
      {
        flag: "--template <id>",
        description: "Scaffold template to apply.",
        default: "nextjs-tailwind",
      },
      {
        flag: "--dir <path>",
        description: "Local directory to initialise into.",
        default: "./<name>",
      },
      {
        flag: "--dry-run",
        description:
          "Validate and parse the spec without writing files or creating issues.",
        default: "false",
      },
    ],
    example: `# Basic initialisation
clawfactory init my-saas --spec ./my-spec.md

# Use a different template
clawfactory init my-saas \\
  --spec ./SPEC.md \\
  --template nextjs-supabase-stripe

# Validate the spec without side-effects
clawfactory init my-saas --spec ./SPEC.md --dry-run`,
    exampleLang: "bash",
    notes: [
      "Spec is parsed into GitHub Issues automatically; each issue maps to one agent task.",
      "A TASKS.md read-only cache is created in the project root.",
      "The init command is idempotent — re-running it against an existing repo is safe.",
    ],
    badge: { label: "project setup", color: "blue" },
  },

  // ── build ──────────────────────────────────────────────────────────────────
  {
    command: "clawfactory build",
    anchor: "build",
    name: "build",
    description:
      "Start or resume the autonomous build loop: agents pick open issues, implement them in parallel, then self-verify against the holdout test suite.",
    usage:
      "clawfactory build [--max-agents <n>] [--max-iterations <n>] [--watch] [--no-verify]",
    options: [
      {
        flag: "--max-agents <n>",
        description:
          "Maximum number of agent containers to run in parallel.",
        default: "4",
      },
      {
        flag: "--max-iterations <n>",
        description:
          "Stop after this many build iterations. Omit to run until all issues are closed.",
      },
      {
        flag: "--watch",
        description: "Stream build logs to stdout in real-time.",
        default: "false",
      },
      {
        flag: "--no-verify",
        description:
          "Skip the holdout verification step after each iteration. Not recommended for production.",
        default: "false",
      },
    ],
    example: `# Start the build loop with defaults
clawfactory build

# Cap parallelism and stream logs
clawfactory build --max-agents 2 --watch

# Run exactly two iterations then stop
clawfactory build --max-iterations 2`,
    exampleLang: "bash",
    notes: [
      "Resumes automatically from the last completed iteration if the loop was interrupted.",
      "Negotiable decisions block the loop until approved via clawfactory approve.",
      "Every iteration produces a signed receipt stored in .factory/receipts/.",
    ],
    badge: { label: "core", color: "indigo" },
  },

  // ── status ─────────────────────────────────────────────────────────────────
  {
    command: "clawfactory status",
    anchor: "status",
    name: "status",
    description:
      "Print a live progress summary: open issues, running agents, last receipt, and overall health.",
    usage: "clawfactory status [--json] [--watch]",
    options: [
      {
        flag: "--json",
        description:
          "Output machine-readable JSON instead of the formatted table.",
        default: "false",
      },
      {
        flag: "--watch",
        description: "Refresh the status display every 5 seconds.",
        default: "false",
      },
    ],
    example: `# Human-readable status
clawfactory status

# Watch mode — auto-refreshes
clawfactory status --watch

# Pipe into jq for scripting
clawfactory status --json | jq '.issues.open'`,
    exampleLang: "bash",
    notes: ["Exit code 0 = healthy, 1 = degraded, 2 = failed."],
    badge: { label: "observability", color: "slate" },
  },

  // ── issues ─────────────────────────────────────────────────────────────────
  {
    command: "clawfactory issues",
    anchor: "issues",
    name: "issues",
    description:
      "Display a summary of GitHub Issues grouped by status: open, in-progress, blocked, and closed.",
    usage: "clawfactory issues [--filter <state>] [--json]",
    options: [
      {
        flag: "--filter <state>",
        description:
          "Filter by issue state: open | in-progress | blocked | closed | all.",
        default: "all",
      },
      {
        flag: "--json",
        description: "Output raw JSON for scripting.",
        default: "false",
      },
    ],
    example: `# Show all issues
clawfactory issues

# Show only blocked issues
clawfactory issues --filter blocked

# Export to JSON and filter with jq
clawfactory issues --json | jq '[.[] | select(.state=="open")]'`,
    exampleLang: "bash",
    notes: [
      "Issue data is fetched live from the GitHub API on every invocation.",
      "TASKS.md provides a cached offline view.",
    ],
    badge: { label: "observability", color: "slate" },
  },

  // ── approve ────────────────────────────────────────────────────────────────
  {
    command: "clawfactory approve <id>",
    anchor: "approve",
    name: "approve",
    description:
      "Approve a pending negotiable decision, unblocking the build loop.",
    usage: "clawfactory approve <id> [--reject] [--comment <text>]",
    options: [
      {
        flag: "<id>",
        description:
          "The numeric decision ID (shown in clawfactory status output).",
      },
      {
        flag: "--reject",
        description:
          "Reject the decision instead of approving it. Agents will re-plan.",
        default: "false",
      },
      {
        flag: "--comment <text>",
        description: "Optional note attached to the approval or rejection.",
      },
    ],
    example: `# Approve decision #42
clawfactory approve 42

# Reject with a note
clawfactory approve 42 --reject --comment "Use Zod instead of Yup"`,
    exampleLang: "bash",
    notes: [
      "Negotiable operations include: schema changes, dependency additions, and external service integrations.",
      "Approvals are recorded in .factory/decisions/ for auditing.",
    ],
    badge: { label: "governance", color: "amber" },
  },

  // ── verify ─────────────────────────────────────────────────────────────────
  {
    command: "clawfactory verify",
    anchor: "verify",
    name: "verify",
    description:
      "Run the holdout test scenarios against the current build to measure quality before deploying.",
    usage:
      "clawfactory verify [--suite <path>] [--fail-fast] [--json]",
    options: [
      {
        flag: "--suite <path>",
        description: "Path to a custom holdout test suite directory.",
        default: ".factory/holdout/",
      },
      {
        flag: "--fail-fast",
        description: "Stop on the first failing scenario.",
        default: "false",
      },
      {
        flag: "--json",
        description: "Write results to stdout as JSON.",
        default: "false",
      },
    ],
    example: `# Run the default holdout suite
clawfactory verify

# Stop on first failure
clawfactory verify --fail-fast

# Save results to a file
clawfactory verify --json > verify-results.json`,
    exampleLang: "bash",
    notes: [
      "Agents cannot read holdout scenarios — the suite tests outcomes, not implementation.",
      "Exit code 0 = all scenarios pass, 1 = one or more failed.",
    ],
    badge: { label: "quality", color: "purple" },
  },

  // ── deploy ─────────────────────────────────────────────────────────────────
  {
    command: "clawfactory deploy",
    anchor: "deploy",
    name: "deploy",
    description:
      "Deploy the current build to a preview environment for review.",
    usage:
      "clawfactory deploy [--env <name>] [--skip-verify] [--no-wait]",
    options: [
      {
        flag: "--env <name>",
        description: "Target preview environment name.",
        default: "preview",
      },
      {
        flag: "--skip-verify",
        description: "Deploy without running holdout verification first.",
        default: "false",
      },
      {
        flag: "--no-wait",
        description:
          "Return immediately after triggering the deployment instead of polling for completion.",
        default: "false",
      },
    ],
    example: `# Deploy to the default preview environment
clawfactory deploy

# Deploy to a named environment
clawfactory deploy --env staging

# Fast path — no polling
clawfactory deploy --no-wait`,
    exampleLang: "bash",
    notes: [
      "Runs clawfactory verify automatically unless --skip-verify is passed.",
      "Outputs a preview URL on success.",
    ],
    badge: { label: "deployment", color: "cyan" },
  },

  // ── ship ───────────────────────────────────────────────────────────────────
  {
    command: "clawfactory ship",
    anchor: "ship",
    name: "ship",
    description:
      "Promote the current verified build to the production environment.",
    usage:
      "clawfactory ship [--confirm] [--skip-verify] [--rollback]",
    options: [
      {
        flag: "--confirm",
        description:
          "Skip the interactive yes/no prompt. Required in non-interactive environments.",
        default: "false",
      },
      {
        flag: "--skip-verify",
        description:
          "Deploy to production without re-running holdout verification.",
        default: "false",
      },
      {
        flag: "--rollback",
        description: "Roll back to the previous production deployment.",
        default: "false",
      },
    ],
    example: `# Ship to production (prompts for confirmation)
clawfactory ship

# CI pipeline — skip prompt
clawfactory ship --confirm

# Emergency rollback
clawfactory ship --rollback`,
    exampleLang: "bash",
    notes: [
      "Requires a successful clawfactory verify in the same build iteration.",
      "A production receipt is stored in .factory/receipts/production/.",
    ],
    badge: { label: "deployment", color: "cyan" },
  },

  // ── health ─────────────────────────────────────────────────────────────────
  {
    command: "clawfactory health",
    anchor: "health",
    name: "health",
    description:
      "Print a system health report: Docker status, API key validity, GitHub connectivity, and disk space.",
    usage: "clawfactory health [--json]",
    options: [
      {
        flag: "--json",
        description: "Output machine-readable JSON.",
        default: "false",
      },
    ],
    example: `# Human-readable health report
clawfactory health

# JSON for monitoring integrations
clawfactory health --json`,
    exampleLang: "bash",
    notes: [
      "Useful as a liveness check in CI/CD pipelines.",
      "Exit code 0 = healthy, 1 = degraded (warnings), 2 = unhealthy (errors).",
    ],
    badge: { label: "observability", color: "slate" },
  },

  // ── audit ──────────────────────────────────────────────────────────────────
  {
    command: "clawfactory audit",
    anchor: "audit",
    name: "audit",
    description:
      "Run a security audit of the codebase: dependency vulnerabilities, secret scanning, and OWASP checks.",
    usage:
      "clawfactory audit [--fix] [--json] [--severity <level>]",
    options: [
      {
        flag: "--fix",
        description:
          "Automatically apply safe fixes for known vulnerabilities.",
        default: "false",
      },
      {
        flag: "--severity <level>",
        description:
          "Minimum severity to report: info | low | moderate | high | critical.",
        default: "moderate",
      },
      {
        flag: "--json",
        description: "Output results as JSON.",
        default: "false",
      },
    ],
    example: `# Run full audit at default severity threshold
clawfactory audit

# Auto-fix and report only high/critical findings
clawfactory audit --fix --severity high

# Export for a security dashboard
clawfactory audit --json > audit-report.json`,
    exampleLang: "bash",
    notes: [
      "Scans package.json dependencies via npm audit and Snyk (if token configured).",
      "Checks for accidentally committed secrets using a regex rule set.",
    ],
    badge: { label: "security", color: "rose" },
  },

  // ── server ─────────────────────────────────────────────────────────────────
  {
    command: "clawfactory server",
    anchor: "server",
    name: "server",
    description:
      "Start the local ClawFactory API server and web dashboard for monitoring and managing builds.",
    usage:
      "clawfactory server [--port <n>] [--host <addr>] [--open] [--no-auth]",
    options: [
      {
        flag: "--port <n>",
        description: "Port to listen on.",
        default: "4000",
      },
      {
        flag: "--host <addr>",
        description: "Hostname or IP address to bind to.",
        default: "localhost",
      },
      {
        flag: "--open",
        description:
          "Automatically open the dashboard in your default browser.",
        default: "false",
      },
      {
        flag: "--no-auth",
        description:
          "Disable token authentication for the API (local dev only).",
        default: "false",
      },
    ],
    example: `# Start with defaults and open the dashboard
clawfactory server --open

# Bind to all interfaces on port 8080
clawfactory server --host 0.0.0.0 --port 8080`,
    exampleLang: "bash",
    notes: [
      "Dashboard URL: http://localhost:4000 (by default).",
      "REST API is available at http://localhost:4000/api/v1.",
      "WebSocket stream at ws://localhost:4000/stream provides real-time build events.",
    ],
    badge: { label: "tooling", color: "teal" },
  },
];

/**
 * Parsed + validated CLI command entries.
 * Throws at module load time if data is malformed — surfaces bugs early.
 *
 * @type {import("../contracts/cli-command.js").CliCommand[]}
 */
export const cliCommands = CliCommandListSchema.parse(rawCliCommands);
