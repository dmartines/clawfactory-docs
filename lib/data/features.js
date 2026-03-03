import { FeatureCardListSchema } from "../contracts/feature-card.js";

/**
 * Raw feature data sourced from SPEC.md § 2.1 — Features section.
 *
 * Icon paths are 24×24 Heroicons (outline) `d` attributes:
 *   - spec-driven   → DocumentText
 *   - parallel-agents → Bolt
 *   - holdout-verification → ShieldCheck
 */
const rawFeatures = [
  {
    id: "spec-driven",
    icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z",
    title: "Spec-Driven",
    description:
      "Write a markdown spec. The factory parses it into contracts, migrations, and GitHub Issues automatically.",
  },
  {
    id: "parallel-agents",
    icon: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z",
    title: "Parallel Agents",
    description:
      "Independent tasks run concurrently with scoped file access. No conflicts, no coordination overhead.",
  },
  {
    id: "holdout-verification",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
    title: "Holdout Verification",
    description:
      "Quality is verified by tests the agents cannot see. You approve outcomes, not code.",
  },
];

/**
 * Parsed + validated feature cards.
 * Throws at module load time if data is malformed — surfaces bugs early.
 *
 * @type {import("../contracts/feature-card.js").FeatureCard[]}
 */
export const features = FeatureCardListSchema.parse(rawFeatures);
