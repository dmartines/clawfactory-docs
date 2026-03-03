/**
 * spec-sections.js — structured content for the /docs/writing-specs page.
 *
 * Centralises all copy and code examples so the page component stays clean.
 */

/** The required/recommended top-level sections of a SPEC.md. */
export const SPEC_SECTIONS = [
  {
    id: "what-this-app-is",
    icon: "📄",
    label: "1. What This App Is",
    required: true,
    tagline: "One paragraph. Sets the scope for every agent that reads it.",
    description:
      "The opening section is a plain-prose description of what the app does, who it is for, the stack, and the date. Keep it to one paragraph. The spec compiler uses it to resolve ambiguities in later sections — if a data model column name is vague, the compiler looks here first for context.",
    fields: [
      { name: "Description", note: "One paragraph. What does the app do? Who uses it?" },
      { name: "Stack",       note: "e.g. Next.js 15, TailwindCSS, Supabase, Stripe" },
      { name: "Date",        note: "When the spec was written. Anchors versioning." },
      { name: "Template",    note: "Which ClawFactory template to scaffold from." },
    ],
    example: {
      language: "markdown",
      label: "SPEC.md — Section 1",
      code: `## 1. What This App Is

A task management SaaS for small engineering teams.
Users can create projects, add tasks, assign them to teammates,
and track progress with a Kanban board.

**Stack:** Next.js 15, TailwindCSS 4, Supabase (auth + DB), Stripe
**Template:** nextjs-supabase-stripe
**Date:** March 2026`,
    },
  },
  {
    id: "data-model",
    icon: "🗄️",
    label: "2. Data Model",
    required: true,
    tagline: "Tables, columns, types, and relationships — the compiler's primary input.",
    description:
      "The data model section is where the spec compiler spends the most time. It extracts every table, column name, type, constraint, and relationship and generates two artefacts: a SQL migration file and a set of Zod contracts. Be precise — column names become TypeScript keys, types become Zod validators, and a vague 'status field' will produce a string column with no enum constraint.",
    fields: [
      { name: "Table name",   note: "Singular or plural — pick one convention and stick to it." },
      { name: "Column name",  note: "snake_case. Becomes a TypeScript key." },
      { name: "Type",         note: "uuid, text, integer, boolean, timestamp, jsonb, etc." },
      { name: "Constraints",  note: "primary key, unique, not null, default, foreign key." },
      { name: "Relationships",note: "Reference the related table and column explicitly." },
    ],
    example: {
      language: "markdown",
      label: "SPEC.md — Section 2",
      code: `## 2. Data Model

### projects
| column       | type      | constraints              |
|--------------|-----------|--------------------------|
| id           | uuid      | primary key, default uuid_generate_v4() |
| name         | text      | not null                 |
| slug         | text      | unique, not null         |
| owner_id     | uuid      | references users(id)     |
| created_at   | timestamp | default now()            |

### tasks
| column       | type      | constraints              |
|--------------|-----------|--------------------------|
| id           | uuid      | primary key, default uuid_generate_v4() |
| project_id   | uuid      | references projects(id) on delete cascade |
| title        | text      | not null                 |
| status       | text      | check (status in ('todo','in_progress','done')) |
| assignee_id  | uuid      | references users(id), nullable |
| due_date     | date      | nullable                 |
| created_at   | timestamp | default now()            |`,
    },
  },
  {
    id: "api-routes",
    icon: "🔌",
    label: "3. API Routes",
    required: true,
    tagline: "Name every route. The compiler generates contracts and Issues from them.",
    description:
      "Each API route gets its own subsection with the HTTP method, path, request shape, and response shape. The spec compiler generates one GitHub Issue per route and a Zod contract for each request/response pair. Avoid describing routes generically ('a CRUD endpoint for tasks') — name each route individually so agents have an unambiguous target.",
    fields: [
      { name: "Method + Path",  note: "e.g. POST /api/projects. Always explicit." },
      { name: "Auth",           note: "Is this route protected? Which role?" },
      { name: "Request body",   note: "Field name, type, and whether it's required." },
      { name: "Response",       note: "Shape on success (2xx) and on error (4xx/5xx)." },
      { name: "Side effects",   note: "Any emails sent, webhooks fired, queues pushed." },
    ],
    example: {
      language: "markdown",
      label: "SPEC.md — Section 3",
      code: `## 3. API Routes

### POST /api/projects
Auth: required (any authenticated user)
Request:  { name: string, slug: string }
Response: { project: Project }
Errors:   409 if slug already taken, 422 if validation fails

### GET /api/projects/:slug/tasks
Auth: required (project member)
Response: { tasks: Task[] }

### PATCH /api/tasks/:id
Auth: required (project member)
Request:  { title?: string, status?: 'todo'|'in_progress'|'done', assignee_id?: string | null }
Response: { task: Task }
Errors:   404 if task not found, 403 if not a project member

### DELETE /api/tasks/:id
Auth: required (project owner only)
Response: 204 No Content
Errors:   403 if not owner, 404 if not found`,
    },
  },
  {
    id: "pages",
    icon: "🖥️",
    label: "4. Pages",
    required: true,
    tagline: "Describe behaviour, not appearance. One subsection per route.",
    description:
      "Describe what each page does, not how it looks. Agents will infer layout from the design section — what they need from this section is the URL, the purpose, the data it loads, and the actions a user can take. Listing user interactions explicitly prevents agents from omitting features or inventing ones you didn't ask for.",
    fields: [
      { name: "URL",          note: "The Next.js route path, e.g. /projects/[slug]/tasks" },
      { name: "Purpose",      note: "One sentence: what can a user do here?" },
      { name: "Data loaded",  note: "Which entities are fetched and from which route?" },
      { name: "Actions",      note: "Button clicks, form submissions, drag-and-drop, etc." },
      { name: "Empty states", note: "What is shown when there is no data?" },
      { name: "Error states", note: "What is shown if data loading fails?" },
    ],
    example: {
      language: "markdown",
      label: "SPEC.md — Section 4",
      code: `## 4. Pages

### /projects (Project List)
Displays all projects the authenticated user belongs to.
Data: GET /api/projects
Actions:
  - "New Project" button opens a modal with name + slug fields → calls POST /api/projects
  - Clicking a project card navigates to /projects/[slug]/tasks
Empty state: "You have no projects yet. Create one to get started."

### /projects/[slug]/tasks (Task Board)
Kanban board with three columns: Todo, In Progress, Done.
Data: GET /api/projects/:slug/tasks
Actions:
  - Drag a task card between columns → calls PATCH /api/tasks/:id with new status
  - Click "Add task" in a column → inline form → calls POST /api/tasks
  - Click task title → opens task detail drawer (no new route)
  - Click "..." on a task → delete option → calls DELETE /api/tasks/:id (owner only)
Empty state per column: "No tasks here."`,
    },
  },
  {
    id: "auth",
    icon: "🔐",
    label: "5. Auth",
    required: false,
    tagline: "Provider, session strategy, and every protected route.",
    description:
      "If your app has any authentication, describe it here. The compiler uses this section to know which routes to protect, what middleware to generate, and which Supabase auth provider to configure. Omitting the auth section when using the nextjs-supabase-stripe template will leave all routes unprotected — the compiler will warn, but it will not block.",
    fields: [
      { name: "Provider",          note: "Email/password, Magic Link, GitHub OAuth, Google OAuth, etc." },
      { name: "Session strategy",  note: "Cookie-based (Supabase default) or JWT." },
      { name: "Protected routes",  note: "Explicit list of paths that require authentication." },
      { name: "Role model",        note: "If your app has roles (admin, member, owner), list them." },
      { name: "Post-login redirect",note: "Where to send users after they log in." },
    ],
    example: {
      language: "markdown",
      label: "SPEC.md — Section 5",
      code: `## 5. Auth

Provider: Supabase Email/Password + Magic Link
Session: Cookie-based (Supabase default)
Post-login redirect: /projects

Protected routes (redirect to /login if unauthenticated):
  - /projects
  - /projects/[slug]/tasks
  - /api/projects (and all sub-routes)
  - /api/tasks (and all sub-routes)

Roles:
  - owner — the user who created the project; can delete tasks and manage members
  - member — invited users; can create/edit/move tasks, cannot delete the project`,
    },
  },
  {
    id: "integrations",
    icon: "🔗",
    label: "6. Integrations",
    required: false,
    tagline: "List every third-party service. Agents won't add ones you didn't mention.",
    description:
      "Third-party integrations — Stripe, Resend, Slack, S3, Posthog — must be listed explicitly. The compiler generates the relevant environment variable scaffolding and creates GitHub Issues for the integration work. If you don't list it, it won't be built. If you list it but don't describe when it's triggered, agents will ask for a negotiable decision before proceeding.",
    fields: [
      { name: "Service name",    note: "e.g. Stripe, Resend, Slack, AWS S3" },
      { name: "Purpose",         note: "What is it used for in this app?" },
      { name: "Trigger",         note: "When is it called? On what event?" },
      { name: "Required env var",note: "Name the env var(s) the agent needs to scaffold." },
    ],
    example: {
      language: "markdown",
      label: "SPEC.md — Section 6",
      code: `## 6. Integrations

### Stripe
Purpose: Subscription billing for the Pro plan
Trigger: User clicks "Upgrade to Pro" → creates Stripe Checkout session
Webhook: stripe-webhook route handles checkout.session.completed and customer.subscription.deleted
Env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRO_PRICE_ID

### Resend
Purpose: Transactional email (invite emails, task assignment notifications)
Trigger:
  - Project owner invites a new member → sends invite email
  - Task is assigned to a user → sends assignment notification email
Env vars: RESEND_API_KEY
From address: noreply@yourapp.com`,
    },
  },
  {
    id: "non-goals",
    icon: "🚫",
    label: "7. Non-Goals",
    required: false,
    tagline: "Explicitly out-of-scope. Prevents agents from building things you didn't ask for.",
    description:
      "The Non-Goals section is a safety net. Agents are optimistic — given an incomplete spec they will attempt to fill gaps with reasonable assumptions. A well-written Non-Goals section prevents those assumptions from becoming unwanted features. If you don't need search, say so. If you're not building a mobile app, say so. Every line here saves at least one negotiable decision during the build.",
    fields: [
      { name: "Feature exclusions", note: "Features the spec deliberately omits." },
      { name: "Scale exclusions",   note: "e.g. No multi-tenancy, no enterprise SSO." },
      { name: "Platform exclusions",note: "e.g. No mobile app, no CLI tool." },
    ],
    example: {
      language: "markdown",
      label: "SPEC.md — Section 7",
      code: `## 7. Non-Goals

- No real-time collaboration (no WebSockets, no presence indicators)
- No mobile app or React Native target
- No public API — all routes are internal to the Next.js app
- No full-text search (can be added in v2)
- No analytics or event tracking (can be added later)
- No admin dashboard for the platform operator
- No multi-language / i18n support`,
    },
  },
];

