import { StepCardListSchema } from "../contracts/step-card.js";

/**
 * Raw "How It Works" step data sourced from SPEC.md § 2.1 — How It Works section.
 *
 * These four steps describe the ClawFactory workflow on the landing page.
 */
const rawSteps = [
  {
    step: 1,
    title: "Write your SPEC.md",
    description:
      "Describe your app in plain markdown. Be specific about data models, API routes, and page behaviour — the more detail you provide, the better the factory performs.",
  },
  {
    step: 2,
    title: "Run clawfactory init",
    description:
      "The spec compiler parses your SPEC.md, generates Zod contracts, database migrations, and GitHub Issues — one per task — in seconds.",
  },
  {
    step: 3,
    title: "Run clawfactory build",
    description:
      "Parallel AI agents claim issues, write code, and run holdout tests. Each cycle produces a structured receipt. You watch progress, not pull requests.",
  },
  {
    step: 4,
    title: "Ship with clawfactory deploy",
    description:
      "Preview your app with `clawfactory deploy`, then promote to production with `clawfactory ship`. No CI config required.",
  },
];

/**
 * Parsed + validated step cards for the "How It Works" section.
 * Throws at module load time if data is malformed — surfaces bugs early.
 *
 * @type {import("../contracts/step-card.js").StepCard[]}
 */
export const steps = StepCardListSchema.parse(rawSteps);
