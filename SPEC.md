# SPEC.md — ClawFactory Documentation Site

## A documentation site and landing page for ClawFactory

**Date:** March 2026
**Template:** nextjs-tailwind

---

## 1. What This App Is

A public-facing documentation site for ClawFactory — the spec-driven software factory. The site has a marketing landing page and a getting-started guide that walks users through installation, setup, and their first build. The tone is technical but approachable. The audience is developers who want to use ClawFactory to build apps from specs.

Stack: Next.js 15, TailwindCSS 4, deployed to Vercel.

---

## 2. Pages

### 2.1 Landing Page (`/`)

Hero section with:
- Headline: "Build apps from specs, not from scratch"
- Subheadline: "ClawFactory is a spec-driven software factory. Write a markdown spec, and AI agents build the full-stack app — code, tests, deployment, and all."
- Primary CTA button: "Get Started" → links to `/docs/getting-started`
- Secondary CTA: "View on GitHub" → links to `https://github.com/Moltology/factory`

Features section (3-column grid on desktop, stacked on mobile):
1. **Spec-Driven** — "Write a markdown spec. The factory parses it into contracts, migrations, and GitHub Issues automatically."
2. **Parallel Agents** — "Independent tasks run concurrently with scoped file access. No conflicts, no coordination overhead."
3. **Holdout Verification** — "Quality is verified by tests the agents cannot see. You approve outcomes, not code."

How It Works section (4-step flow):
1. Write your SPEC.md
2. Run `clawfactory init`
3. Run `clawfactory build`
4. Ship it with `clawfactory deploy`

Footer with links to GitHub, docs sections, and "Built with ClawFactory" badge.

### 2.2 Docs Layout (`/docs/*`)

All docs pages share a layout with:
- Left sidebar navigation listing all doc pages
- Main content area with prose styling
- Mobile: sidebar collapses into a hamburger menu

### 2.3 Getting Started (`/docs/getting-started`)

Step-by-step guide:

**Prerequisites:** Node.js 22+, Docker, Git, GitHub token, Anthropic API key.

**Install:**
```
npm install -g clawfactory
```

**Setup:**
```
clawfactory setup
```
Explain what the wizard configures (API keys, GitHub token, Docker verification).

**Create your first project:**
```
clawfactory init my-app --spec ./spec.md --template nextjs-tailwind
```
Explain what happens: preflight checks, spec parsing, scaffolding, issue generation.

**Build:**
```
clawfactory build
```
Explain the build loop: iteration planning, agent spawning, verification.

**Deploy:**
```
clawfactory deploy
clawfactory ship
```

### 2.4 Core Concepts (`/docs/concepts`)

Explain the key ideas (one section each, with short descriptions):
- **Spec-Driven Development** — The spec is the single source of truth. Everything flows from it.
- **Three-Tier Permissions** — Immutable, negotiable, and autonomous operations.
- **Context Optimizer** — Every token sent to the LLM earns its place.
- **Model Router** — Light/medium/heavy tier routing based on task complexity.
- **Spawn System** — Parallel agents with scoped file access.
- **Receipts** — Structured proof of work for every execution cycle.
- **GitHub Issues as Tasks** — Issues are the task management system. TASKS.md is a read-only cache.

### 2.5 CLI Reference (`/docs/cli`)

Table of all commands with description and usage:

| Command | Description |
|---------|-------------|
| `clawfactory setup` | First-time interactive wizard |
| `clawfactory init <name>` | Initialize project from spec |
| `clawfactory build` | Start/resume build loop |
| `clawfactory status` | Progress and health |
| `clawfactory issues` | GitHub Issues summary |
| `clawfactory approve <id>` | Approve negotiable decision |
| `clawfactory verify` | Run holdout scenarios |
| `clawfactory deploy` | Deploy to preview |
| `clawfactory ship` | Deploy to production |
| `clawfactory health` | System health report |
| `clawfactory audit` | Security audit |
| `clawfactory server` | Start API + web dashboard |

Each command should show usage, options, and a short example.

### 2.6 Writing a Spec (`/docs/writing-specs`)

Guide on how to write a SPEC.md that the factory can parse:
- What sections to include (data model, API routes, pages, auth, integrations)
- How the spec compiler extracts contracts and migrations
- How GitHub Issues are auto-generated from the spec
- Example snippets of a well-structured spec
- Tips: be specific about data models, name your routes, describe page behavior

### 2.7 Templates (`/docs/templates`)

Explain the template system:
- What templates are (scaffold starting points)
- Available templates: `nextjs-tailwind`, `nextjs-supabase-stripe`
- How to choose a template
- Template anatomy: `template.json`, `files/`, `hooks/`

---

## 3. Design

### 3.1 Visual Style

- Clean, minimal, developer-focused
- Dark mode by default with light mode toggle
- Monospace font for code blocks and the hero headline
- Sans-serif (Inter or system font) for body text
- Accent color: indigo-500 (`#6366f1`)
- Background: slate-950 (dark) / white (light)

### 3.2 Responsive

- Mobile-first
- Sidebar collapses on screens < 768px
- Feature grid: 3 columns on desktop, 1 on mobile
- Code blocks scroll horizontally on small screens

### 3.3 Components

- `Header` — Logo + nav links (Docs, GitHub) + dark mode toggle
- `Footer` — Links + "Built with ClawFactory"
- `Sidebar` — Docs navigation with active page highlight
- `CodeBlock` — Syntax-highlighted code with copy button
- `FeatureCard` — Icon + title + description
- `StepCard` — Numbered step with title + description
- `CommandTable` — Styled table for CLI reference

---

## 4. Data Model

No database. All content is static — rendered at build time by Next.js. No API routes needed.

---

## 5. Non-Goals

- No authentication
- No user accounts
- No CMS or dynamic content
- No search (can add later)
- No analytics (can add later)
- No blog
