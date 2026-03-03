import { describe, it, expect } from "vitest";
import {
  CliCommandSchema,
  CliCommandOptionSchema,
  CliBadgeSchema,
  CliCommandListSchema,
} from "./cli-command.js";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const validOption = {
  flag: "--spec <path>",
  description: "Path to the SPEC.md file.",
  default: "./SPEC.md",
};

const validBadge = { label: "core", color: "indigo" };

const validCommand = {
  command: "clawfactory setup",
  anchor: "setup",
  name: "setup",
  description: "First-time interactive wizard.",
};

const fullCommand = {
  ...validCommand,
  usage: "clawfactory setup [--non-interactive]",
  options: [validOption],
  example: "clawfactory setup --non-interactive",
  exampleLang: "bash",
  notes: ["Creates ~/.clawfactory/config.json on success."],
  badge: validBadge,
};

// ─── CliCommandOptionSchema ────────────────────────────────────────────────────

describe("CliCommandOptionSchema", () => {
  it("accepts a valid option with a default value", () => {
    expect(CliCommandOptionSchema.safeParse(validOption).success).toBe(true);
  });

  it("accepts a valid option without a default value", () => {
    const { default: _d, ...noDefault } = validOption;
    expect(CliCommandOptionSchema.safeParse(noDefault).success).toBe(true);
  });

  it("rejects an option with an empty flag", () => {
    expect(
      CliCommandOptionSchema.safeParse({ ...validOption, flag: "" }).success
    ).toBe(false);
  });

  it("rejects an option with an empty description", () => {
    expect(
      CliCommandOptionSchema.safeParse({ ...validOption, description: "" })
        .success
    ).toBe(false);
  });

  it("rejects an option missing the flag field", () => {
    const { flag: _f, ...noFlag } = validOption;
    expect(CliCommandOptionSchema.safeParse(noFlag).success).toBe(false);
  });
});

// ─── CliBadgeSchema ────────────────────────────────────────────────────────────

describe("CliBadgeSchema", () => {
  it("accepts a valid badge", () => {
    expect(CliBadgeSchema.safeParse(validBadge).success).toBe(true);
  });

  it("rejects a badge with an empty label", () => {
    expect(
      CliBadgeSchema.safeParse({ ...validBadge, label: "" }).success
    ).toBe(false);
  });

  it("rejects a badge with an empty color", () => {
    expect(
      CliBadgeSchema.safeParse({ ...validBadge, color: "" }).success
    ).toBe(false);
  });
});

// ─── CliCommandSchema ─────────────────────────────────────────────────────────

describe("CliCommandSchema", () => {
  it("accepts a minimal valid command (required fields only)", () => {
    expect(CliCommandSchema.safeParse(validCommand).success).toBe(true);
  });

  it("accepts a fully-populated valid command", () => {
    expect(CliCommandSchema.safeParse(fullCommand).success).toBe(true);
  });

  it("rejects a command that does not start with 'clawfactory '", () => {
    expect(
      CliCommandSchema.safeParse({
        ...validCommand,
        command: "factory setup",
      }).success
    ).toBe(false);
  });

  it("rejects a command with an empty command string", () => {
    expect(
      CliCommandSchema.safeParse({ ...validCommand, command: "" }).success
    ).toBe(false);
  });

  it("rejects a command with a non-kebab-case anchor", () => {
    expect(
      CliCommandSchema.safeParse({ ...validCommand, anchor: "Setup Cmd" })
        .success
    ).toBe(false);
  });

  it("rejects a command with an anchor that is not lowercase", () => {
    expect(
      CliCommandSchema.safeParse({ ...validCommand, anchor: "Setup" }).success
    ).toBe(false);
  });

  it("rejects a command with an empty name", () => {
    expect(
      CliCommandSchema.safeParse({ ...validCommand, name: "" }).success
    ).toBe(false);
  });

  it("rejects a command whose description exceeds 300 characters", () => {
    expect(
      CliCommandSchema.safeParse({
        ...validCommand,
        description: "D".repeat(301),
      }).success
    ).toBe(false);
  });

  it("accepts a command with options as an empty array", () => {
    expect(
      CliCommandSchema.safeParse({ ...validCommand, options: [] }).success
    ).toBe(true);
  });

  it("rejects a command where an option has an empty flag", () => {
    expect(
      CliCommandSchema.safeParse({
        ...validCommand,
        options: [{ flag: "", description: "desc" }],
      }).success
    ).toBe(false);
  });

  it("accepts commands where optional fields are absent", () => {
    // none of usage / options / example / notes / badge are required
    const result = CliCommandSchema.safeParse({
      command: "clawfactory health",
      anchor: "health",
      name: "health",
      description: "Print system health.",
    });
    expect(result.success).toBe(true);
  });
});

// ─── CliCommandListSchema ─────────────────────────────────────────────────────

describe("CliCommandListSchema", () => {
  it("accepts a non-empty array of valid commands", () => {
    expect(CliCommandListSchema.safeParse([validCommand]).success).toBe(true);
  });

  it("rejects an empty array", () => {
    expect(CliCommandListSchema.safeParse([]).success).toBe(false);
  });

  it("rejects a list containing an invalid command", () => {
    expect(
      CliCommandListSchema.safeParse([{ ...validCommand, command: "" }])
        .success
    ).toBe(false);
  });

  it("rejects a list with duplicate anchors", () => {
    const result = CliCommandListSchema.safeParse([
      validCommand,
      { ...validCommand, command: "clawfactory init" },
    ]);
    expect(result.success).toBe(false);
    expect(result.error.message).toContain("Duplicate anchors");
  });

  it("rejects a list with duplicate command strings", () => {
    const result = CliCommandListSchema.safeParse([
      validCommand,
      { ...validCommand, anchor: "setup-2" },
    ]);
    expect(result.success).toBe(false);
    expect(result.error.message).toContain("Duplicate command strings");
  });

  it("accepts a list where each command has a unique anchor and command string", () => {
    const two = [
      validCommand,
      {
        command: "clawfactory build",
        anchor: "build",
        name: "build",
        description: "Start the build loop.",
      },
    ];
    expect(CliCommandListSchema.safeParse(two).success).toBe(true);
  });
});