/** Tips for writing a good spec — shown in the Tips section. */
export const SPEC_TIPS = [
  {
    id: "tip-names",
    icon: "✏️",
    headline: "Name everything explicitly.",
    body: "Avoid phrases like 'a standard CRUD endpoint' or 'the usual auth flow'. The compiler has no concept of 'usual'. Every route, every column, every page must be named. If you name it, the compiler can generate it. If you don't, it will ask.",
  },
  {
    id: "tip-types",
    icon: "🔢",
    headline: "Be specific about types and constraints.",
    body: "A column typed as text is not the same as one typed as text with a check constraint enumerating four allowed values. If a field has a finite set of valid values, enumerate them. The Zod contract and the SQL migration will both be richer for it.",
  },
  {
    id: "tip-behaviour",
    icon: "🖱️",
    headline: "Describe page behaviour, not visual design.",
    body: "Write 'clicking the Delete button calls DELETE /api/tasks/:id and removes the card from the board', not 'the Delete button is red and positioned in the top-right corner'. Visual design comes from the design section. The pages section is about what happens — data loaded, actions possible, states handled.",
  },
  {
    id: "tip-errors",
    icon: "⚠️",
    headline: "Include error and empty states.",
    body: "Agents will implement the happy path thoroughly. They will often forget the empty state (no data yet) and the error state (fetch failed) unless you list them. One line per state is enough: 'Empty state: No tasks yet. Create one above.'",
  },
  {
    id: "tip-non-goals",
    icon: "✂️",
    headline: "Write a Non-Goals section.",
    body: "Every feature you explicitly exclude is a negotiable decision you'll never have to make. Without a Non-Goals section, agents filling gaps will propose additions that all require your approval. A thorough Non-Goals section keeps the build loop moving.",
  },
  {
    id: "tip-version",
    icon: "🗂️",
    headline: "Version the spec in Git.",
    body: "The spec is the source of truth. Commit it alongside the code it describes. When you change the spec, rerun clawfactory init to regenerate contracts, migrations, and issue delta. The factory diffs the old and new spec to produce only the new work items.",
  },
];

