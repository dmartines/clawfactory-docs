import { z } from "zod";

/**
 * CliCommandOptionSchema — a single flag/argument entry in a command's options
 * table.
 *
 * flag        – flag or argument name (e.g. "--spec <path>", "<name>")
 * description – one-sentence explanation shown in the options table
 * default     – optional default value string shown in the third column
 */
export const CliCommandOptionSchema = z.object({
  flag: z.string().min(1, "flag is required"),
  description: z.string().min(1, "description is required"),
  default: z.string().optional(),
});

/**
 * CliBadgeSchema — decorative pill rendered next to the command heading.
 *
 * label – short text shown inside the pill (e.g. "core", "one-time")
 * color – semantic color key mapped to Tailwind utility classes by the
 *         consuming component
 */
export const CliBadgeSchema = z.object({
  label: z.string().min(1),
  color: z.string().min(1),
});

/**
 * CliCommandSchema — the authoritative shape for a single CLI command entry.
 *
 * Required fields
 * ───────────────
 * command     – full command string as typed by the user, e.g.
 *               "clawfactory init <name>"
 * anchor      – kebab-case HTML id for deep-linking, e.g. "init"
 * name        – short display name used in headings, e.g. "init"
 * description – one-sentence summary (max 300 chars)
 *
 * Optional fields
 * ───────────────
 * usage       – full usage signature string
 * options     – array of flag/argument descriptors
 * example     – a copy-pasteable example invocation (plain string)
 * exampleLang – language hint for the syntax highlighter (default "bash")
 * notes       – bullet-point callouts shown after the example
 * badge       – decorative label displayed next to the heading
 */
export const CliCommandSchema = z.object({
  command: z
    .string()
    .min(1, "command is required")
    .startsWith("clawfactory ", "command must start with 'clawfactory '"),
  anchor: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "anchor must be kebab-case"),
  name: z.string().min(1),
  description: z.string().min(1).max(300),
  usage: z.string().optional(),
  options: z.array(CliCommandOptionSchema).optional(),
  example: z.string().optional(),
  exampleLang: z.string().optional(),
  notes: z.array(z.string().min(1)).optional(),
  badge: CliBadgeSchema.optional(),
});

/** @typedef {z.infer<typeof CliCommandSchema>} CliCommand */
/** @typedef {z.infer<typeof CliCommandOptionSchema>} CliCommandOption */
/** @typedef {z.infer<typeof CliBadgeSchema>} CliBadge */

/**
 * CliCommandListSchema — the full CLI commands list must be a non-empty array
 * of valid entries with unique anchors and unique command strings.
 */
export const CliCommandListSchema = z
  .array(CliCommandSchema)
  .min(1, "at least one command is required")
  .superRefine((commands, ctx) => {
    const anchors = commands.map((c) => c.anchor);
    const duplicateAnchors = anchors.filter(
      (a, i) => anchors.indexOf(a) !== i
    );
    if (duplicateAnchors.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate anchors found: ${[...new Set(duplicateAnchors)].join(", ")}`,
      });
    }

    const commandStrings = commands.map((c) => c.command);
    const duplicateCommands = commandStrings.filter(
      (c, i) => commandStrings.indexOf(c) !== i
    );
    if (duplicateCommands.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate command strings found: ${[...new Set(duplicateCommands)].join(", ")}`,
      });
    }
  });
