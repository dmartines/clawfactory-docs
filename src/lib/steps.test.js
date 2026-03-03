import { describe, it, expect } from "vitest";
import { STEPS } from "./steps.js";

describe("STEPS (src/lib/steps re-export)", () => {
  it("exports an array", () => {
    expect(Array.isArray(STEPS)).toBe(true);
  });

  it("exports exactly four step cards", () => {
    expect(STEPS).toHaveLength(4);
  });

  it("every card has a positive integer step number", () => {
    for (const card of STEPS) {
      expect(Number.isInteger(card.step)).toBe(true);
      expect(card.step).toBeGreaterThan(0);
    }
  });

  it("step numbers are sequential starting at 1", () => {
    const numbers = STEPS.map((s) => s.step);
    expect(numbers).toEqual([1, 2, 3, 4]);
  });

  it("every card has a non-empty title", () => {
    for (const card of STEPS) {
      expect(typeof card.title).toBe("string");
      expect(card.title.length).toBeGreaterThan(0);
    }
  });

  it("every card has a non-empty description", () => {
    for (const card of STEPS) {
      expect(typeof card.description).toBe("string");
      expect(card.description.length).toBeGreaterThan(0);
    }
  });

  it("contains the four spec-defined workflow step titles", () => {
    const titles = STEPS.map((s) => s.title);
    expect(titles[0]).toContain("SPEC.md");
    expect(titles[1]).toContain("init");
    expect(titles[2]).toContain("build");
    expect(titles[3]).toContain("deploy");
  });

  it("is the same data as lib/data/steps", async () => {
    const { steps } = await import("../../lib/data/steps.js");
    expect(STEPS).toEqual(steps);
  });
});
