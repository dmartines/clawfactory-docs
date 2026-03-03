import { describe, it, expect } from "vitest";
import { cliCommands } from "./cli-commands.js";

// All 12 commands from SPEC.md § 2.5
const EXPECTED_COMMANDS = [
  "clawfactory setup",
  "clawfactory init",
  "clawfactory build",
  "clawfactory status",
  "clawfactory issues",
  "clawfactory approve",
  "clawfactory verify",
  "clawfactory deploy",
  "clawfactory ship",
  "clawfactory health",
  "clawfactory audit",
  "clawfactory server",
];

describe("cliCommands data", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(cliCommands)).toBe(true);
    expect(cliCommands.length).toBeGreaterThan(0);
  });

  it("exports exactly 12 command entries (one per spec command)", () => {
    expect(cliCommands).toHaveLength(12);
  });

  it("every entry has a non-empty command string starting with 'clawfactory '", () => {
    for (const entry of cliCommands) {
      expect(entry.command.trim().length).toBeGreaterThan(0);
      expect(entry.command.startsWith("clawfactory ")).toBe(true);
    }
  });

  it("every entry has a non-empty description", () => {
    for (const entry of cliCommands) {
      expect(entry.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("all command strings are unique", () => {
    const commands = cliCommands.map((e) => e.command);
    expect(new Set(commands).size).toBe(commands.length);
  });

  it("all anchors are unique", () => {
    const anchors = cliCommands.map((e) => e.anchor);
    expect(new Set(anchors).size).toBe(anchors.length);
  });

  it("contains all 12 canonical ClawFactory commands from the spec", () => {
    for (const root of EXPECTED_COMMANDS) {
      const found = cliCommands.some((e) => e.command.startsWith(root));
      expect(found, `Expected to find command starting with "${root}"`).toBe(
        true
      );
    }
  });

  it("every entry that has usage provides it as a string", () => {
    for (const entry of cliCommands) {
      if (entry.usage !== undefined) {
        expect(typeof entry.usage).toBe("string");
        expect(entry.usage.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every entry that has options provides a non-empty array of { flag, description }", () => {
    for (const entry of cliCommands) {
      if (entry.options !== undefined) {
        expect(Array.isArray(entry.options)).toBe(true);
        for (const opt of entry.options) {
          expect(typeof opt.flag).toBe("string");
          expect(opt.flag.trim().length).toBeGreaterThan(0);
          expect(typeof opt.description).toBe("string");
          expect(opt.description.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("every entry that has an example provides it as a string", () => {
    for (const entry of cliCommands) {
      if (entry.example !== undefined) {
        expect(typeof entry.example).toBe("string");
        expect(entry.example.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every entry that has notes provides a non-empty array of strings", () => {
    for (const entry of cliCommands) {
      if (entry.notes !== undefined) {
        expect(Array.isArray(entry.notes)).toBe(true);
        expect(entry.notes.length).toBeGreaterThan(0);
        for (const note of entry.notes) {
          expect(typeof note).toBe("string");
          expect(note.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("clawfactory init entry contains --spec and --template options", () => {
    const init = cliCommands.find((e) => e.command.startsWith("clawfactory init"));
    expect(init).toBeDefined();
    expect(init.options).toBeDefined();
    const flags = init.options.map((o) => o.flag);
    expect(flags.some((f) => f.includes("--spec"))).toBe(true);
    expect(flags.some((f) => f.includes("--template"))).toBe(true);
  });

  it("clawfactory build entry contains --max-iterations option", () => {
    const build = cliCommands.find((e) =>
      e.command.startsWith("clawfactory build")
    );
    expect(build).toBeDefined();
    expect(build.options).toBeDefined();
    const flags = build.options.map((o) => o.flag);
    expect(flags.some((f) => f.includes("--max-iterations"))).toBe(true);
  });

  it("no description exceeds 300 characters", () => {
    for (const entry of cliCommands) {
      expect(
        entry.description.length,
        `Description for "${entry.command}" exceeds 300 chars`
      ).toBeLessThanOrEqual(300);
    }
  });

  it("every anchor matches kebab-case pattern", () => {
    const kebab = /^[a-z0-9-]+$/;
    for (const entry of cliCommands) {
      expect(
        kebab.test(entry.anchor),
        `Anchor "${entry.anchor}" is not kebab-case`
      ).toBe(true);
    }
  });
});
