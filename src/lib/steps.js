/**
 * src/lib/steps.js
 *
 * Re-exports step card data from the authoritative data layer
 * (`lib/data/steps.js`) for consumption by page and component layers.
 *
 * The data is parsed and validated by Zod at module load time — if any
 * step entry is malformed the process will throw immediately, surfacing
 * bugs before they reach the browser.
 *
 * Every entry conforms to StepCardSchema:
 *
 *   step        {number}  – 1-based sequential position (positive integer)
 *   title       {string}  – short label for the step (non-empty)
 *   description {string}  – longer explanation of what the step does (non-empty)
 *
 * @module src/lib/steps
 */

import { steps } from "../../lib/data/steps.js";

/**
 * STEPS — validated "How It Works" step cards for the landing page.
 *
 * Ordered by `step` number (1 → 4). Components may render them in sequence
 * using `STEPS.map(…)`.
 *
 * @type {import("../../lib/contracts/step-card.js").StepCard[]}
 */
export { steps as STEPS };