/** The generated artefacts table — shown in the 'How the compiler works' section. */
export const COMPILER_ARTEFACTS = [
  {
    source: "Data Model tables",
    artefact: "SQL migration",
    path: "supabase/migrations/",
    note: "One migration file per init run. Column types and constraints are translated directly.",
  },
  {
    source: "Data Model tables",
    artefact: "Zod contracts",
    path: "lib/contracts/",
    note: "One schema per table. Insert, Update, and Select variants are generated.",
  },
  {
    source: "API Routes",
    artefact: "GitHub Issues",
    path: "github.com/your-org/your-repo/issues",
    note: "One Issue per route. The Issue body includes the request/response contract.",
  },
  {
    source: "Pages",
    artefact: "GitHub Issues",
    path: "github.com/your-org/your-repo/issues",
    note: "One Issue per page. The Issue body lists all actions and data dependencies.",
  },
  {
    source: "Auth section",
    artefact: "Middleware + env scaffold",
    path: "src/middleware.js, .env.example",
    note: "Supabase auth middleware generated; protected routes configured automatically.",
  },
  {
    source: "Integrations",
    artefact: "Env var scaffold + GitHub Issues",
    path: ".env.example, GitHub Issues",
    note: "Each integration creates a dedicated Issue and adds its env vars to .env.example.",
  },
];
