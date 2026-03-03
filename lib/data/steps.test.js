import { describe, it, expect } from "vitest";
import { steps } from "./steps.js";

describe("steps data", () => {
  it("exports exactly four step cards", () => {
    expect(steps).toHaveLength(4);
  });

  it("every card has a non-empty title and description", () => {
    for (const card of steps) {
      expect(card.title).toBeTruthy();
      expect(card.description).toBeTruthy();
    }
  });

  it("step numbers are sequential starting at 1", () => {
    const numbers = steps.map((s) => s.step);
    expect(numbers).toEqual([1, 2, 3, 4]);
  });

  it("step numbers are unique", () => {
    const numbers = steps.map((s) => s.step);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("all step numbers are positive integers", () => {
    for (const card of steps) {
      expect(Number.isInteger(card.step)).toBe(true);
      expect(card.step).toBeGreaterThan(0);
    }
  });

  it("contains the four spec-defined workflow steps", () => {
    const titles = steps.map((s) => s.title);
    expect(titles[0]).toContain("SPEC.md");
    expect(titles[1]).toContain("init");
    expect(titles[2]).toContain("build");
    expect(titles[3]).toContain("deploy");
  });

  it("first step describes writing a spec", () => {
    const first = steps.find((s) => s.step === 1);
    expect(first).toBeDefined();
    expect(first.description.toLowerCase()).toContain("markdown");
  });

  it("second step describes the init command", () => {
    const second = steps.find((s) => s.step === 2);
    expect(second).toBeDefined();
    expect(second.description.toLowerCase()).toContain("spec");
  });

  it("third step mentions agents or build loop", () => {
    const third = steps.find((s) => s.step === 3);
    expect(third).toBeDefined();
    expect(third.description.toLowerCase()).toMatch(/agents?|build/);
  });

  it("fourth step mentions deploy or ship", () => {
    const fourth = steps.find((s) => s.step === 4);
    expect(fourth).toBeDefined();
    expect(fourth.description.toLowerCase()).toMatch(/deploy|ship/);
  });

  it("no title exceeds 60 characters", () => {
    for (const card of steps) {
      expect(card.title.length).toBeLessThanOrEqual(60);
    }
  });

  it("no description exceeds 300 characters", () => {
    for (const card of steps) {
      expect(card.description.length).toBeLessThanOrEqual(300);
    }
  });
});
