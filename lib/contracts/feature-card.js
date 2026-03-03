import { z } from "zod";

/**
 * FeatureCardSchema — validates a single feature card entry.
 *
 * Each card has:
 *   - id:          unique slug used as React key and for CSS/test targeting
 *   - icon:        SVG path `d` attribute string (24×24 viewBox, stroke-based)
 *   - title:       short feature name (max 60 chars)
 *   - description: one-sentence explanation (max 200 chars)
 */
export const FeatureCardSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  icon: z.string().min(1, "icon SVG path is required"),
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(200),
});

/** Inferred TypeScript-style type (JSDoc only). @typedef {z.infer<typeof FeatureCardSchema>} FeatureCard */

/** Array schema — the full features list must be a non-empty array of valid cards. */
export const FeatureCardListSchema = z
  .array(FeatureCardSchema)
  .min(1, "at least one feature card is required");
