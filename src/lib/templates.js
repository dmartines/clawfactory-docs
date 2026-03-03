/**
 * templates.js — structured content for the /docs/templates page.
 *
 * Centralises all template data so the page component stays lean and
 * every data-contract can be tested independently.
 *
 * Exports
 * ───────
 * TEMPLATES          — the two first-party scaffold templates
 * TEMPLATE_ANATOMY   — the three parts of every template directory
 * TEMPLATE_ENV_VARS  — per-template environment variable reference table
 * DECISION_MATRIX    — "I need… → Template" rows for the choosing section
 */

/**
 * @typedef {Object} Template
 * @property {string}   id          - kebab-case identifier, doubles as HTML anchor
 * @property {string}   name        - display name (matches the CLI --template flag value)
 * @property {string}   icon        - emoji used in the icon badge
 * @property {string[]} stack       - human-readable tech stack labels
 * @property {string}   description - paragraph describing what the template provides
 * @property {string}   when        - "Use when…" guidance sentence
 * @property {string|null} note     - optional ℹ callout text (null if none)
 */

/** The two first-party ClawFactory templates. */
export const TEMPLATES = [
  {
    id: "nextjs-tailwind",
    name: "nextjs-tailwind",
    icon: "⚡",
    stack: ["Next.js 15", "TailwindCSS 4"],
    description:
      "A clean, minimal full-stack starting point. Server components, App Router, and Tailwind 4 utility classes. No backend dependencies — bring your own data layer.",
    when:
      "You need a fast, server-rendered frontend and will add your own persistence layer (or the spec doesn't require a database).",
    note: null,
  },
  {
    id: "nextjs-supabase-stripe",
    name: "nextjs-supabase-stripe",
    icon: "🚀",
    stack: ["Next.js 15", "TailwindCSS 4", "Supabase", "Stripe"],
    description:
      "Full-stack SaaS boilerplate. Supabase handles auth and the Postgres database; Stripe handles subscription billing. Pre-wired with Row Level Security policies and webhook handlers.",
    when:
      "You're building a SaaS product that requires user accounts, role-based access, and paid subscriptions from day one.",
    note: "Requires SUPABASE_URL, SUPABASE_ANON_KEY, and STRIPE_SECRET_KEY env vars. The setup wizard will prompt for these.",
  },
];

/**
 * @typedef {Object} AnatomyItem
 * @property {string} path - File or directory path shown in the UI
 * @property {string} desc - Plain-prose description of its role
 */

/**
 * The three structural parts of every ClawFactory template directory.
 * Rendered as a key→description grid in the "Template Anatomy" section.
 */
export const TEMPLATE_ANATOMY = [
  {
    path: "template.json",
    desc: "Metadata: template name, stack identifiers, and the list of required environment variables. Read by the setup wizard during init.",
  },
  {
    path: "files/",
    desc: "Scaffold files copied verbatim (or with {{variable}} substitution) into the new project directory. The factory treats these as a starting point — agents will fill them in.",
  },
  {
    path: "hooks/",
    desc: "Optional lifecycle scripts. post-init.js runs after scaffolding is complete (e.g. to install dependencies or seed a database).",
  },
];

/**
 * @typedef {Object} EnvVarRow
 * @property {string} varName  - Environment variable name
 * @property {string} template - Which template(s) require it ("all" or a specific template name)
 * @property {string} purpose  - What the variable is used for
 */

/**
 * Environment variable reference table — one row per required variable.
 * "all" means both templates require it.
 */
export const TEMPLATE_ENV_VARS = [
  {
    varName: "ANTHROPIC_API_KEY",
    template: "all",
    purpose: "LLM agent calls",
  },
  {
    varName: "GITHUB_TOKEN",
    template: "all",
    purpose: "Issue creation & management",
  },
  {
    varName: "SUPABASE_URL",
    template: "nextjs-supabase-stripe",
    purpose: "Database + auth",
  },
  {
    varName: "SUPABASE_ANON_KEY",
    template: "nextjs-supabase-stripe",
    purpose: "Client-side queries",
  },
  {
    varName: "SUPABASE_SERVICE_ROLE_KEY",
    template: "nextjs-supabase-stripe",
    purpose: "Server-side admin operations",
  },
  {
    varName: "STRIPE_SECRET_KEY",
    template: "nextjs-supabase-stripe",
    purpose: "Subscription billing",
  },
  {
    varName: "STRIPE_WEBHOOK_SECRET",
    template: "nextjs-supabase-stripe",
    purpose: "Webhook signature verification",
  },
];

/**
 * @typedef {Object} DecisionRow
 * @property {string} need     - The user's stated requirement
 * @property {string} template - The recommended template id
 */

/**
 * Decision matrix rows for the "Choosing a Template" section.
 * Maps a specific use-case need to the appropriate template.
 */
export const DECISION_MATRIX = [
  {
    need: "A fast, server-rendered frontend",
    template: "nextjs-tailwind",
  },
  {
    need: "A docs or marketing site",
    template: "nextjs-tailwind",
  },
  {
    need: "A dashboard with my own DB",
    template: "nextjs-tailwind",
  },
  {
    need: "User sign-up / auth",
    template: "nextjs-supabase-stripe",
  },
  {
    need: "Role-based access control",
    template: "nextjs-supabase-stripe",
  },
  {
    need: "Subscription billing / Stripe",
    template: "nextjs-supabase-stripe",
  },
  {
    need: "Full SaaS from day one",
    template: "nextjs-supabase-stripe",
  },
];
