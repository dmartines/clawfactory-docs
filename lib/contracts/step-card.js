import { z } from "zod";

/**
 * Schema for a single numbered step.
 *
 * step   — 1-based position in the sequence (positive integer)
 * title  — short label for the step
 * description — longer explanation of what the step does
 */
export const StepCardSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
});

/** @typedef {z.infer<typeof StepCardSchema>} StepCard */

/** Array schema — the full steps list must be a non-empty array of valid step cards. */
export const StepCardListSchema = z
  .array(StepCardSchema)
  .min(1, "at least one step card is required");
