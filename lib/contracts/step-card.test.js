import { describe, it, expect } from "vitest";
import { StepCardSchema, StepCardListSchema } from "./step-card.js";

const validStep = {
  step: 1,
  title: "Write your SPEC.md",
  description:
    "Describe your app in plain markdown. Be specific about data models and routes.",
};

describe("StepCardSchema", () => {
  it("accepts a valid step card", () => {
    const result = StepCardSchema.safeParse(validStep);
    expect(result.success).toBe(true);
  });

  it("parses step, title, and description correctly", () => {
    const parsed = StepCardSchema.parse(validStep);
    expect(parsed.step).toBe(1);
    expect(parsed.title).toBe("Write your SPEC.md");
    expect(parsed.description).toContain("markdown");
  });

  it("rejects a non-integer step", () => {
    const result = StepCardSchema.safeParse({ ...validStep, step: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects a zero step", () => {
    const result = StepCardSchema.safeParse({ ...validStep, step: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a negative step", () => {
    const result = StepCardSchema.safeParse({ ...validStep, step: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects an empty title", () => {
    const result = StepCardSchema.safeParse({ ...validStep, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty description", () => {
    const result = StepCardSchema.safeParse({ ...validStep, description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing step field", () => {
    const { step: _omit, ...rest } = validStep;
    const result = StepCardSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a missing title field", () => {
    const { title: _omit, ...rest } = validStep;
    const result = StepCardSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a missing description field", () => {
    const { description: _omit, ...rest } = validStep;
    const result = StepCardSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts step numbers larger than 9 (multi-digit)", () => {
    const result = StepCardSchema.safeParse({ ...validStep, step: 12 });
    expect(result.success).toBe(true);
  });
});

describe("StepCardListSchema", () => {
  it("accepts a non-empty array of valid step cards", () => {
    const result = StepCardListSchema.safeParse([validStep]);
    expect(result.success).toBe(true);
  });

  it("accepts multiple valid step cards", () => {
    const steps = [
      validStep,
      { step: 2, title: "Run init", description: "Bootstrap the project." },
      { step: 3, title: "Run build", description: "Agents build the app." },
    ];
    const result = StepCardListSchema.safeParse(steps);
    expect(result.success).toBe(true);
  });

  it("rejects an empty array", () => {
    const result = StepCardListSchema.safeParse([]);
    expect(result.success).toBe(false);
  });

  it("rejects an array containing an invalid step card", () => {
    const result = StepCardListSchema.safeParse([{ ...validStep, step: 0 }]);
    expect(result.success).toBe(false);
  });
});
